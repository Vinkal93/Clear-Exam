# ClearExam | Antigravity Phase Prompt

**IMPORTANT — RUN THIS PROMPT INSIDE THE EXISTING ClearExam workspace, NOT A NEW PROJECT.**

Before editing: inspect Git status, read `AGENTS.md`, `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/API-CONTRACT.md`, `docs/PHASE-TRACKER.md`, and inspect existing tests and current code. Preserve all working functionality and all prior-phase acceptance gates. If an expected document is missing, first explain and reconstruct it from committed source without overriding approved choices.

Implement REAL source code, not just an architecture plan, screenshots or dummy screens. External credentials, billing accounts and deployment authorizations are user-owned; prepare adapters and clear setup instructions without inventing secrets or claiming connections are live. Never run destructive cloud/database commands or deploy production without explicit approval. Do not silently modify `main` or push changes. Make a dedicated feature branch where possible.

Every operation must have working auth/authorization, typed inputs/outputs, loading/empty/error/success states, observability and tests appropriate to the phase. Do not reveal exam answer keys to active students. Preserve historical attempt scoring snapshots. Use real data for metrics; clearly label any dev fixtures.

**Required final report:** changed paths, actual working features, migrations/indexes/rules, tests/build commands with PASS/FAIL/BLOCKED evidence, remaining problems, user configuration steps, and precise readiness gate for the next phase. **STOP after this phase** and do not claim unverified work is completed.

---

## Phase 09: Student-created personal mocks, revisions and non-manipulative growth

1. Practice screen modes: Full Mock, Chapter-wise, Subject-wise, Custom Test, Daily Quiz, PYQ (only legally sourced and accurately attributed), Wrong Answers Revision, Bookmarks, Weak Topic Revision.
2. Custom test builder: choose published exam/version, subjects, chapter filters, question count, difficulty, language, time, exclude previously attempted questions where possible, random seed; run server-side eligibility/available pool checks and quota limits. Error on insufficient pool instead of hidden repetition.
3. Students can create private quizzes from own original MCQs, and optionally share with friends via approved link/permissions. Default private; public inclusion requires manual moderation; creator cannot edit public approved bank directly.
4. Daily goal, streak, bookmarks and personal progress as accurate server-backed counters. Never incentivize clicks on ads or imply direct money/coins earned through ads. Create user-friendly and accessible shareable scorecards and referral sharing WITHOUT guaranteed fake ranks, followers or rewards.
5. Safe leaderboard opt-in, clear pseudonyms, cohort/time window, anti-cheat, hide when cohort insufficient; consider underage audiences. Notifications can be enabled only with consent and throttles.
6. Tests: all modes, insufficient question pool, exposure of private student quiz, bookmark and revision correctness, repeated test sampling, rate limits and blocked user.

Acceptance: user can generate a custom test from existing approved pool and finish with graded result, no backend leakage or unreviewed public content.
