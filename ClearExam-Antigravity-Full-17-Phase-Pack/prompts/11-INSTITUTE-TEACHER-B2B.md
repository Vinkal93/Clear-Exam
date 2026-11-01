# ClearExam | Antigravity Phase Prompt

**IMPORTANT — RUN THIS PROMPT INSIDE THE EXISTING ClearExam workspace, NOT A NEW PROJECT.**

Before editing: inspect Git status, read `AGENTS.md`, `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/API-CONTRACT.md`, `docs/PHASE-TRACKER.md`, and inspect existing tests and current code. Preserve all working functionality and all prior-phase acceptance gates. If an expected document is missing, first explain and reconstruct it from committed source without overriding approved choices.

Implement REAL source code, not just an architecture plan, screenshots or dummy screens. External credentials, billing accounts and deployment authorizations are user-owned; prepare adapters and clear setup instructions without inventing secrets or claiming connections are live. Never run destructive cloud/database commands or deploy production without explicit approval. Do not silently modify `main` or push changes. Make a dedicated feature branch where possible.

Every operation must have working auth/authorization, typed inputs/outputs, loading/empty/error/success states, observability and tests appropriate to the phase. Do not reveal exam answer keys to active students. Preserve historical attempt scoring snapshots. Use real data for metrics; clearly label any dev fixtures.

**Required final report:** changed paths, actual working features, migrations/indexes/rules, tests/build commands with PASS/FAIL/BLOCKED evidence, remaining problems, user configuration steps, and precise readiness gate for the next phase. **STOP after this phase** and do not claim unverified work is completed.

---

## Phase 11: Optional institute portal, without forcing students to join an institute

1. ClearExam remains B2C: any eligible student can independently register and practise public exams. Institute membership is OPTIONAL. Add `Institute Admin`, `Teacher`, `Student Member` scoped roles as explicit membership assignments separate from global Super Admin.
2. Institute registration/applications, approval, institute profile, unique join code/link with expiry/rotation/revocation, invite approvals, branches/classes/batches and teacher memberships; account can be a member of multiple institutions where policy allows.
3. Institutes may create private tests from their own authored questions or legally available approved shared pool, assign scheduled tests to classes, inspect own consenting members' permitted results and invite students. Global answer banks and user history across other institutes must remain inaccessible.
4. Enforce tenant isolation on EVERY API and Firestore access, not just visible UI. Test cross-tenant IDOR, stolen join codes, teacher editing another institute, opt-out, member removal, global exam availability after exit.
5. Permission matrix for Super Admin vs Institute Admin vs Teacher vs Student, audit logs and institute-specific quotas/entitlements. Reserve invoices/billing as a later signed-off subfeature, not a fake admin page.
6. Optional institution theming must not override global security, ads policy, exam result integrity or app accessibility.

Acceptance: 2 test institutes cannot read or edit each other's records; a non-institute student still uses all public practice flows.
