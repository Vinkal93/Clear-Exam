# ClearExam | Antigravity Phase Prompt

**IMPORTANT — RUN THIS PROMPT INSIDE THE EXISTING ClearExam workspace, NOT A NEW PROJECT.**

Before editing: inspect Git status, read `AGENTS.md`, `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/API-CONTRACT.md`, `docs/PHASE-TRACKER.md`, and inspect existing tests and current code. Preserve all working functionality and all prior-phase acceptance gates. If an expected document is missing, first explain and reconstruct it from committed source without overriding approved choices.

Implement REAL source code, not just an architecture plan, screenshots or dummy screens. External credentials, billing accounts and deployment authorizations are user-owned; prepare adapters and clear setup instructions without inventing secrets or claiming connections are live. Never run destructive cloud/database commands or deploy production without explicit approval. Do not silently modify `main` or push changes. Make a dedicated feature branch where possible.

Every operation must have working auth/authorization, typed inputs/outputs, loading/empty/error/success states, observability and tests appropriate to the phase. Do not reveal exam answer keys to active students. Preserve historical attempt scoring snapshots. Use real data for metrics; clearly label any dev fixtures.

**Required final report:** changed paths, actual working features, migrations/indexes/rules, tests/build commands with PASS/FAIL/BLOCKED evidence, remaining problems, user configuration steps, and precise readiness gate for the next phase. **STOP after this phase** and do not claim unverified work is completed.

---

## Phase 10: Verified AI question creation with Gemini and optional OpenRouter

1. Create server-side AI Provider interface and driver for Gemini, with optional OpenRouter adapter configurable by Super Admin. Keys exclusively in secure server secret store; no client exposure. Per-provider model allowlists, costs, quotas, timeouts, retries with jitter and structured audit records.
2. AI draft wizard: exam/syllabus version, subject/chapter, learning outcome, difficulty, language(s), question type, number (quota constrained), optionally grounded official syllabus excerpts provided by admin. Generate structured JSON validated against typed question schema; refuse ambiguous or malformed keys; prohibit reproducing copyrighted exam questions without rights.
3. Review UI shows generated question, options, candidate answer, explanation, source notes, similarity warnings, translation consistency and confidence caveat. Human editor must validate; reviewer must approve; only then publish. AI must not silently overwrite published questions.
4. Queue jobs with budget/status lifecycle, cancellation, partial failure and safe resume; explicit token usage/cost reports from provider when available, otherwise estimates labeled estimates. No claim of guaranteed factual accuracy.
5. Prompt-injection defense: treat admin-supplied external syllabi/documents as data, not instructions; escape/validate model output. Limit content, avoid unsafe scripts and HTML in questions.
6. AI practice suggestions: use aggregate weak-topic analytics, avoid sending unnecessary personal user data; enable only behind permission and privacy flags.
7. Tests: invalid provider key, rate limits, malformed AI output, duplicate output, mismatched options, translation drift, quota exhaustion, editor/reviewer permissions, no automatic publish.

Acceptance: admin generates a real DRAFT through an actual configured provider or shows BLOCKED with credential requirement; human approval needed; no unreviewed AI question appears in student tests.
