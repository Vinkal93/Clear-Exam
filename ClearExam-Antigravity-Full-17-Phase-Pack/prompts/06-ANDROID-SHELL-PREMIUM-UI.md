# ClearExam | Antigravity Phase Prompt

**IMPORTANT — RUN THIS PROMPT INSIDE THE EXISTING ClearExam workspace, NOT A NEW PROJECT.**

Before editing: inspect Git status, read `AGENTS.md`, `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/API-CONTRACT.md`, `docs/PHASE-TRACKER.md`, and inspect existing tests and current code. Preserve all working functionality and all prior-phase acceptance gates. If an expected document is missing, first explain and reconstruct it from committed source without overriding approved choices.

Implement REAL source code, not just an architecture plan, screenshots or dummy screens. External credentials, billing accounts and deployment authorizations are user-owned; prepare adapters and clear setup instructions without inventing secrets or claiming connections are live. Never run destructive cloud/database commands or deploy production without explicit approval. Do not silently modify `main` or push changes. Make a dedicated feature branch where possible.

Every operation must have working auth/authorization, typed inputs/outputs, loading/empty/error/success states, observability and tests appropriate to the phase. Do not reveal exam answer keys to active students. Preserve historical attempt scoring snapshots. Use real data for metrics; clearly label any dev fixtures.

**Required final report:** changed paths, actual working features, migrations/indexes/rules, tests/build commands with PASS/FAIL/BLOCKED evidence, remaining problems, user configuration steps, and precise readiness gate for the next phase. **STOP after this phase** and do not claim unverified work is completed.

---

## Phase 06: Real native Android shell matching approved ClearExam screen designs

1. Build native `apps/android` project in Kotlin + Jetpack Compose + Material 3, MVVM, StateFlow/coroutines, Navigation Compose, Hilt or validated DI, Retrofit/Ktor client with typed API, Room approved local cache and DataStore settings. Must compile in Android Studio; do not wrap WebView or present React UI as native.
2. Use the four reference screenshots in `assets/reference-ui/`: Home, Explore, Practice, History. Recreate their visual hierarchy with production-quality Compose, adapting to true mobile constraints and real data. Do not embed screenshots as the user interface. Screenshot demo names/scores/counts are fictional placeholders; DO NOT hardcode them as real.
3. Design tokens: primary #2563EB, violet #7C3AED, light #F8FAFC, dark #0B1220, semantic colors, 8dp grid, rounded but controlled cards, clean icons, Inter-like Latin font and Noto Sans Devanagari fallback; accessibility contrast and 200% font scale support.
4. Bottom nav exactly Home / Explore / Practice / History / Profile; persistent navigation state, Android back stack, correct edge-to-edge and IME/insets, tablets, landscape where reasonable, gesture safe areas.
5. Screens: splash/session restore, onboarding, Google login, guest browse, exam follows/personalization, Home, Explore category/search/filter, exam detail, Practice tabs, History list placeholder backed by real API, Profile/settings. Every tap navigates to a real meaningful view; missing backend capability shows explicit unavailable state.
6. Image assets should be owned or properly licensed. Create illustration adapters or neutral placeholders when not available; never introduce uncontrolled internet fetches. Consistent loading/shimmer, error/empty/retry.
7. Verify actual `assembleDebug` if Android SDK available, Compose previews/screenshot tests where toolchain permits, small 360dp/412dp and large devices, Hindi overflow, accessible semantic labels.

Acceptance: compile verified or BLOCKED with exact reason; five tabs navigate correctly; catalog from real backend; no dummy statistics; portrait and tablet layouts usable.
