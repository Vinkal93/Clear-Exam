# CLEAR EXAM — Antigravity Zero-to-Production Prompt Pack

## Read this first (Hinglish)
Bhai, ye **PROMPT + PROJECT-MANAGEMENT PACK** hai, **ready-made completed app/APK nahi**. All 17 phases ke detailed copy-paste prompts isme hain. Pichle Home/Explore/Practice/History reference designs bhi included hain. Antigravity ko repo ke saare folders dikhana; phir `prompts/MASTER-START-PASTE-FIRST.md` paste karna.

### Setup
1. Open official Google Antigravity desktop app from https://antigravity.google/download and create a new Project with local folder `ClearExam` (or open the existing repo). You may use `/plan`.
2. Extract this pack into your ClearExam local project root. If the project already has source files, **do not overwrite same-name files blindly**; safely copy pack under `planning/` and point agent there.
3. Attach/reference included UI screenshots. They are *design examples*, not implemented Android layouts or factual database metrics.
4. Paste entire `prompts/MASTER-START-PASTE-FIRST.md` inside Antigravity. It instructs the agent to **create AGENTS.md itself**, no manual agent.md work required.
5. After Phase 00 code/tests are reviewed, paste `prompts/01-AUTH-USERS-PERMISSIONS.md`, then 02...16 one at a time. If a phase fails its acceptance gate, do not advance. For important decisions, require the agent to show `/plan` first.
6. Firebase keys, Google OAuth, Cloud Run, AdMob account, Play Billing/Play Console, signing keystore etc must be configured in authorized consoles. Never paste private secrets into a chat/repo.
7. Use Android Studio to compile/run the Kotlin app and verify on a real Android device before claiming release ready.

### Deliverables expected after completion
- Native Kotlin+Compose Android Student App: Home / Explore / Practice / History / Profile; dynamic exams; timer; autosave; results; analytics; custom mocks, admin-driven content.
- Web Super Admin: auth/roles; categories, exams, chapters, questions, bulk import, test series, AI review, settings, monetization controls.
- Secure shared backend with versioned grading, independent login, historical results, compliance safeguards.

### Design refs
- `assets/reference-ui/01-home.png`
- `assets/reference-ui/02-explore.png`
- `assets/reference-ui/03-practice.png`
- `assets/reference-ui/04-history.png`

### Product boundaries
- Do not hardcode exams, fake student counts, rankings, progress or PYQ labels; screenshot numbers are visual references only.
- Free B2C access independent of institutes.
- Admin owns exam pattern and content; user can create personal practice quizzes.
- Actual policies and official exam patterns must be checked for each exam/version before publishing.
- Add ads after core exam flows; never show ads during tests or block result.
- `ClearExam` is a working title pending trademark/store verification.

### Useful official docs
- Antigravity start: https://antigravity.google/docs/getting-started
- Antigravity planning: https://antigravity.google/docs/plan/
- Firebase verify tokens: https://firebase.google.com/docs/auth/admin/verify-id-tokens
- AdMob interstitials: https://support.google.com/admob/answer/6201362
- Google Play Families: https://support.google.com/googleplay/android-developer/answer/9893335
- Google Play payments: https://support.google.com/googleplay/android-developer/answer/9858738
