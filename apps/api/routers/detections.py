import json
import os
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from database import get_db
import models
from services.fingerprint_service import FingerprintService
from services.advanced_matcher import AdvancedMediaMatcher
from services.live_scanner_service import LiveScannerService
from services.ssrf_service import SSRFProtectionService

router = APIRouter(prefix="/api/v1/detections", tags=["detections"])

@router.post("/scan")
async def scan_live_media(
    name: str = Form("Dr. Evelyn Carter"),
    handles: str = Form("@evelyn_carter, @drcarter_bio"),
    job_title: Optional[str] = Form(None),
    keywords: Optional[str] = Form(None),
    incident_id: str = Form("HC-2041"),
    processing_mode: str = Form("CONSENTED_ANALYSIS"), # "LOCAL_FINGERPRINT" or "CONSENTED_ANALYSIS"
    client_phash: Optional[str] = Form(None),
    client_sha256: Optional[str] = Form(None),
    target_url: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    file1: Optional[UploadFile] = File(None),
    file2: Optional[UploadFile] = File(None),
    file3: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    """
    Executes discovery scanning supporting both:
    1. LOCAL FINGERPRINT MODE: client computes hashes locally, original media never uploaded.
    2. CONSENTED ANALYSIS MODE: server receives media with explicit consent, performs multi-stage matching.
    """
    # Validate SSRF if external URL provided
    if target_url:
        is_safe, msg = SSRFProtectionService.validate_url(target_url)
        if not is_safe:
            raise HTTPException(status_code=400, detail=f"SSRF Protection Error: {msg}")

    # Process uploaded photo or client fingerprint
    image_bytes = None
    image_meta = {
        "phash": client_phash or "pHash-c0c0c0c03f3f3f3f",
        "dhash": "dHash-82a25ca000000000",
        "sha256": client_sha256 or "4f1fbc178456b8433a764893fb10a4d9ab4f91dc88231a47e091238917412894",
        "filename": "reference_profile.jpg",
        "mode": processing_mode
    }

    if processing_mode == "CONSENTED_ANALYSIS" and file:
        image_bytes = await file.read()
        if len(image_bytes) > 0:
            hashes = FingerprintService.calculate_image_hashes(image_bytes)
            sha = FingerprintService.calculate_sha256(image_bytes)
            image_meta = {
                "phash": hashes["phash"],
                "dhash": hashes["dhash"],
                "sha256": sha,
                "filename": file.filename or "uploaded_photo.jpg",
                "mode": processing_mode
            }

    # Parse target handles
    handle_list = [h.strip() for h in handles.split(",") if h.strip()]

    # Perform web & social scan simulation
    live_results = LiveScannerService.scan_web_and_social(
        target_name=name,
        target_handles=handle_list,
        keywords=keywords or job_title or "",
        image_bytes=image_bytes,
        limit=10
    )

    # Persist discovered live occurrences into SQLite database
    try:
        incident = db.query(models.Incident).filter(models.Incident.id == incident_id).first()
        if incident:
            for item in live_results[:5]:
                occ_id = f"OCC-{item['id']}"
                existing = db.query(models.Occurrence).filter((models.Occurrence.url == item["url"]) | (models.Occurrence.id == occ_id)).first()
                if not existing:
                    score = item["similarity_score"]
                    rec_state = "VERIFIED_RELATED" if score >= 85 else "RELATED_CANDIDATE" if score >= 70 else "REVIEW_REQUIRED"
                    
                    new_occ = models.Occurrence(
                        id=f"OCC-{item['id']}",
                        incident_id=incident.id,
                        platform=item["platform"],
                        variant_type=item["variant_type"],
                        url=item["url"],
                        account_handle=item["account"],
                        similarity_score=score,
                        risk_level="CRITICAL" if score >= 90 else "HIGH" if score >= 75 else "MEDIUM",
                        processing_state="SUCCEEDED",
                        review_state=rec_state,
                        partner_outcome_state="NOT_SUBMITTED",
                        status="Active",
                        sha256=image_meta["sha256"],
                        phash=image_meta["phash"],
                        ocr_text=item.get("snippet"),
                        signals_json=json.dumps({
                            "visual_score": score,
                            "text_score": score,
                            "mode": processing_mode
                        })
                    )
                    db.add(new_occ)
            db.commit()
    except Exception as db_err:
        print(f"[Database Persistence Error] {db_err}")
        db.rollback()

    return {
        "status": "success",
        "processing_mode": processing_mode,
        "query": {
            "name": name,
            "handles": handle_list,
            "job_title": job_title,
            "keywords": keywords
        },
        "image_metadata": image_meta,
        "scanned_count": len(live_results),
        "results": live_results
    }
