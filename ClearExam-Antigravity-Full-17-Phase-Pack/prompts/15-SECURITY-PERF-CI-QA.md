# ClearExam | Antigravity Phase Prompt

**IMPORTANT — RUN THIS PROMPT INSIDE THE EXISTING ClearExam workspace, NOT A NEW PROJECT.**

Before editing: inspect Git status, read `AGENTS.md`, `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/API-CONTRACT.md`, `docs/PHASE-TRACKER.md`, and inspect existing tests and current code. Preserve all working functionality and all prior-phase acceptance gates. If an expected document is missing, first explain and reconstruct it from committed source without overriding approved choices.

Implement REAL source code, not just an architecture plan, screenshots or dummy screens. External credentials, billing accounts and deployment authorizations are user-owned; prepare adapters and clear setup instructions without inventing secrets or claiming connections are live. Never run destructive cloud/database commands or deploy production without explicit approval. Do not silently modify `main` or push changes. Make a dedicated feature branch where possible.

Every operation must have working auth/authorization, typed inputs/outputs, loading/empty/error/success states, observability and tests appropriate to the phase. Do not reveal exam answer keys to active students. Preserve historical attempt scoring snapshots. Use real data for metrics; clearly label any dev fixtures.

**Required final report:** changed paths, actual working features, migrations/indexes/rules, tests/build commands with PASS/FAIL/BLOCKED evidence, remaining problems, user configuration steps, and precise readiness gate for the next phase. **STOP after this phase** and do not claim unverified work is completed.

---

## Phase 15: Independent production-readiness audit and defect fixes

1. Act like a hostile independent QA/Security reviewer. Inspect entire monorepo including transitive dependencies, auth, Firestore rules, media uploads, indexes, budget, Gradle, Android target SDK and Cloud Run permissions.
2. Threat model for admin account takeover, exam cheating/answer leaks, tampering clock/client, IDOR tenant access, fake scores, double submit, malicious question HTML, AI prompt injection, abuse/rate limit, malicious files, token theft and ad policy violations. Verify and fix, not just report.
3. Create reproducible test matrix: unit, Firebase Emulator rules integration, API contract, Android Compose UI instrumentation, end-to-end emulator/device workflows, admin browser Playwright, stress/concurrency, backup/restore, unreliable network, process death and accessibility.
4. Performance: Android startup, scrolling, exam palette with hundreds of questions, network retry performance, Firestore cost and index utilization, N+1 reads, aggregate updates, media compression/cache, memory leak checks, privacy-safe crash reporting.
5. CI: PR lint/typecheck/unit/contracts/security tests and release build gate; GitHub Actions with least privilege. Configure secret scanning, dependency checking and reproducible build. Migrations/index deploy through reviewed workflow; no destructive auto-run.
6. Reliability: structured logs, error IDs, monitoring/alerts, restore tested from a non-production backup, incident playbook and rollback steps, financial budget alerts.
7. Fix high/critical bugs and rerun affected tests. Generate report `docs/RELEASE-AUDIT.md` with PASS / FAIL / NOT TESTED / BLOCKED, evidence and risk owner. Never claim 100% if hardware/service not available.

Acceptance: zero known unresolved critical/high exploitable issues, verified backend/Android end-to-end, CI passing and clear remaining production blockers.
