# ClearExam | Antigravity Phase Prompt

**IMPORTANT — RUN THIS PROMPT INSIDE THE EXISTING ClearExam workspace, NOT A NEW PROJECT.**

Before editing: inspect Git status, read `AGENTS.md`, `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/API-CONTRACT.md`, `docs/PHASE-TRACKER.md`, and inspect existing tests and current code. Preserve all working functionality and all prior-phase acceptance gates. If an expected document is missing, first explain and reconstruct it from committed source without overriding approved choices.

Implement REAL source code, not just an architecture plan, screenshots or dummy screens. External credentials, billing accounts and deployment authorizations are user-owned; prepare adapters and clear setup instructions without inventing secrets or claiming connections are live. Never run destructive cloud/database commands or deploy production without explicit approval. Do not silently modify `main` or push changes. Make a dedicated feature branch where possible.

Every operation must have working auth/authorization, typed inputs/outputs, loading/empty/error/success states, observability and tests appropriate to the phase. Do not reveal exam answer keys to active students. Preserve historical attempt scoring snapshots. Use real data for metrics; clearly label any dev fixtures.

**Required final report:** changed paths, actual working features, migrations/indexes/rules, tests/build commands with PASS/FAIL/BLOCKED evidence, remaining problems, user configuration steps, and precise readiness gate for the next phase. **STOP after this phase** and do not claim unverified work is completed.

---

## Phase 16: Staging, Android APK/AAB and controlled production launch

1. Verify feature gates 00–15 and `docs/RELEASE-AUDIT.md` before any production rollout. Confirm brand/name and trademark availability; ClearExam is a working name until verified. Store listing must clearly say unofficial exam practice app and never imply affiliation with NIELIT/SSC/IBPS.
2. Configure separate staging and production projects, least-privilege cloud IAM and secret stores. Automate non-destructive infrastructure deploy with approval. Verify DNS, HTTPS, CORS, API base URLs, Firebase Auth SHA fingerprints, Firestore indexes/rules, Storage rules and production monitoring.
3. Android: adjust applicationId/package only after owner approval, compile release build, R8/proguard where appropriate, signing config from secure local/CI secrets, generate debug APK and Play-ready signed AAB without exposing keystore. Preserve signing key and reproducibility instructions.
4. Play Console: internal test track first, consent/privacy/Data Safety, target audience/Families, content rating, ads declaration, app access instructions, screenshots from actual running UI, testers, billing permissions, support email (do not invent), app icon, adaptive icon, launcher assets, notification permission explanation.
5. Test actual installation and update on physical Android device: sign in, exam catalog, full test and timer, result/history, purchase sandbox, FCM, ads consent/test placements, account deletion and data export. Crash-free check.
6. Controlled staged rollout only with owner approval. Add rollout monitor checklist, crash alerts, auth failures, grading error alarms, cost controls, ads/Play policy notices, rollback and post-release issue tracker.
7. Deliver source, source map, handoff, admin setup guide, test evidence, Gradle build commands, screenshots and deployment runbook. Do not claim published if Play review/approval has not occurred.

Acceptance: signed AAB and internal-track release when credentials are available; device-tested critical path; production release requires explicit go/no-go approval.
