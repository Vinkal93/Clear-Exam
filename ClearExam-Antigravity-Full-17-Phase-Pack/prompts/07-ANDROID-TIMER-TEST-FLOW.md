# ClearExam | Antigravity Phase Prompt

**IMPORTANT — RUN THIS PROMPT INSIDE THE EXISTING ClearExam workspace, NOT A NEW PROJECT.**

Before editing: inspect Git status, read `AGENTS.md`, `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/API-CONTRACT.md`, `docs/PHASE-TRACKER.md`, and inspect existing tests and current code. Preserve all working functionality and all prior-phase acceptance gates. If an expected document is missing, first explain and reconstruct it from committed source without overriding approved choices.

Implement REAL source code, not just an architecture plan, screenshots or dummy screens. External credentials, billing accounts and deployment authorizations are user-owned; prepare adapters and clear setup instructions without inventing secrets or claiming connections are live. Never run destructive cloud/database commands or deploy production without explicit approval. Do not silently modify `main` or push changes. Make a dedicated feature branch where possible.

Every operation must have working auth/authorization, typed inputs/outputs, loading/empty/error/success states, observability and tests appropriate to the phase. Do not reveal exam answer keys to active students. Preserve historical attempt scoring snapshots. Use real data for metrics; clearly label any dev fixtures.

**Required final report:** changed paths, actual working features, migrations/indexes/rules, tests/build commands with PASS/FAIL/BLOCKED evidence, remaining problems, user configuration steps, and precise readiness gate for the next phase. **STOP after this phase** and do not claim unverified work is completed.

---

## Phase 07: Working Android timed exam interface, recovery and submission

1. Screen: exam instructions shows configured sections/duration/marking/negative rules and start eligibility. Start only after verified server attempt; never invent local attempt success.
2. Live exam: top timer and section, progress, rich text/media question, single/multi choice selection, previous/next, clear answer, mark for review, expandable palette with answered/unanswered/review statuses, section restrictions, submit action and accessible focus ordering.
3. Timer uses server `expiresAt` and monotonic elapsed time for smooth UI while periodically syncing clock offset. Handle app background/foreground, process death, system clock changes, network delay and server auto-submission. No ads in active tests or submission dialog.
4. Autosave with server acknowledgement, local pending queue, retry with bounded backoff, conflict resolution and clear 'Pending sync' feedback. If network fails, do not pretend saved. When timed authority cannot be confirmed show recovery/unavailable guidance.
5. Submission confirmation must show attempted/unattempted/review counts and remaining time. On submit, prevent duplicate taps, call idempotent backend; show processing state, retry/recover on timeout without duplicate grade; route to result only when server returns authoritative state.
6. Handle offline downloaded practice separately: offline untimed mode with local scoring only if explicitly provisioned with allowed answer keys; label as local practice, not official backend attempt/rank. No protected answer key cache for timed server tests.
7. Tests: navigate first/last question, save/clear/review, orientation, killed process, resumed attempt, background expiry, double submit, loss of connectivity, server returns 401/403/409/429/500, no UI overlapping Android nav.

Acceptance: complete full mock on emulator/device end-to-end; timer and save persist through restart; expired exam auto-submits; result comes from real backend.
