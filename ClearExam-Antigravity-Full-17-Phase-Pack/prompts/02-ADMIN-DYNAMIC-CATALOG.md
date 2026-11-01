# ClearExam | Antigravity Phase Prompt

**IMPORTANT — RUN THIS PROMPT INSIDE THE EXISTING ClearExam workspace, NOT A NEW PROJECT.**

Before editing: inspect Git status, read `AGENTS.md`, `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/API-CONTRACT.md`, `docs/PHASE-TRACKER.md`, and inspect existing tests and current code. Preserve all working functionality and all prior-phase acceptance gates. If an expected document is missing, first explain and reconstruct it from committed source without overriding approved choices.

Implement REAL source code, not just an architecture plan, screenshots or dummy screens. External credentials, billing accounts and deployment authorizations are user-owned; prepare adapters and clear setup instructions without inventing secrets or claiming connections are live. Never run destructive cloud/database commands or deploy production without explicit approval. Do not silently modify `main` or push changes. Make a dedicated feature branch where possible.

Every operation must have working auth/authorization, typed inputs/outputs, loading/empty/error/success states, observability and tests appropriate to the phase. Do not reveal exam answer keys to active students. Preserve historical attempt scoring snapshots. Use real data for metrics; clearly label any dev fixtures.

**Required final report:** changed paths, actual working features, migrations/indexes/rules, tests/build commands with PASS/FAIL/BLOCKED evidence, remaining problems, user configuration steps, and precise readiness gate for the next phase. **STOP after this phase** and do not claim unverified work is completed.

---

## Phase 02: Functional Super Admin dashboard and unlimited dynamic exam catalog

1. Build production-quality, responsive Super Admin portal: persistent desktop sidebar, mobile drawer, command search, breadcrumb navigation, theme tokens, toasts, permission-specific menu; light default, dark supported.
2. Fully data-driven hierarchy: Category → Exam → Syllabus Version → Paper/Subject → Chapter/Topic. Allow e.g. CCC, O Level, SSC, Bank PO, Railway, Class 6–12 without hardcoded conditionals; examples only as unpublished DEV fixtures.
3. CRUD and workflows: create, edit, duplicate, reorder, publish/unpublish, archive/restore; filters, text search, server-side pagination, empty/loading/error states, confirmation and optimistic concurrency checks. Keep stable IDs and slug uniqueness per scope.
4. Fields: labels Hindi/English, short/long description, icon, cover/banner, syllabus, exam body/official links when verified, tags, sort order, featured flag, eligibility description without unverified official claims, content version, visibility.
5. Validate uploaded media type/size; generate secure storage path; never permit scripts/HTML payloads. Published content must have minimum required valid children; prevent broken links/references.
6. Dashboard metrics from real data aggregates only: registered users, published exams, approved questions, completed attempts; if none, show zero/empty not fake numbers. Add index and cost estimates for metrics.
7. Add editor/reviewer permissions correctly. Log who published what. Archive must not delete completed attempts or historic results.
8. Expose safe read-only `GET /v1/catalog/*` and secure `POST/PATCH/... /v1/admin/catalog/*` APIs with OpenAPI schemas and contract tests.

Acceptance: Super Admin creates an entirely new arbitrary category/exam without code change, publishes it, student catalog reads the same real record; unauthorized write rejected; edits propagate safely.
