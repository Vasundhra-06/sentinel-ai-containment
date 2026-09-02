from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter(prefix="/api/v1/incidents", tags=["incidents"])

@router.get("/{incident_id}")
def get_incident(incident_id: str, db: Session = Depends(get_db)):
    incident = db.query(models.Incident).filter(models.Incident.id == incident_id).first()
    if not incident:
        # Fallback response for demonstration if database is empty before seed
        return {
            "id": incident_id,
            "title": "Manipulated Media & Impersonation Campaign",
            "protectedProfile": "Dr. Evelyn Carter",
            "protectedProfileId": "PROF-8821",
            "status": "ACTIVE MONITORING",
            "riskScore": 88,
            "riskLevel": "HIGH",
            "occurrencesCount": 27,
            "platformsCount": 5,
            "variantsCount": 8,
            "reUploadsCount": 4,
            "containmentRate": 78,
            "description": "Unconsented manipulated image combined with defamatory claims regarding student research funds across multiple social platforms."
        }
    return incident

@router.get("/{incident_id}/occurrences")
def get_occurrences(incident_id: str, db: Session = Depends(get_db)):
    occurrences = db.query(models.Occurrence).filter(models.Occurrence.incident_id == incident_id).all()
    if not occurrences:
        return [
            {
                "id": "HC-2041-001",
                "incidentId": incident_id,
                "platform": "Instagram",
                "variantType": "Original",
                "url": "https://instagram.com/p/C9x81_orig",
                "accountHandle": "@unauth_source_01",
                "detectedAt": "2026-08-28 14:22 UTC",
                "similarityScore": 100,
                "riskLevel": "HIGH",
                "status": "Removed",
                "sha256": "ab4f91dc88231a47e0912389174128941029381029381029381029381029381",
                "pHash": "pHash-8f9a2b1c4e"
            },
            {
                "id": "HC-2041-002",
                "incidentId": incident_id,
                "platform": "Instagram",
                "variantType": "Cropped",
                "url": "https://instagram.com/p/C9x92_crop",
                "accountHandle": "@repost_bot_99",
                "detectedAt": "2026-08-28 16:05 UTC",
                "similarityScore": 96,
                "riskLevel": "HIGH",
                "status": "Removed",
                "sha256": "7f8a9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b2c3d4e5f6a7b8c9d0e1f2",
                "pHash": "pHash-8f9a2b1c4f"
            }
        ]
    return occurrences
