from fastapi import APIRouter, Response, Depends
from sqlalchemy.orm import Session
from database import get_db
import models
from services.pdf_service import PDFReportGenerator

router = APIRouter(prefix="/api/v1/reports", tags=["reports"])

@router.get("/{incident_id}")
def get_reports(incident_id: str, db: Session = Depends(get_db)):
    reports = db.query(models.Report).filter(models.Report.incident_id == incident_id).all()
    if reports:
        return [
            {
                "id": r.id,
                "incidentId": r.incident_id,
                "occurrenceId": r.occurrence_id,
                "platform": r.platform,
                "targetUrl": r.target_url,
                "submittedAt": r.submitted_at.strftime("%Y-%m-%d %H:%M UTC") if r.submitted_at else "2026-08-28 15:00 UTC",
                "policyCategory": r.policy_category or "Unconsented Media",
                "status": r.status,
                "responseDetails": r.response_details
            }
            for r in reports
        ]

    return [
        {
            "id": f"REP-{incident_id}-01",
            "incidentId": incident_id,
            "occurrenceId": f"{incident_id}-001",
            "platform": "Instagram",
            "targetUrl": "https://instagram.com/p/C9x81_orig",
            "submittedAt": "2026-08-28 15:00 UTC",
            "policyCategory": "Impersonation & Harassment",
            "status": "Removed",
            "responseDetails": "Platform Trust & Safety confirmed violation and restricted content globally."
        }
    ]

@router.get("/{incident_id}/pdf")
def download_report_pdf(incident_id: str, db: Session = Depends(get_db)):
    inc = db.query(models.Incident).filter(models.Incident.id == incident_id).first()
    title = inc.title if inc else "Harmful Content Incident Dossier"
    profile_name = inc.profile.full_name if inc and inc.profile else "Dr. Evelyn Carter"

    db_occs = db.query(models.Occurrence).filter(models.Occurrence.incident_id == incident_id).all()
    if db_occs:
        occurrences = [
            {
                "id": o.id,
                "platform": o.platform,
                "variant_type": o.variant_type,
                "similarity_score": o.similarity_score,
                "status": o.partner_outcome_state or o.status
            }
            for o in db_occs
        ]
    else:
        occurrences = [
            {"id": "HC-2041-001", "platform": "Instagram", "variant_type": "Original", "similarity_score": 100, "status": "Removed"},
            {"id": "HC-2041-002", "platform": "Instagram", "variant_type": "Cropped", "similarity_score": 96, "status": "Removed"},
            {"id": "HC-2041-003", "platform": "X", "variant_type": "Screenshot", "similarity_score": 94, "status": "Restricted"},
        ]
    
    pdf_bytes = PDFReportGenerator.generate_incident_pdf(
        incident_id=incident_id,
        title=title,
        protected_profile=profile_name,
        occurrences=occurrences
    )

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=SENTINEL_DOSSIER_{incident_id}.pdf"}
    )

@router.get("/{incident_id}/second-notice/pdf")
def download_second_notice_pdf(
    incident_id: str,
    original_report_id: str = "REP-2041-01",
    offender: str = "@viral_leak_x",
    platform: str = "Instagram",
    db: Session = Depends(get_db)
):
    inc = db.query(models.Incident).filter(models.Incident.id == incident_id).first()
    profile_name = inc.profile.full_name if inc and inc.profile else "Dr. Evelyn Carter"

    pdf_bytes = PDFReportGenerator.generate_second_notice_pdf(
        incident_id=incident_id,
        original_report_id=original_report_id,
        protected_profile=profile_name,
        offender_account=offender,
        reupload_url="https://instagram.com/reel/C9x81kLmPq/",
        platform=platform
    )

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=SENTINEL_SECOND_NOTICE_{incident_id}.pdf"}
    )
