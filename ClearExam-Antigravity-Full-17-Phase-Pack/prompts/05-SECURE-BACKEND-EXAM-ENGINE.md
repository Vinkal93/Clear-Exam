# ClearExam | Antigravity Phase Prompt

**IMPORTANT — RUN THIS PROMPT INSIDE THE EXISTING ClearExam workspace, NOT A NEW PROJECT.**

Before editing: inspect Git status, read `AGENTS.md`, `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/API-CONTRACT.md`, `docs/PHASE-TRACKER.md`, and inspect existing tests and current code. Preserve all working functionality and all prior-phase acceptance gates. If an expected document is missing, first explain and reconstruct it from committed source without overriding approved choices.

Implement REAL source code, not just an architecture plan, screenshots or dummy screens. External credentials, billing accounts and deployment authorizations are user-owned; prepare adapters and clear setup instructions without inventing secrets or claiming connections are live. Never run destructive cloud/database commands or deploy production without explicit approval. Do not silently modify `main` or push changes. Make a dedicated feature branch where possible.

Every operation must have working auth/authorization, typed inputs/outputs, loading/empty/error/success states, observability and tests appropriate to the phase. Do not reveal exam answer keys to active students. Preserve historical attempt scoring snapshots. Use real data for metrics; clearly label any dev fixtures.

**Required final report:** changed paths, actual working features, migrations/indexes/rules, tests/build commands with PASS/FAIL/BLOCKED evidence, remaining problems, user configuration steps, and precise readiness gate for the next phase. **STOP after this phase** and do not claim unverified work is completed.

---

## Phase 05: The critical secure examination service (backend first)

1. Implement one server-owned attempt lifecycle: CREATED → IN_PROGRESS → SUBMITTED/AUTO_SUBMITTED → GRADED → RESULT_AVAILABLE (plus CANCELLED/INVALIDATED with explicit rules). An attempt is always scoped to Firebase UID, published test version and permitted access.
2. On start: verify eligibility/entitlement/attempt limits, generate question/option order on backend, snapshot frozen question content and private correct keys, assign attempt ID and server timestamps `startedAt`, `expiresAt`; return only sanitized student payload. Never trust Android clocks to authorize completion.
3. Add answer save API with a monotonically increasing response revision, item ownership validation, last-write semantics defined, idempotency, retries and conflict handling. Clear answer and mark-for-review are separate operations. Retain drafts safely when network is disconnected; never silently claim server saved.
4. Submit API uses an idempotency key and Firestore transaction/locking to ensure exactly one successful finalization and grading, even with simultaneous requests and repeated app taps. Handle client crash mid-submit and deadline races. Background expiry sweeper reliably finalizes expired attempts.
5. Grading: single correct, multi-select with pattern-specified exact/partial marking, negatives, unanswered, per-section totals, permitted score floor, thresholds and detailed reasoning trace (private). Versioned grading algorithm, score provenance and audit.
6. Result reveal permissions and answer review after policy-based visibility time. Prevent API enumeration or answer-key leaks through nested responses, Firestore rules, serialization and debug logs.
7. Define OpenAPI and typed Android/client DTOs for start/response/save/submit/result/history. Implement pagination and rate limits. All endpoints tested with emulator integration.
8. Race/abuse tests: spoofed UID, foreign attempt, unauthorized draft, simultaneous submit, expired attempt, clock change, duplicated network request, retry after API timeout, revoked account, mutated question revision, no answers, negative grading.

Acceptance: A full real start → save → submit → grade → read-history vertical slice passes integration tests against emulator/backend; exact-once grading verified; no active-answer leakage.
