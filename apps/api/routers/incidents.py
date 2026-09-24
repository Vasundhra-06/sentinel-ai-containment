import json
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from datetime import datetime
from database import get_db
import models, schemas
from services.fingerprint_service import FingerprintService
from services.advanced_matcher import AdvancedMediaMatcher

router = APIRouter(prefix="/api/v1/incidents", tags=["incidents"])

@router.get("", response_model=List[schemas.IncidentSchema])
def list_incidents(db: Session = Depends(get_db)):
    incidents = db.query(models.Incident).all()
    return incidents

@router.post("", response_model=schemas.IncidentSchema)
def create_incident(
    id: str = Form(...), # e.g. "HC-2042"
    title: str = Form(...),
    profile_id: str = Form("PROF-8821"),
    category: str = Form("UNCONSENTED_MEDIA"),
    description: Optional[str] = Form(None),
    risk_level: str = Form("HIGH"),
    db: Session = Depends(get_db)
):
    existing = db.query(models.Incident).filter(models.Incident.id == id).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Incident with ID {id} already exists.")

    new_inc = models.Incident(
        id=id,
        title=title,
        profile_id=profile_id,
        category=category,
        description=description,
        risk_level=risk_level,
        status="ACTIVE MONITORING"
    )
    db.add(new_inc)

    # Audit log
    audit = models.AuditLog(
        actor="authorized_owner",
        action="CREATE_MASTER_INCIDENT",
        incident_id=id,
        details=f"Master Incident {id} created under category '{category}'."
    )
    db.add(audit)
    db.commit()
    db.refresh(new_inc)
    return new_inc

@router.get("/{incident_id}", response_model=schemas.IncidentDetailSchema)
def get_incident_detail(incident_id: str, db: Session = Depends(get_db)):
    incident = db.query(models.Incident).filter(models.Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail=f"Incident {incident_id} not found.")

    refs = incident.references or []
    variants = incident.variants or []
    occurrences = incident.occurrences or []

    # Calculate containment rate
    removed_count = sum(1 for o in occurrences if o.partner_outcome_state == "REMOVED")
    containment_rate = round((removed_count / len(occurrences) * 100)) if occurrences else 100

    profile_name = incident.profile.full_name if incident.profile else "Dr. Evelyn Carter"

    return {
        "id": incident.id,
        "title": incident.title,
        "profile_id": incident.profile_id,
        "category": incident.category or "UNCONSENTED_MEDIA",
        "status": incident.status,
        "risk_score": incident.risk_score,
        "risk_level": incident.risk_level,
        "description": incident.description,
        "created_at": incident.created_at,
        "updated_at": incident.updated_at,
        "protected_profile_name": profile_name,
        "references_count": len(refs),
        "variants_count": len(variants),
        "occurrences_count": len(occurrences),
        "containment_rate": containment_rate,
        "references": refs,
        "variants": variants,
        "occurrences": occurrences
    }

@router.get("/{incident_id}/variants", response_model=List[schemas.VariantSchema])
def get_incident_variants(incident_id: str, db: Session = Depends(get_db)):
    variants = db.query(models.Variant).filter(models.Variant.incident_id == incident_id).all()
    return variants

