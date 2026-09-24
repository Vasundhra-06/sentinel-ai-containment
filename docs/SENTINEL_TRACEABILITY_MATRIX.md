# SENTINEL requirements traceability matrix

The “current evidence” columns describe the repository as audited; planned modules are not claims of implementation.

| Report requirement | Planned module / data | Current source evidence | API/UI | Current tests / status |
|---|---|---|---|---|
| Authorized intake and mandate | `Mandate`, `Consent`, `Tenant`, `User` | `apps/api/routers/access.py`, `models.py` (partial access/grants only) | onboarding, profiles; future `/api/v2/mandates` | no authorization test; MISSING/P0 |
| Master incident with occurrences | `MasterIncident`, `IncidentOccurrence`, immutable versions | `routers/incidents.py`, `models.py` | incidents/detail | validation links fixtures; PARTIAL/P0 |
| Evidence provenance and vault | `EvidenceArtifact`, object key, hold, retention, audit | `routers/evidence.py`, `services/pdf_service.py` | evidence/reports | metadata/PDF tests only; PARTIAL/P0 |
| Independent fingerprint layers | `Fingerprint`, algorithm/model version, `MatchAssessment` | `services/fingerprint_service.py`, `advanced_matcher.py` | detections/compare | 30-sample fixture; PARTIAL/P1 |
| OCR/text truthfulness | OCR adapter and lexical/semantic evidence types | `services/ocr_adapter.py`, `compare.py` | detections/compare | unavailable seam only; PARTIAL/P1 |
| Video/audio extension | temporal evidence and bounded media job | `services/video_service.py`; no audio module | no production route | containment fixture; PARTIAL/MISSING/P2 |
| Grouped human review | `ReviewBatch`, `HumanDecision`, appeal/correction | `routers/incidents.py`, frontend detail components | incident detail | no authorization/action-basis test; PARTIAL/P0 |
| Action routing and outcomes | `Action`, `ActionAttempt`, `ActionReceipt`, `Observation` | `routers/partner_demo.py`, unmounted `reports.py` | partners/reports | simulated callback; MOCK/P0 |
| Connector registry | `Connector`, credential/scopes/health/status | `routers/registry.py`, `platforms.py` | platforms/partners | hardcoded statuses; MOCK/EXTERNAL |
| Authorized monitoring | `MonitoringPolicy`, scheduler, observation | `routers/events.py`, `services/live_scanner.py` | monitoring | SSE snapshot; MOCK/P1 |
| Privacy/security | auth, tenant dependency, vault, KMS, SSRF worker | `main.py`, `database.py`, `ssrf.py` | settings/access | no real auth isolation; UNSAFE/P0 |
| Migration/deployment | Alembic, PostgreSQL, queue, backups | `requirements.txt`, `database.py`, `render.yaml` | operational | no migration test; PARTIAL/P0 |

## Evidence and references

### Implementation update — 24 September 2026

The original table above records the pre-implementation audit. The following changes are verified by the new suite, without changing the status of later requirements:

| Requirement | Current files | Database / endpoint / UI | Validation | Status |
|---|---|---|---|---|
| Authenticated organization boundary | `apps/api/foundation/security.py`, `routes.py`, `models.py` | v2 tenants/users/credentials; `/api/v2/me`, `/api/v2/cases`; `/workspace` | missing/invalid/expired/revoked/inactive credentials; tenant isolation; role checks | IMPLEMENTED for local operator credentials; OIDC/MFA pending |
| Provisional master incident | `foundation/routes.py`, `models.py`; `apps/web/src/app/workspace/page.tsx` | v2 cases; POST/GET `/api/v2/cases`, GET by ID | persistence; server IDs; tenant/status injection rejected; authority remains NOT_VERIFIED | PARTIAL: intake only; mandate, references and occurrences pending |
| Auditability | `foundation/models.py`, `routes.py` | v2 audit events; admin GET `/api/v2/audit` | case/audit transaction; tenant filtering; non-admin rejected | PARTIAL: persisted events, no tamper-evident sink yet |
| Versioned database changes | `apps/api/alembic.ini`, `migrations/env.py`, `migrations/versions/0001_foundation.py` | isolated foundation database; no legacy backfill | ORM parity; upgrade/downgrade; legacy preservation; data-loss refusal; backup restore | IMPLEMENTED on disposable SQLite; PostgreSQL unverified |
| Honest capabilities and local operation | `application.py`, `config.py`, `AppShell.tsx`, `scripts/Start-Sentinel.ps1` | legacy routes disabled by default; explicit demo mode; readiness; labelled legacy UI | Host/Origin rejection; legacy API denial; build and live HTTP/browser checks | PARTIAL: foundation safe defaults; legacy remains simulated |

All detailed limits and test results are recorded in [SENTINEL_FOUNDATION_CHECKPOINT.md](SENTINEL_FOUNDATION_CHECKPOINT.md). Evidence vault, human review, calibrated matching, real connectors and scheduled monitoring remain unimplemented in v2.

Primary product source: `SENTINEL_Research_Report.pdf`, pages 5–53. Current code references are listed above; the source report's register is preserved as research context. Build/test evidence is from an isolated copy: web build exit 0; API, validation and containment scripts exit 0. Those scripts include fixture-only assertions and simulated partner outcomes, so they do not satisfy the missing authorization, connector, migration or production-readiness gates.
