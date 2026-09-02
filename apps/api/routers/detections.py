from fastapi import APIRouter
from schemas import ScanRequestSchema, MatchResultSchema
from services.fingerprint_service import FingerprintService

router = APIRouter(prefix="/api/v1/detections", tags=["detections"])

@router.post("/scan", response_model=MatchResultSchema)
def scan_media(request: ScanRequestSchema):
    """Executes multimodal AI scanning & similarity matching against Master Incidents."""
    input_str = request.content_url or request.text_claim or "sample_upload"
    result = FingerprintService.compute_multimodal_similarity(input_str)
    return result
