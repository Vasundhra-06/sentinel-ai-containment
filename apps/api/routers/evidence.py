from fastapi import APIRouter

router = APIRouter(prefix="/api/v1/evidence", tags=["evidence"])

@router.get("/{incident_id}")
def get_evidence(incident_id: str):
    return [
        {
            "id": "EVD-2041-001",
            "incidentId": incident_id,
            "occurrenceId": "HC-2041-001",
            "platform": "Instagram",
            "url": "https://instagram.com/p/C9x81_orig",
            "account": "@unauth_source_01",
            "capturedAt": "2026-08-28 14:25 UTC",
            "sha256": "ab4f91dc88231a47e0912389174128941029381029381029381029381029381",
            "pHash": "pHash-8f9a2b1c4e",
            "integrityStatus": "VERIFIED"
        }
    ]
