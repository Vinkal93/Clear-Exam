# ClearExam | Antigravity Phase Prompt

**IMPORTANT — RUN THIS PROMPT INSIDE THE EXISTING ClearExam workspace, NOT A NEW PROJECT.**

Before editing: inspect Git status, read `AGENTS.md`, `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/API-CONTRACT.md`, `docs/PHASE-TRACKER.md`, and inspect existing tests and current code. Preserve all working functionality and all prior-phase acceptance gates. If an expected document is missing, first explain and reconstruct it from committed source without overriding approved choices.

Implement REAL source code, not just an architecture plan, screenshots or dummy screens. External credentials, billing accounts and deployment authorizations are user-owned; prepare adapters and clear setup instructions without inventing secrets or claiming connections are live. Never run destructive cloud/database commands or deploy production without explicit approval. Do not silently modify `main` or push changes. Make a dedicated feature branch where possible.

Every operation must have working auth/authorization, typed inputs/outputs, loading/empty/error/success states, observability and tests appropriate to the phase. Do not reveal exam answer keys to active students. Preserve historical attempt scoring snapshots. Use real data for metrics; clearly label any dev fixtures.

**Required final report:** changed paths, actual working features, migrations/indexes/rules, tests/build commands with PASS/FAIL/BLOCKED evidence, remaining problems, user configuration steps, and precise readiness gate for the next phase. **STOP after this phase** and do not claim unverified work is completed.

---

## Phase 01: Secure accounts, identity, profile and authorization

1. Integrate Firebase Google Sign-In for Android and admin web; optionally email/password behind config; optional guest browse with explicit restrictions. Handle loading, logged-out, revoked token and account recovery states.
2. Build trusted API auth middleware verifying Firebase ID tokens, expiry, disabled/revoked status as appropriate. Reject forged UID headers and unauthenticated privileged endpoints. Add App Check as additional defense where supported, not a substitute for identity.
3. Roles: `SUPER_ADMIN`, `CONTENT_ADMIN`, `EDITOR`, `REVIEWER`, `INSTITUTE_ADMIN` (reserved until institute phase), `STUDENT`. Role permission matrix lives in server code/config and tests; client never assigns roles. Least privilege.
4. Implement one-time local/secure-command Super Admin bootstrap with explicit allowlisted UID, a dry-run preview, and audit log. No public role-assignment routes and no default credentials. Require elevated admin for staff invitations/revocation.
5. User fields: stable UID, name, avatar, languages, exam follows, age-audience handling/privacy, consent/notification preferences, timestamps and deletion state. Do not collect unnecessary PII; avoid DOB unless absolutely needed.
6. Firestore rules: own profile only, safe catalog access, deny private answer keys, exams drafts, roles, other students' attempts. Privileged operations via backend with explicit checks.
7. Admin login and account/role management screen; student login/onboarding skeleton. Server-side audit trail for permissions. Handle student account deletion/export request lifecycle.
8. Implement Firebase emulator integration tests: student cannot become super admin, cannot view another student's history, cannot publish, admin privileged API denies ID token without required role.

Acceptance: sign-in works with real dev Firebase or emulator; role enforcement demonstrably server-side; bypass attempts fail; no secrets in client; manual setup clearly documented.
