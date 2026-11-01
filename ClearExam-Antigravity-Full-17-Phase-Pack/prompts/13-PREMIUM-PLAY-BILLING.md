# ClearExam | Antigravity Phase Prompt

**IMPORTANT — RUN THIS PROMPT INSIDE THE EXISTING ClearExam workspace, NOT A NEW PROJECT.**

Before editing: inspect Git status, read `AGENTS.md`, `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/API-CONTRACT.md`, `docs/PHASE-TRACKER.md`, and inspect existing tests and current code. Preserve all working functionality and all prior-phase acceptance gates. If an expected document is missing, first explain and reconstruct it from committed source without overriding approved choices.

Implement REAL source code, not just an architecture plan, screenshots or dummy screens. External credentials, billing accounts and deployment authorizations are user-owned; prepare adapters and clear setup instructions without inventing secrets or claiming connections are live. Never run destructive cloud/database commands or deploy production without explicit approval. Do not silently modify `main` or push changes. Make a dedicated feature branch where possible.

Every operation must have working auth/authorization, typed inputs/outputs, loading/empty/error/success states, observability and tests appropriate to the phase. Do not reveal exam answer keys to active students. Preserve historical attempt scoring snapshots. Use real data for metrics; clearly label any dev fixtures.

**Required final report:** changed paths, actual working features, migrations/indexes/rules, tests/build commands with PASS/FAIL/BLOCKED evidence, remaining problems, user configuration steps, and precise readiness gate for the next phase. **STOP after this phase** and do not claim unverified work is completed.

---

## Phase 13: Premium subscription with verified entitlements and safe UX

1. Build configurable plans: Free, Premium Individual, future Institute. Feature entitlements include ad-free, analytics depth, optional advanced AI/practice sets; free must remain useful and full exam result/history never held hostage behind ads.
2. For Android digital content sold via Google Play, integrate official Play Billing Library; NEVER use Razorpay directly inside Play-distributed Android app for covered digital subscriptions unless a documented policy exception applies. Do not invent plan prices, product IDs or Play approval.
3. Server verifies Play purchase/subscription via official APIs, binds to uid, grants idempotent entitlements, handles pending, renewal, expiry, cancel, refund, revoke, grace period, account hold, restore purchases and webhooks/RTDN where relevant.
4. Super Admin can configure display entitlements and visibility within approved product configuration, NOT arbitrarily unlock unpaid subscriptions in production; maintain audit and explicit admin grant/revoke with reason.
5. Paywall must show actual live plan name/pricing loaded from Play, cancellation terms, free trial conditions if configured, and manage subscription link. Friendly errors and fallbacks.
6. Web subscription provider can be planned separately with channel-specific policy-compliant checkout; never share false billing receipts across channels.
7. Tests: unverified client purchase spoof, duplicate events, refunded access, expired access, premium hides ads, free remains usable, repeated app reinstall/restore.

Acceptance: test purchase in sandbox confirms server-verified entitlements; production payment launch BLOCKED until merchant/Play Console config and official test transactions succeed.
