# ClearExam | Antigravity Phase Prompt

**IMPORTANT — RUN THIS PROMPT INSIDE THE EXISTING ClearExam workspace, NOT A NEW PROJECT.**

Before editing: inspect Git status, read `AGENTS.md`, `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/API-CONTRACT.md`, `docs/PHASE-TRACKER.md`, and inspect existing tests and current code. Preserve all working functionality and all prior-phase acceptance gates. If an expected document is missing, first explain and reconstruct it from committed source without overriding approved choices.

Implement REAL source code, not just an architecture plan, screenshots or dummy screens. External credentials, billing accounts and deployment authorizations are user-owned; prepare adapters and clear setup instructions without inventing secrets or claiming connections are live. Never run destructive cloud/database commands or deploy production without explicit approval. Do not silently modify `main` or push changes. Make a dedicated feature branch where possible.

Every operation must have working auth/authorization, typed inputs/outputs, loading/empty/error/success states, observability and tests appropriate to the phase. Do not reveal exam answer keys to active students. Preserve historical attempt scoring snapshots. Use real data for metrics; clearly label any dev fixtures.

**Required final report:** changed paths, actual working features, migrations/indexes/rules, tests/build commands with PASS/FAIL/BLOCKED evidence, remaining problems, user configuration steps, and precise readiness gate for the next phase. **STOP after this phase** and do not claim unverified work is completed.

---

## Phase 04: Universal patterns, sections, test series and publish workflow

1. Create a versioned pattern-builder with per-exam paper/section: count, duration total/section, per-section marks, negative marking, unattempted points, sectional cutoff, pass threshold, optional partial credit, choices, language support, attempt limit, navigation/review flags, randomized question/order and permitted option shuffling, start/end schedule, result/review visibility, live status, accessibility accommodations.
2. Do not hardcode CCC's 100 questions/90 minutes onto SSC/Bank/Railway/custom exam. Implement CCC only as a configurable, reviewed template; link syllabus source if available and allow updates by version.
3. Admin test series, full mocks, chapter tests, subject practice, daily quizzes, sectionals; allow manual curated selection OR deterministic randomized blueprint with pool constraints and exclusion rules. Pre-flight availability checking prevents insufficient pool and accidental repeated questions.
4. Preview and simulation of all exam variants and marking schemes, including Hindi/English fallback warnings. Provide description and instructions editor with secure rendering.
5. Draft → Reviewed → Scheduled → Published → Archived. Lock immutable revision when published; publish new revision rather than changing finished history. Schedule eligibility and timezone semantics.
6. API: authorized exam metadata and attempts start only against published eligible revision; editor preview never implies public publish. Audit all publish operations and expose public only safe fields.
7. Tests for negative marks, different pass thresholds, sectional timing, no questions, insufficient pools, schedule boundaries and version migrations.

Acceptance: create two exams with different marking/time policies from Admin; both render correct metadata in student preview; older completed attempts remain unchanged after an exam revision.
