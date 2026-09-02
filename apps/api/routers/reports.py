from fastapi import APIRouter, Response
from services.pdf_service import PDFReportGenerator

router = APIRouter(prefix="/api/v1/reports", tags=["reports"])

@router.get("/{incident_id}")
def get_reports(incident_id: str):
    return [
        {
            "id": "REP-2041-01",
            "incidentId": incident_id,
            "occurrenceId": "HC-2041-001",
            "platform": "Instagram",
            "targetUrl": "https://instagram.com/p/C9x81_orig",
            "submittedAt": "2026-08-28 15:00 UTC",
            "policyCategory": "Impersonation & Harassment",
            "status": "Removed",
            "responseDetails": "Meta Trust & Safety confirmed violation and restricted content globally."
        }
    ]

@router.get("/{incident_id}/pdf")
def download_report_pdf(incident_id: str):
    occurrences = [
        {"id": "HC-2041-001", "platform": "Instagram", "variant_type": "Original", "similarity_score": 100, "status": "Removed"},
        {"id": "HC-2041-002", "platform": "Instagram", "variant_type": "Cropped", "similarity_score": 96, "status": "Removed"},
        {"id": "HC-2041-003", "platform": "X", "variant_type": "Screenshot", "similarity_score": 94, "status": "Restricted"},
    ]
    
    pdf_bytes = PDFReportGenerator.generate_incident_pdf(
        incident_id=incident_id,
        title="Manipulated Media & Impersonation Campaign",
        protected_profile="Dr. Evelyn Carter",
        occurrences=occurrences
    )

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=SENTINEL_DOSSIER_{incident_id}.pdf"}
    )
