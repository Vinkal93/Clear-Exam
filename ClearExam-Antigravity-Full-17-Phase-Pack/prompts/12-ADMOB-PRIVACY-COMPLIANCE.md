# ClearExam | Antigravity Phase Prompt

**IMPORTANT — RUN THIS PROMPT INSIDE THE EXISTING ClearExam workspace, NOT A NEW PROJECT.**

Before editing: inspect Git status, read `AGENTS.md`, `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/API-CONTRACT.md`, `docs/PHASE-TRACKER.md`, and inspect existing tests and current code. Preserve all working functionality and all prior-phase acceptance gates. If an expected document is missing, first explain and reconstruct it from committed source without overriding approved choices.

Implement REAL source code, not just an architecture plan, screenshots or dummy screens. External credentials, billing accounts and deployment authorizations are user-owned; prepare adapters and clear setup instructions without inventing secrets or claiming connections are live. Never run destructive cloud/database commands or deploy production without explicit approval. Do not silently modify `main` or push changes. Make a dedicated feature branch where possible.

Every operation must have working auth/authorization, typed inputs/outputs, loading/empty/error/success states, observability and tests appropriate to the phase. Do not reveal exam answer keys to active students. Preserve historical attempt scoring snapshots. Use real data for metrics; clearly label any dev fixtures.

**Required final report:** changed paths, actual working features, migrations/indexes/rules, tests/build commands with PASS/FAIL/BLOCKED evidence, remaining problems, user configuration steps, and precise readiness gate for the next phase. **STOP after this phase** and do not claim unverified work is completed.

---

## Phase 12: Android advertising with strict UX/privacy boundaries

1. Implement AdMob SDK with official test ad units in debug only; production IDs in secure environment/remote config. No real production ads in dev builds. Native/banner placements for suitable Home, Explore and non-test content; no ads during active timed or untimed answering, critical submission flows, result blocking or answer review overlays.
2. A capped interstitial may be considered ONLY at policy-compliant natural transition, not every test completion/history click, not surprising after next screen loaded. Global frequency cap, cooldown, per-session limits, experiments behind policies. Admin can reduce/disable placements, NOT override hardcoded safety exclusion list.
3. Add Google UMP consent flow and user privacy choices where required; no personalized ads or tracking before appropriate consent. Include Play Data safety and privacy disclosures for age audience.
4. Before monetization, design age/audience handling suitable for classes 6–12: comply with Google Play Families and use appropriate certified SDK/child-directed requests or disable ads for child/unknown audiences as policy requires. Avoid collecting DOB if not necessary; implement safe defaults.
5. Premium and other authorized no-ad profiles suppress ad requests; ad failure never blocks exam/results/navigation. Add internal Ad Diagnostics screen visible only to developer/admin and policy test scenario toggles.
6. Verify official Play and AdMob policy against live documentation before going production, log references/verification date in docs.
7. Tests: no ad during tests, no ad to result-gated flow, cap respected, unknown-age safe settings, premium suppression, consent denied, network unavailable, debug IDs correct, no click incentives.

Acceptance: test ads show only on allowlisted screens/eligible natural breaks, exam/answers/results work without ads, child/privacy checks documented.
