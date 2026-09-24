import secrets
import hashlib
import uuid
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Form
from typing import Optional, List
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter(prefix="/api/v1/access", tags=["access"])

@router.get("/settings")
def get_access_settings(profile_id: str = "PROF-8821", db: Session = Depends(get_db)):
    profile = db.query(models.ProtectedProfile).filter(models.ProtectedProfile.id == profile_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found.")

    consent = profile.consent
    grants = db.query(models.RepresentativeGrant).filter(
        models.RepresentativeGrant.profile_id == profile_id,
        models.RepresentativeGrant.status == "ACTIVE"
    ).all()

    unused_recovery = db.query(models.RecoveryCredential).filter(
        models.RecoveryCredential.profile_id == profile_id,
        models.RecoveryCredential.used == False
    ).count()

    return {
        "profile_id": profile_id,
        "full_name": profile.full_name,
        "processing_mode": consent.processing_mode if consent else "CONSENTED_ANALYSIS",
        "retention_days": consent.retention_days if consent else 30,
        "is_consent_active": consent.is_active if consent else False,
        "active_representatives_count": len(grants),
        "unused_recovery_codes_count": unused_recovery,
        "mfa_enabled": True
    }

@router.post("/mode")
def update_processing_mode(
    profile_id: str = Form("PROF-8821"),
    mode: str = Form("CONSENTED_ANALYSIS"), # "LOCAL_FINGERPRINT" or "CONSENTED_ANALYSIS"
    retention_days: int = Form(30),
    db: Session = Depends(get_db)
):
    profile = db.query(models.ProtectedProfile).filter(models.ProtectedProfile.id == profile_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found.")

    consent = profile.consent
    if not consent:
        consent = models.Consent(profile_id=profile_id, is_active=True)
        db.add(consent)

    consent.processing_mode = mode.upper()
    consent.retention_days = retention_days
    db.commit()

    return {
        "status": "success",
        "profile_id": profile_id,
        "processing_mode": consent.processing_mode,
        "retention_days": consent.retention_days,
        "message": "Local Fingerprint Mode sends only client-computed descriptors; Consented Analysis Mode allows secure server-side verification."
    }

@router.post("/recovery/generate")
def generate_recovery_codes(profile_id: str = Form("PROF-8821"), count: int = Form(8), db: Session = Depends(get_db)):
    """
    Generates high-entropy, one-time recovery codes.
    Stores only salted SHA-256 hashes in database. Plaintext returned only once.
    """
    profile = db.query(models.ProtectedProfile).filter(models.ProtectedProfile.id == profile_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found.")

    # Invalidate previous unused codes
    db.query(models.RecoveryCredential).filter(
        models.RecoveryCredential.profile_id == profile_id,
        models.RecoveryCredential.used == False
    ).delete()

    generated_codes = []
    for _ in range(count):
        # 16-character alphanumeric recovery code formatted as XXXX-XXXX-XXXX-XXXX
        raw = secrets.token_hex(8).upper()
        formatted = f"{raw[:4]}-{raw[4:8]}-{raw[8:12]}-{raw[12:16]}"
        salt = secrets.token_hex(16)
        code_hash = hashlib.sha256(f"{salt}:{formatted}".encode()).hexdigest()

        cred = models.RecoveryCredential(
            profile_id=profile_id,
            code_hash=code_hash,
            salt=salt,
            used=False
        )
        db.add(cred)
        generated_codes.append(formatted)

    audit = models.AuditLog(
        actor="authorized_owner",
        action="GENERATE_RECOVERY_CODES",
        details=f"Generated {count} one-time recovery codes for profile {profile_id}. Stored as salted hashes."
    )
    db.add(audit)
    db.commit()

    return {
        "profile_id": profile_id,
        "codes": generated_codes,
        "warning": "Save these recovery codes securely. They will never be displayed again."
    }

@router.post("/recovery/redeem")
def redeem_recovery_code(
    code: str = Form(...),
    profile_id: str = Form("PROF-8821"),
    db: Session = Depends(get_db)
):
    clean_code = code.strip().upper()
    creds = db.query(models.RecoveryCredential).filter(
        models.RecoveryCredential.profile_id == profile_id,
        models.RecoveryCredential.used == False
    ).all()

    for cred in creds:
        computed = hashlib.sha256(f"{cred.salt}:{clean_code}".encode()).hexdigest()
        if computed == cred.code_hash:
            cred.used = True
            cred.used_at = datetime.utcnow()
            
            audit = models.AuditLog(
                actor="system_auth",
                action="REDEEM_RECOVERY_CODE",
                details=f"Single-use recovery code successfully redeemed for profile {profile_id}."
            )
            db.add(audit)
            db.commit()
            return {"status": "SUCCESS", "message": "Recovery code verified and burned. Account restored."}

    raise HTTPException(status_code=401, detail="Invalid or already used recovery code.")

@router.post("/representatives", response_model=schemas.RepresentativeGrantResponse)
def create_representative_grant(
    representative_email: str = Form(...),
    representative_name: Optional[str] = Form(None),
    profile_id: str = Form("PROF-8821"),
    incident_id: Optional[str] = Form("HC-2041"),
    scopes: str = Form("SUBMIT,VIEW_MEDIA,REVIEW"),
    duration_days: int = Form(7),
    db: Session = Depends(get_db)
):
    invitation_token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(invitation_token.encode()).hexdigest()
    expires_at = datetime.utcnow() + timedelta(days=duration_days)

    grant = models.RepresentativeGrant(
        profile_id=profile_id,
        incident_id=incident_id,
        representative_email=representative_email,
        representative_name=representative_name or representative_email.split("@")[0],
        scopes=scopes,
        token_hash=token_hash,
        status="ACTIVE",
        expires_at=expires_at
    )
    db.add(grant)

    audit = models.AuditLog(
        actor="authorized_owner",
        action="GRANT_REPRESENTATIVE_ACCESS",
        incident_id=incident_id,
        details=f"Granted representative access to {representative_email} with scopes [{scopes}]. Expires in {duration_days} days."
    )
    db.add(audit)
    db.commit()
    db.refresh(grant)

    invitation_url = f"https://sentinel-web.example.com/representatives/accept?token={invitation_token}&grant={grant.id}"

    return {
        "id": grant.id,
        "profile_id": grant.profile_id,
        "incident_id": grant.incident_id,
        "representative_email": grant.representative_email,
        "representative_name": grant.representative_name,
        "scopes": grant.scopes,
        "invitation_url": invitation_url,
        "status": grant.status,
        "created_at": grant.created_at,
        "expires_at": grant.expires_at,
        "revoked_at": grant.revoked_at
    }

@router.get("/representatives", response_model=List[schemas.RepresentativeGrantResponse])
def list_representative_grants(profile_id: str = "PROF-8821", db: Session = Depends(get_db)):
    grants = db.query(models.RepresentativeGrant).filter(models.RepresentativeGrant.profile_id == profile_id).all()
    return grants

@router.delete("/representatives/{grant_id}")
def revoke_representative_grant(grant_id: str, db: Session = Depends(get_db)):
    grant = db.query(models.RepresentativeGrant).filter(models.RepresentativeGrant.id == grant_id).first()
    if not grant:
        raise HTTPException(status_code=404, detail="Grant not found.")

    grant.status = "REVOKED"
    grant.revoked_at = datetime.utcnow()

    audit = models.AuditLog(
        actor="authorized_owner",
        action="REVOKE_REPRESENTATIVE_ACCESS",
        incident_id=grant.incident_id,
        details=f"Revoked representative grant {grant_id} for {grant.representative_email} immediately."
    )
    db.add(audit)
    db.commit()
    return {"status": "revoked", "grant_id": grant_id, "message": "Access revoked immediately."}
