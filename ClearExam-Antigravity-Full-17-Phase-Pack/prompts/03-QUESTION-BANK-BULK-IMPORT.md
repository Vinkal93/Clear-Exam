# ClearExam | Antigravity Phase Prompt

**IMPORTANT — RUN THIS PROMPT INSIDE THE EXISTING ClearExam workspace, NOT A NEW PROJECT.**

Before editing: inspect Git status, read `AGENTS.md`, `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/API-CONTRACT.md`, `docs/PHASE-TRACKER.md`, and inspect existing tests and current code. Preserve all working functionality and all prior-phase acceptance gates. If an expected document is missing, first explain and reconstruct it from committed source without overriding approved choices.

Implement REAL source code, not just an architecture plan, screenshots or dummy screens. External credentials, billing accounts and deployment authorizations are user-owned; prepare adapters and clear setup instructions without inventing secrets or claiming connections are live. Never run destructive cloud/database commands or deploy production without explicit approval. Do not silently modify `main` or push changes. Make a dedicated feature branch where possible.

Every operation must have working auth/authorization, typed inputs/outputs, loading/empty/error/success states, observability and tests appropriate to the phase. Do not reveal exam answer keys to active students. Preserve historical attempt scoring snapshots. Use real data for metrics; clearly label any dev fixtures.

**Required final report:** changed paths, actual working features, migrations/indexes/rules, tests/build commands with PASS/FAIL/BLOCKED evidence, remaining problems, user configuration steps, and precise readiness gate for the next phase. **STOP after this phase** and do not claim unverified work is completed.

---

## Phase 03: Production question bank, review flow, and CSV/XLSX import

1. Question schema supports one-answer MCQ, multiple-select MCQ, true/false, case/passage group, image-based MCQ, assertion-reason; future question type extensibility. Each question has exam/topic relations, language variants, options, private correct answer key, explanation, correct/incorrect points config where applicable, difficulty, tags, year/source attribution, provenance, owner, content revision, workflow status.
2. Security: content readable to active students contains only question body/options, never correct option IDs, answer explanation, grading weights if secret, reviewer notes, private draft. Store restricted answer keys server-only and test public reads.
3. Implement full Admin question editor including WYSIWYG-safe rich text, image attachments, math via KaTeX/MathJax with sanitization, Hindi+English rendering, preview, option reorder, autosave/draft recovery, inline validation, clone, deactivate, history and audit.
4. Review workflow: DRAFT → IN_REVIEW → APPROVED → PUBLISHED (plus REJECTED/WITHDRAWN). Separate maker and reviewer when configured; AI-generated questions cannot auto-publish. Record reviewer and approval timestamp.
5. Bulk import wizard: .csv/.xlsx template download; upload file limits, column mapping, type detection, preview first rows, duplicate detection (normalized hashes + semantic warning), per-row validation, dry run and error file export; idempotent batch job, progress/cancel/resume, partial success, and audit log. Respect Firestore batch limits and quotas.
6. Safe delete/archive version history. Referenced published question revisions remain accessible to authorized result review, without exposing new corrections to old scores.
7. Build browser tests for editor and imports plus backend tests for partial import, unsafe file, duplicate, Hindi, multi-answer, missing correct option and concurrent edits.

Acceptance: editor adds 1 real reviewed question; import loads valid batch and rejects invalid rows with human-readable reasons; answers cannot be retrieved by unauthorized student.
