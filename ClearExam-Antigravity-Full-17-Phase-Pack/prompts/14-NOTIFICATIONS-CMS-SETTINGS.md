# ClearExam | Antigravity Phase Prompt

**IMPORTANT — RUN THIS PROMPT INSIDE THE EXISTING ClearExam workspace, NOT A NEW PROJECT.**

Before editing: inspect Git status, read `AGENTS.md`, `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/API-CONTRACT.md`, `docs/PHASE-TRACKER.md`, and inspect existing tests and current code. Preserve all working functionality and all prior-phase acceptance gates. If an expected document is missing, first explain and reconstruct it from committed source without overriding approved choices.

Implement REAL source code, not just an architecture plan, screenshots or dummy screens. External credentials, billing accounts and deployment authorizations are user-owned; prepare adapters and clear setup instructions without inventing secrets or claiming connections are live. Never run destructive cloud/database commands or deploy production without explicit approval. Do not silently modify `main` or push changes. Make a dedicated feature branch where possible.

Every operation must have working auth/authorization, typed inputs/outputs, loading/empty/error/success states, observability and tests appropriate to the phase. Do not reveal exam answer keys to active students. Preserve historical attempt scoring snapshots. Use real data for metrics; clearly label any dev fixtures.

**Required final report:** changed paths, actual working features, migrations/indexes/rules, tests/build commands with PASS/FAIL/BLOCKED evidence, remaining problems, user configuration steps, and precise readiness gate for the next phase. **STOP after this phase** and do not claim unverified work is completed.

---

## Phase 14: Remote content, push notifications, support and policies

1. FCM push service with Android 13+ permission handling, opt-in and quiet hours, notification channels, deep links, throttling, per-user preferences, timezone and scheduled delivery. Templates for new test series, exam reminders, streak goals and important system alerts. Do not send unsolicited personalized sensitive information.
2. Admin CMS: home featured cards, exam banners, announcement carousel, learning tips, FAQ, links, promotion displays, theme tokens, content availability and app minimum supported version. All updates validated and versioned; remote config CANNOT inject arbitrary executable code, disable authentication or bypass ad restrictions.
3. App Preferences/Profile: My Exams, Hindi/English, Light/Dark/System, notifications, privacy choices, download/cache controls, support, report question and report app bug, user data export and account deletion workflow.
4. Admin: notification scheduler preview/test/campaign logs, audit, send permission controls, dry run and rate limits. Admin test send must target approved devices/users only.
5. Privacy and policy pages with no fictitious business address or legal claims; provide user-editable placeholders and TODO compliance items. Deep links and universal app links tested.
6. Analytics events instrumented with minimal PII and privacy-safe naming, no unconsented third-party tracking. Provide monitoring status, push failure logs and retry safeguards.

Acceptance: authorized admin publishes an announcement and Android pulls updated content; opt-in test FCM notification reaches device and opt-out respected; profile deletion flow tested.
