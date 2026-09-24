# SENTINEL implementation checkpoint — 24 September 2026

## Scope and status

The instruction to continue the original request was taken as approval to begin implementation. This checkpoint implements the first local security/data slice. It is **not completion of the full production plan**. Phase 0 and Phase 1 still have production gates; later media, review, action and monitoring phases are not implemented in the new domain.

Implemented: explicit CORS/Host policy, disabled legacy API by default, no import-time schema creation, a separate tenant/user/credential/case/audit schema, Alembic revision 0001, local bearer credentials with expiry/revocation, role checks, tenant-scoped case queries, provisional intake and case-created audit transactions, a real API-backed workspace, and a loopback-only launcher with readiness checks.

Local bearer credentials are temporary operator access, not enterprise login or MFA. Credentials are random high-entropy values; only SHA-256 digests are stored. The workspace keeps the token in memory. Provisioning is a trusted local CLI command, not public signup. API audit events are persisted but are not yet a tamper-evident vault. There is no evidence/media upload in the new workspace.

Legacy modules and database are preserved. Opt-in legacy mode still contains the audited simulations and risks, and must only use synthetic material. The legacy UI is labelled. No source record is silently upgraded to verified authority or removal. Production startup is explicitly gated until the remaining controls are implemented and reviewed.

## Local setup

From the repository root, using a Python installation that can create a virtual environment:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r apps/api/requirements-foundation.txt
.\.venv\Scripts\python.exe -m pip install pytest httpx
npm ci
.\scripts\Start-Sentinel.ps1
```

The launcher builds the frontend, upgrades only the foundation database, starts services hidden on 127.0.0.1 ports 3000 and 8000, and returns only when both answer HTTP successfully. `-SkipBuild` reuses an existing verified build. It refuses occupied ports without killing their owners. Logs are in ignored `.local/`. The current development environment inherited existing dependencies when creating `.venv`; a fresh install is a separate reproducibility check, not yet claimed.

Open `http://127.0.0.1:3000/workspace`. Provision an operator in a private local terminal:

```powershell
Push-Location apps/api
& ..\..\.venv\Scripts\python.exe -m foundation.bootstrap --tenant "Local evaluation" --name "Local operator"
Pop-Location
```

Copy the generated credential into the workspace. It expires in eight hours. It is a secret; do not commit or share it. Each provisioning invocation creates a new tenant/user. The sign-out action revokes all credentials for that operator. The CLI is currently the only provisioning path; user invitations, renewal and account management are pending.

The new API uses `SENTINEL_DATABASE_URL`, defaulting to `apps/api/foundation.local.db`. `DATABASE_URL` remains the legacy API setting and now respects explicit SQLite URLs. The legacy database `apps/api/sentinel.db` is not migrated or seeded by the launcher. `-LegacyDemo` explicitly mounts the old v1 API and requires its optional ML/media dependencies. Do not enable it for real cases.

## Migration and recovery

Revision `0001_foundation` explicitly creates only v2 tables and `sentinel_schema_version`. It does not import the live ORM metadata into the historical revision. Empty schemas can downgrade and upgrade; a downgrade with foundation data refuses rather than deleting cases or credentials. Preserve legacy data as unverified until a reviewed migration/import is implemented.

SQLite recovery test uses the SQLite backup API, restores the snapshot, checks `PRAGMA integrity_check`, and verifies a case and its audit event. For a real recovery, stop writers, retain the original database, restore a verified backup to a **new path**, set `SENTINEL_DATABASE_URL` to that path, and verify health and record counts before switching traffic. A production PostgreSQL backup/restore procedure remains pending a deployment target.

## Tests and remaining gates

Run `python -m pytest apps/api/tests/test_foundation.py -q` using `.venv/Scripts/python.exe`. Tests cover unauthenticated access, tenant isolation, role enforcement, injected tenant/status fields, expiry/revocation/inactive users, CORS/Host boundaries, legacy-route denial, schema/ORM parity, empty rollback, refusal of destructive rollback, legacy-table preservation and snapshot restore. Test results must be recorded after execution below.

Pending: OIDC/MFA/session policy, distributed rate limiting, PostgreSQL execution, composite ownership constraints across future domain objects, mandate/consent/evidence models, legacy import quarantine, encrypted evidence storage, append-only audit protection, approvals, actions, outbox, workers, calibrated matching, monitoring, external adapters, fresh dependency locking/audit, accessibility/browser regression and production deployment.

The first pilot category/source/action choice has been requested. No third-party access, legal deadline, consent or platform authority is inferred from the existing demo.

## Verified results

On 24 September 2026:

- Foundation suite: **14 passed**, one dependency deprecation warning. Repeated after installing the declared Uvicorn/Pydantic requirements; all 14 still passed.
- Existing `apps/api/test_api.py`: exit 0. Its limited three assertions and printed stage claims retain the audit qualifications; this is not evidence of real platform enforcement.
- `npm run build:web`: exit 0; 20 routes generated, including `/workspace`; type checking passed.
- `pip check`: no broken requirements in the active virtual environment.
- Launcher: API readiness and `/workspace` both returned HTTP 200. API and web bound to 127.0.0.1 on ports 8000 and 3000.
- In-app browser: workspace rendered, invalid credential submission showed an explicit authentication error, and reload cleared the input. Positive case persistence and tenant isolation were verified through HTTP tests, not a signed-in browser walkthrough.
- Legacy database SHA-256 remained `f1f305870a4ae3d37999fc6bcbc52857adf02148149bc169b9687f60375ab52d` before and after this work.
- PostgreSQL live migration/integration: **not run**; Docker engine unavailable. No PostgreSQL production-readiness claim.
- Repository-wide whitespace checking reported pre-existing warnings in unrelated modified prototype files; these were preserved.
- The launcher probes loopback sockets directly; it does not depend on elevated permission to enumerate Windows TCP tables. Failure cleanup targets only the process trees created by that invocation.

Tested runtime: Python 3.9.6, FastAPI 0.110.0, Uvicorn 0.39.0, SQLAlchemy 2.0.52, Pydantic 2.13.5, Alembic 1.16.5, psycopg 3.2.13, HTTPX 0.25.2 and pytest 8.4.2. This inherited development environment is not a production dependency lock or a vulnerability clearance. Python/runtime modernization and dependency remediation remain required.

## Primary implementation references

Schema versioning follows the [Alembic tutorial](https://alembic.sqlalchemy.org/en/latest/tutorial.html). The existing report remains the product reference; this change does not claim its proposed full architecture is already implemented.
