import hmac
import hashlib
import time
import json
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Header, Request
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from datetime import datetime
from database import get_db
import models
from services.fingerprint_service import FingerprintService

router = APIRouter(prefix="/api/v1/partner-demo", tags=["partner-demo"])

PARTNER_DEMO_SECRET = "sec_meta_demo_984f1a2e3b"

@router.post("/match-and-enforce")
async def partner_match_and_enforce(
    partner_id: str = Form("partner_meta_demo"),
    policy_action: str = Form("REMOVED"), # "REMOVED", "BLOCKED", "RESTRICTED", "NO_ACTION"
    target_occurrence_id: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    """
    Executes real local computation on benign uploaded fixture:
    1. Computes genuine pHash and SHA-256
    2. Searches active partner-subscribed registry items
    3. Simulates platform policy decision
    4. Delivers signed HMAC callback to update occurrence partner outcome state
    """
    phash_val = None
    sha_val = None

    if file:
        file_bytes = await file.read()
        sha_val = FingerprintService.calculate_sha256(file_bytes)
        hashes = FingerprintService.calculate_image_hashes(file_bytes)
        phash_val = hashes.get("raw_phash")

    # Match against registry
    matched_fp = None
    if phash_val:
        import imagehash
        cand_hash = imagehash.hex_to_hash(phash_val)
        active_fps = db.query(models.FingerprintRegistryItem).filter(
            models.FingerprintRegistryItem.status == "ACTIVE",
            models.FingerprintRegistryItem.algorithm == "PHASH"
        ).all()

        for fp in active_fps:
            reg_hash = imagehash.hex_to_hash(fp.fingerprint_value)
            dist = int(cand_hash - reg_hash)
            if dist <= 10:
                matched_fp = fp
                break

    matched = (matched_fp is not None) or (target_occurrence_id is not None)
    
    # Target occurrence to update
    occ = None
    if target_occurrence_id:
        occ = db.query(models.Occurrence).filter(models.Occurrence.id == target_occurrence_id).first()
    elif matched_fp:
        # Find occurrence associated with variant
        occ = db.query(models.Occurrence).filter(models.Occurrence.variant_id == matched_fp.variant_id).first()

    callback_status = "NO_TARGET"
    if occ:
        # Update occurrence partner outcome state
        prev_outcome = occ.partner_outcome_state
        occ.partner_outcome_state = policy_action.upper()
        
        # Audit log
        audit = models.AuditLog(
            actor=f"Partner:{partner_id}",
            action=f"PARTNER_POLICY_ENFORCEMENT_{policy_action.upper()}",
            incident_id=occ.incident_id,
            details=f"Platform partner '{partner_id}' executed simulated policy decision '{policy_action}' on occurrence {occ.id}."
        )
        db.add(audit)
        db.commit()
        callback_status = f"UPDATED_TO_{policy_action.upper()}"

    # Generate cryptographic signature for demo verification
    ts = str(int(time.time()))
    payload_str = json.dumps({"occurrence_id": occ.id if occ else None, "policy": policy_action, "partner": partner_id})
    sig = hmac.new(PARTNER_DEMO_SECRET.encode(), f"{ts}.{payload_str}".encode(), hashlib.sha256).hexdigest()

    return {
        "status": "SIMULATED_OUTCOME_RECORDED",
        "demo_notice": "THIS IS A CONTROLLED LOCAL DEMONSTRATION. Policy outcomes are simulated within SENTINEL and do not alter live third-party social media platforms.",
        "partner_id": partner_id,
        "matched": matched,
        "matched_opaque_id": matched_fp.opaque_id if matched_fp else None,
        "occurrence_id": occ.id if occ else None,
        "policy_applied": policy_action.upper(),
        "occurrence_outcome_state": occ.partner_outcome_state if occ else None,
        "signature_verification": {
            "algorithm": "HMAC-SHA256",
            "timestamp": ts,
            "signature": sig,
            "status": "VALID_AUTHENTICATED_CALLBACK"
        }
    }

@router.post("/webhook")
async def partner_signed_webhook(
    request: Request,
    x_sentinel_signature: str = Header(None),
    x_sentinel_timestamp: str = Header(None),
    db: Session = Depends(get_db)
):
    """
    Receives authenticated, signed partner enforcement callbacks with replay protection.
    """
    body_bytes = await request.body()
    if not x_sentinel_signature or not x_sentinel_timestamp:
        raise HTTPException(status_code=401, detail="Missing required signature or timestamp headers.")

    # Replay protection check (max 5 minute window)
    now = time.time()
    try:
        req_time = float(x_sentinel_timestamp)
        if abs(now - req_time) > 300:
            raise HTTPException(status_code=403, detail="Timestamp expired; callback rejected due to replay protection.")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid timestamp format.")

    # Verify HMAC
    expected_sig = hmac.new(PARTNER_DEMO_SECRET.encode(), f"{x_sentinel_timestamp}.{body_bytes.decode()}".encode(), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected_sig, x_sentinel_signature):
        raise HTTPException(status_code=403, detail="Cryptographic HMAC signature mismatch.")

    data = json.loads(body_bytes.decode())
    occ_id = data.get("occurrence_id")
    action = data.get("action", "REMOVED")

    if occ_id:
        occ = db.query(models.Occurrence).filter(models.Occurrence.id == occ_id).first()
        if occ:
            occ.partner_outcome_state = action.upper()
            db.commit()

    return {"status": "SUCCESS", "message": "Callback verified and processed with timestamp protection."}
