# 📋 SENTINEL Capability Matrix

This matrix documents the implemented features, technology stack, and functional status of the SENTINEL system.

| Capability Module | Status | Technical Implementation | Proof / Verification Location |
| :--- | :--- | :--- | :--- |
| **Victim Consent Management** | ✅ Built | Explicit consent verification, auditable consent records | `/onboarding`, `/profiles` |
| **Multimodal Content Analysis** | ✅ Built | Visual embeddings, OCR extractions, Text NLP | `/detections` |
| **Multi-Tiered Fingerprinting** | ✅ Built | SHA-256 (exact), pHash/dHash (near-duplicates), Visual Embeddings | `services/fingerprint_service.py` |
| **Master Incident Clustering** | ✅ Built | Dynamic grouping into Master Incident `HC-2041` | `/incidents/[id]` |
| **Propagation Visualization** | ✅ Built | Interactive React Flow network graph | `/propagation` |
| **Tamper-Evident Evidence Vault** | ✅ Built | SHA-256 checksum verification (`Stored == Current`) | `/evidence` |
| **PDF Report Dossier Engine** | ✅ Built | ReportLab Python backend PDF compiler | `/reports`, `services/pdf_service.py` |
| **Status State Machine Tracking** | ✅ Built | Status flow (`Draft` -> `Submitted` -> `Removed`/`Restricted`/`Rejected`) | `/reports` |
| **Controlled Escalation** | ✅ Built | Re-evaluates evidence on rejection before enabling appeals | `/reports` |
| **Re-Upload Watch Engine** | ✅ Built | Continuous signature comparison against incoming media | `/monitoring` |
| **Automated Test Suite** | ✅ Built | 12-stage validation runner | `apps/api/test_api.py` |
