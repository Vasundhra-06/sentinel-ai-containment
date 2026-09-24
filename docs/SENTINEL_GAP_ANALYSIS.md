# SENTINEL report-to-code gap analysis

The report is a proposal and evidence register, not a claim that the repository already implements its recommendations. Gaps are ranked by harm if wrong and by dependency order.

## P0 — correctness and security

1. **No authenticated tenant boundary.** Every major route is effectively public; records, registry items and profiles are not scoped to a principal or organization.
2. **No trusted action model.** There are no action/attempt/receipt/observation entities; simulated partner callbacks can change occurrence outcomes. A submitted request, 404, or synthetic HMAC must never become `REMOVED`.
3. **Evidence is not a vault.** Raw/derived artifacts, provenance, retention, legal hold, encryption keys, export controls and append-only audit integrity are missing.
4. **Database lifecycle is unsafe.** Import-time `create_all`, forced SQLite path, no migration history, no production driver, and no durable queue prevent safe deployment.
5. **Unsafe defaults.** Wildcard credentialed CORS, unauthenticated recovery/representative routes, path-based file reads, hardcoded secrets/demo data, and incomplete SSRF controls require blocking launch.
6. **Policy decisions are conflated.** Similarity, harmfulness, requester authority, platform capability, and action outcome must be separate state and evidence.

## P1 — functional pilot

- Server-generated incident/reference/occurrence IDs with tenant-scoped immutable versions.
- Mandate and consent records with expiry, purpose, category, jurisdiction and reviewer.
- Review batches with grouped decisions, split/merge, corrections, appeals, action approval and reviewer welfare controls.
- Real candidate ingestion from authorized sources only; bounded media jobs, queue, retry/DLQ, cancellation and idempotency.
- Calibrated fingerprint assessment: exact SHA, valid pHash/dHash/aHash, independent regional/local branches, signal-level evidence, model/version metadata and abstention.
- OCR and lexical evidence accurately labelled; no “semantic” claim until a measured semantic model exists.
- Private object storage and signed evidence exports; PDF generated only from verified records.
- Frontend API state replacing fixed demo IDs, localStorage operational state, and optimistic fake outcomes.

## P2 — important capability

Copy-oriented retrieval, robust video temporal segments, authorized monitoring policies, platform connector health, outcome reconciliation, source coverage denominators, analytics, reviewer workload, and customer-controlled test-platform action.

## P3 — future enhancement

Audio fingerprints/transcripts, multilingual semantic retrieval, large-scale ANN indexes, partner-side hash exchange, advanced graph views, and higher-throughput workers. These follow evidence and licensing review; they do not justify a microservice rewrite now.

## EXTERNAL / LEGAL / RESEARCH

Real platform reporting requires OAuth, scopes, customer ownership or a platform agreement. StopNCII, YouTube, Reddit, Telegram, Discord, TikTok and Meta capabilities must each be verified in a connector record. Legal deadlines, child-safety handling, jurisdiction, copyright exceptions, biometric/privacy processing and retention require current counsel and policy review. Matching thresholds, copy embeddings, hard-negative rates, reviewer effort and unit economics require a reproducible evaluation set; the report's 30 samples and prototype percentages are not production accuracy.

## Launch boundary

The first controlled pilot should be an adult, customer-authorized incident-operations workflow over customer-controlled or explicitly authorized sources, with manual handoff as the default action. Do not launch universal crawling, public hash publication, covert automation, guaranteed takedown, biometric galleries, or prohibited-media intake.