@router.post("/{incident_id}/variants", response_model=schemas.VariantSchema)
async def enrol_variant(
    incident_id: str,
    label: str = Form(...),
    variant_type: str = Form("MODIFIED"),
    reason: str = Form(...),
    reviewer: str = Form("lead_analyst_01"),
    occurrence_id: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    """
    Enrols a new media variant into the Master Incident.
    Computes fingerprints, regional tile hashes, and adds eligible entries to the Registry.
    """
    incident = db.query(models.Incident).filter(models.Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found.")

    sha = None
    phash = None
    dhash = None
    ahash = None
    tiles_json = None

    if file:
        file_bytes = await file.read()
        sha = FingerprintService.calculate_sha256(file_bytes)
        hashes = FingerprintService.calculate_image_hashes(file_bytes)
        phash = hashes["phash"]
        dhash = hashes["dhash"]
        ahash = hashes["ahash"]
        tiles_json = json.dumps(hashes.get("tile_hashes", {}))
    elif occurrence_id:
        occ = db.query(models.Occurrence).filter(models.Occurrence.id == occurrence_id).first()
        if occ:
            sha = occ.sha256
            phash = occ.phash
            dhash = occ.dhash
            ahash = occ.ahash

    # Generate sequential variant ID
    existing_count = db.query(models.Variant).filter(models.Variant.incident_id == incident_id).count()
    var_id = f"VAR-{incident_id.replace('HC-', '')}-{existing_count + 1:02d}"

    variant = models.Variant(
        id=var_id,
        incident_id=incident_id,
        variant_type=variant_type.upper(),
        label=label,
        sha256=sha,
        phash=phash,
        dhash=dhash,
        ahash=ahash,
        regional_hashes_json=tiles_json,
        status="VERIFIED_RELATED",
        enrolled_at=datetime.utcnow(),
        reviewer_id=reviewer,
        decision_reason=reason
    )
    db.add(variant)
    db.flush()

    # If linked to an occurrence, update occurrence state
    if occurrence_id:
        occ = db.query(models.Occurrence).filter(models.Occurrence.id == occurrence_id).first()
        if occ:
            occ.variant_id = variant.id
            occ.review_state = "VERIFIED_RELATED"

    # Add active fingerprint to Registry
    if phash:
        reg_item = models.FingerprintRegistryItem(
            opaque_id=f"REG-FP-{var_id}",
            variant_id=variant.id,
            incident_id=incident_id,
            algorithm="PHASH",
            version="1.0",
            format="HEX",
            fingerprint_value=phash.replace("pHash-", ""),
            status="ACTIVE",
            authorization_scope="GLOBAL_CONTAINMENT",
            revision=1,
            enrolled_by=reviewer
        )
        db.add(reg_item)

    # Log audit trail
    audit = models.AuditLog(
        actor=reviewer,
        action="ENROL_VERIFIED_VARIANT",
        incident_id=incident_id,
        details=f"Enrolled variant {var_id} ('{label}') into Incident {incident_id}. Rationale: {reason}"
    )
    db.add(audit)
    db.commit()
    db.refresh(variant)
    return variant

@router.post("/{incident_id}/variants/{variant_id}/review")
def review_variant(
    incident_id: str,
    variant_id: str,
    req: schemas.ReviewDecisionRequest,
    db: Session = Depends(get_db)
):
    variant = db.query(models.Variant).filter(models.Variant.id == variant_id, models.Variant.incident_id == incident_id).first()
    if not variant:
        raise HTTPException(status_code=404, detail="Variant not found.")

    prev_state = variant.status
    if req.action == "APPROVE_VARIANT":
        variant.status = "VERIFIED_RELATED"
        variant.enrolled_at = datetime.utcnow()
    elif req.action == "REJECT":
        variant.status = "REJECTED"
    elif req.action == "DETACH":
        variant.status = "DETACHED"
    elif req.action == "REVOKE":
        variant.status = "REVOKED"
        # Invalidate active registry entries
        fps = db.query(models.FingerprintRegistryItem).filter(models.FingerprintRegistryItem.variant_id == variant_id).all()
        for fp in fps:
            fp.status = "REVOKED"
            fp.revoked_at = datetime.utcnow()

    variant.reviewer_id = req.reviewer
    variant.decision_reason = req.reason

    # Record review decision
    decision = models.ReviewDecision(
        variant_id=variant_id,
        reviewer=req.reviewer,
        action=req.action,
        previous_state=prev_state,
        new_state=variant.status,
        reason=req.reason
    )
    db.add(decision)

    audit = models.AuditLog(
        actor=req.reviewer,
        action=f"VARIANT_{req.action}",
        incident_id=incident_id,
        details=f"Variant {variant_id} state changed from {prev_state} to {variant.status}. Reason: {req.reason}"
    )
    db.add(audit)
    db.commit()
    db.refresh(variant)
    return {"status": "success", "variant_id": variant_id, "new_state": variant.status, "reason": req.reason}

@router.post("/{incident_id}/variants/{variant_id}/revoke")
def revoke_variant(
    incident_id: str,
    variant_id: str,
    reviewer: str = Form("lead_analyst_01"),
    reason: str = Form("Revoked upon case owner request or false match finding."),
    db: Session = Depends(get_db)
):
    variant = db.query(models.Variant).filter(models.Variant.id == variant_id, models.Variant.incident_id == incident_id).first()
    if not variant:
        raise HTTPException(status_code=404, detail="Variant not found.")

    variant.status = "REVOKED"
    variant.reviewer_id = reviewer
    variant.decision_reason = reason

    # Invalidate active registry items
    fps = db.query(models.FingerprintRegistryItem).filter(models.FingerprintRegistryItem.variant_id == variant_id).all()
    for fp in fps:
        fp.status = "REVOKED"
        fp.revoked_at = datetime.utcnow()

    # Record revocation event for partner sync
    partners = db.query(models.PartnerSubscription).filter(models.PartnerSubscription.is_active == True).all()
    for p in partners:
        sync_ev = models.PartnerSyncEvent(
            partner_id=p.partner_id,
            cursor=str(int(datetime.utcnow().timestamp())),
            event_type="REVOKE",
            payload_json=json.dumps({"variant_id": variant_id, "incident_id": incident_id, "reason": reason})
        )
        db.add(sync_ev)

    audit = models.AuditLog(
        actor=reviewer,
        action="REVOKE_VARIANT",
        incident_id=incident_id,
        details=f"Variant {variant_id} revoked from active matching & registry. Reason: {reason}"
    )
    db.add(audit)
    db.commit()
    return {"status": "revoked", "variant_id": variant_id, "active_fingerprints_invalidated": len(fps)}

@router.post("/{incident_id}/references", response_model=schemas.ReferenceAssetSchema)
async def add_reference_asset(
    incident_id: str,
    file: UploadFile = File(...),
    provenance: str = Form("Added by authorized user"),
    db: Session = Depends(get_db)
):
    incident = db.query(models.Incident).filter(models.Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found.")

    file_bytes = await file.read()
    sha = FingerprintService.calculate_sha256(file_bytes)
    hashes = FingerprintService.calculate_image_hashes(file_bytes)

    ref = models.ReferenceAsset(
        incident_id=incident_id,
        asset_type="IMAGE",
        original_filename=file.filename or "reference_asset.png",
        sha256=sha,
        phash=hashes["phash"],
        dhash=hashes["dhash"],
        ahash=hashes["ahash"],
        width=hashes.get("width", 512),
        height=hashes.get("height", 512),
        provenance=provenance
    )
    db.add(ref)

    audit = models.AuditLog(
        actor="authorized_owner",
        action="ADD_REFERENCE_ASSET",
        incident_id=incident_id,
        details=f"Added reference asset {file.filename} (SHA-256: {sha[:16]}...) to incident {incident_id}."
    )
    db.add(audit)
    db.commit()
    db.refresh(ref)
    return ref

@router.get("/{incident_id}/occurrences", response_model=List[schemas.OccurrenceSchema])
def get_occurrences(incident_id: str, db: Session = Depends(get_db)):
    occurrences = db.query(models.Occurrence).filter(models.Occurrence.incident_id == incident_id).all()
    return occurrences

@router.get("/{incident_id}/audit-logs")
def get_audit_logs(incident_id: str, db: Session = Depends(get_db)):
    logs = db.query(models.AuditLog).filter(models.AuditLog.incident_id == incident_id).order_by(models.AuditLog.timestamp.desc()).all()
    return [
        {
            "id": log.id,
            "timestamp": log.timestamp.strftime("%Y-%m-%d %H:%M:%S UTC"),
            "actor": log.actor,
            "action": log.action,
            "details": log.details
        }
        for log in logs
    ]
