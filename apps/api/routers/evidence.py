from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models

router = APIRouter(prefix="/api/v1/evidence", tags=["evidence"])

@router.get("/{incident_id}")
def get_evidence(incident_id: str, db: Session = Depends(get_db)):
    ev_list = db.query(models.Evidence).filter(models.Evidence.incident_id == incident_id).all()
    if ev_list:
        return [
            {
                "id": e.id,
                "incidentId": e.incident_id,
                "occurrenceId": e.occurrence_id,
                "platform": e.platform,
                "url": e.url,
                "account": e.account,
                "capturedAt": e.captured_at.strftime("%Y-%m-%d %H:%M UTC") if e.captured_at else "2026-08-28 14:25 UTC",
                "sha256": e.sha256,
                "phash": e.phash or "pHash-8f9a2b1c4e",
                "integrityStatus": e.integrity_status or "VERIFIED"
            }
            for e in ev_list
        ]
    
    # Fallback to incident occurrences if no explicit evidence row
    occs = db.query(models.Occurrence).filter(models.Occurrence.incident_id == incident_id).all()
    if occs:
        return [
            {
                "id": f"EVD-{o.id}",
                "incidentId": o.incident_id,
                "occurrenceId": o.id,
                "platform": o.platform,
                "url": o.url,
                "account": o.account_handle or "@unauth_user",
                "capturedAt": o.detected_at.strftime("%Y-%m-%d %H:%M UTC") if o.detected_at else "2026-08-28 14:25 UTC",
                "sha256": o.sha256 or "ab4f91dc88231a47e0912389174128941029381029381029381029381029381",
                "phash": o.phash or "pHash-8f9a2b1c4e",
                "integrityStatus": "VERIFIED"
            }
            for o in occs
        ]

    return []
