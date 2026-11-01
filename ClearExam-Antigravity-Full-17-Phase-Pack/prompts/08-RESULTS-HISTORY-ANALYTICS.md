# ClearExam | Antigravity Phase Prompt

**IMPORTANT — RUN THIS PROMPT INSIDE THE EXISTING ClearExam workspace, NOT A NEW PROJECT.**

Before editing: inspect Git status, read `AGENTS.md`, `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/API-CONTRACT.md`, `docs/PHASE-TRACKER.md`, and inspect existing tests and current code. Preserve all working functionality and all prior-phase acceptance gates. If an expected document is missing, first explain and reconstruct it from committed source without overriding approved choices.

Implement REAL source code, not just an architecture plan, screenshots or dummy screens. External credentials, billing accounts and deployment authorizations are user-owned; prepare adapters and clear setup instructions without inventing secrets or claiming connections are live. Never run destructive cloud/database commands or deploy production without explicit approval. Do not silently modify `main` or push changes. Make a dedicated feature branch where possible.

Every operation must have working auth/authorization, typed inputs/outputs, loading/empty/error/success states, observability and tests appropriate to the phase. Do not reveal exam answer keys to active students. Preserve historical attempt scoring snapshots. Use real data for metrics; clearly label any dev fixtures.

**Required final report:** changed paths, actual working features, migrations/indexes/rules, tests/build commands with PASS/FAIL/BLOCKED evidence, remaining problems, user configuration steps, and precise readiness gate for the next phase. **STOP after this phase** and do not claim unverified work is completed.

---

## Phase 08: Real results, history, answer explanations and learning analytics

1. Native result screen: score/maximum, correct/incorrect/unattempted, accuracy and its precise denominator, time spent, pass/fail only when configured, section marks, negative-mark breakdown, visual ring with text alternative, next practice recommendation.
2. Answer review displays question snapshot, user's response, correct response and human-reviewed explanation only once permitted by test visibility policy; report question issue routes to review queue; bookmark separately.
3. History screen match reference screenshot's quality, not its fictional figures: date filters, exam filters, types, status, attempt list, search, pagination, reopen past authorized result, retry/continue when eligible. Distinguish ongoing attempt from completed.
4. Analytics using actual aggregates: score trend, accuracy, attempted questions, weak-topic insights, strengths, streaks from stored activity, section performance, completion count. Prevent double counting, changes in grading patterns, and misleading comparisons. Rank/percentile hidden until defensible population and computation exist.
5. Model analytics with Firestore counters/materialized aggregates and Cloud Run tasks where needed; plan indexes, backfills and correction/regrade policy, but never retroactively change frozen results without transparent audit.
6. Error/empty/no-history state; refreshing; Hindi UI and proper long labels. Export/share result card excludes private identifying information by default.
7. Tests: zero attempts; multi exams different max score; negative marks; historical deleted/unpublished question; wrong-user read; duplicate events; 100+ history items pagination; chart screen readers.

Acceptance: student finishes a real exam, sees exact backend score and answers, kills and restarts app, opens same result via history with identical marks; analytics calculated from real attempts.
