# SENTINEL production plan (approval draft)

This plan is intentionally staged. The user's subsequent instruction to continue the original request has been treated as approval to begin local foundation implementation. External deployment, identity-provider, pilot, retention and integration decisions remain open. See [the 24 September checkpoint](SENTINEL_FOUNDATION_CHECKPOINT.md) for the exact implemented scope and verification; this document remains the target plan, not a completion claim.

## Target architecture

Retain a modular FastAPI/Next application with PostgreSQL, private encrypted object storage, Redis-compatible queue, and a separate worker process. Boundaries are: (1) case/authorization, (2) media/evidence, (3) matching/review, (4) action/connectors, and (5) monitoring/observations. A transactional outbox publishes jobs and action attempts. Every job has a bounded payload, timeout, cancellation, retry policy, dead-letter state, and correlation ID. Source content is data, never instructions.

## Core data model

Add Tenant, User, Membership/Role, Mandate, Consent, MasterIncident, ReferenceAsset, IncidentOccurrence, EvidenceArtifact, Fingerprint, MatchAssessment, ReviewBatch, HumanDecision, Action, ActionAttempt, ActionReceipt, MonitoringPolicy, MonitoringObservation, Connector, ConnectorCredential, and AuditEvent. Use UUIDs internally, human case numbers as display identifiers, tenant foreign keys on every business object, immutable versions, explicit status enums, and database constraints. Store relation decisions separately from harmfulness/action basis/authority/channel capability. Use an outbox uniqueness key `(tenant, incident, occurrence, channel, action_type, policy_version)` and represent timeout as `UNKNOWN` pending reconciliation.

## Migration strategy

1. Freeze no data: snapshot and checksum the existing SQLite file; import legacy rows into a quarantined legacy tenant with `provenance=legacy-unverified`.
2. Add Alembic baseline and PostgreSQL schema in parallel; retain old tables/read-only compatibility during transition.
3. Backfill only explicit relationships; never infer consent, authority, original source, or removal from old strings.
4. Dual-read behind a feature flag, compare counts and hashes, then dual-write new workflows.
5. Migrate one pilot tenant, test backup/restore and rollback, and only then retire legacy writes. No destructive migration or deletion is part of this approval draft.

## API and frontend work

Introduce authenticated `/api/v2` endpoints for intake, mandates, references, occurrences, review batches, evidence, actions, monitoring and connectors. Return typed `UNKNOWN`, `UNAVAILABLE`, `MANUAL_HANDOFF`, `PARTNER_REQUIRED`, and `NOT_CONFIGURED` states. Enforce tenant and role checks at the dependency layer. Replace localStorage as a source of truth and remove fixed HC/REP values from operational views; preserve the current visual language and explainable review surfaces.

## Media and matching

Accept bounded uploads into quarantine, malware-scan and decode safely, then create SHA-256 and versioned perceptual fingerprints. Run exact, cheap perceptual, copy-retrieval and local-feature branches independently; union candidates before verification. Persist raw signals, model/algorithm versions, calibration set, thresholds and abstention. Keep SIFT/USAC as the current candidate while benchmarking DISK/LightGlue or another licensed alternative. Add OCR as an explicit adapter; video uses bounded temporal segments; audio remains an extension.

## Human review and action routing

A review batch is an immutable candidate snapshot. Reviewers can confirm/reject/split/merge relationships, request information, and separately approve an action package. Action packages include authority, consent/mandate, category, policy version, jurisdiction, target identity, evidence references, expiry and required approval. Manual handoff is the honest default. A connector may submit only after verified credentials, supported category/action, scope, rate limit and approval; a response is recorded as submitted/acknowledged/under-review/confirmed/unknown, never automatically removed.

## Security, privacy and operations

Use OIDC/session authentication, MFA, role and tenant checks, CSRF protection, rate limits, secure cookies, secret management, key rotation, envelope encryption, signed exports, retention/hold workflows, deletion jobs, redacted logs, malware scanning, SSRF-safe fetch workers and egress allowlists. Add structured audit events with hash chaining or an external WORM sink. Instrument queue latency, match signals, review effort, connector outcomes, coverage denominators, error rates and unknowns. Alerts must distinguish connector outage from no match.

## Phases and gates

| Phase | Goal | Main outputs | Exit gate | Complexity |
|---|---|---|---|---|
| 0 | Safety foundation | threat model, capability registry, config/secrets, route inventory | no public business route; reproducible baseline | M |
| 1 | Identity and data foundation | Alembic/PostgreSQL, tenant/RBAC/mandate/evidence schema, migration harness | isolation/rollback/backup tests pass | L |
| 2 | Case and review core | references, occurrences, assessments, review batches, corrections | authorization and negative tests pass | L |
| 3 | Media pipeline | quarantine, object storage, fingerprints, bounded jobs, OCR seam | fixture and hard-negative benchmark with measured telemetry | L |
| 4 | Action and controlled connector | outbox, idempotent attempts, manual handoff, one customer-controlled test adapter | no synthetic removal; replay/timeout/reconcile tests pass | L |
| 5 | Monitoring and frontend | finite authorized monitoring, observations, API-backed UI | coverage/unknown states and accessibility checks pass | M/L |
| 6 | Hardening | dependency/SBOM, load, incident response, restore drill, counsel review | launch checklist signed by owner | M |

## Dependencies and decisions

Required before implementation: PostgreSQL/object storage/queue choice, identity provider, secrets/KMS, deployment target, pilot tenant and controlled source, supported adult category, data retention policy, counsel review, connector credentials/agreements, and a labeled benchmark with hard negatives. LightGlue/DISK and any embedding weights require license approval. Platform access remains an external dependency.

Local foundation work can proceed without selecting paid infrastructure. The initial implementation uses an isolated SQLite database and local operator credentials, with production startup gated. These are development choices and do not resolve the production decisions above.
