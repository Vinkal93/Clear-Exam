# ClearExam Phase Quality Gates

A phase counts DONE only when (a) source committed on branch, (b) action runs for real, (c) security boundaries tested, (d) regressions absent, (e) user-facing navigation/errors handled, (f) tests PASS or limitations declared, (g) docs/API contracts and tracker updated.

| Critical scenario | Expected |
|---|---|
| Unauthorized student calls admin API | 403 |
| Student requests another student's attempt | 403 or non-leaking 404 |
| Student reads correct answer before grading | No key reachable in API or Firestore |
| Admin publishes new arbitrary exam | Visible on Android without redeploy |
| Approved question edited after attempt | Old attempt score/review unchanged |
| Timer background/process kill | Server expiry controls behavior |
| Two simultaneous submit calls | One grading event / same final result |
| Network fails during save | Pending state visible; no false save success |
| No real database stats | Empty/zero, never synthetic metrics |
| Unapproved AI question | Never in public bank |
| Child/unknown-age user | Safe ad handling or no ads |
| AdMob unavailable | Practice, result and history continue |
| Premium purchase spoofed locally | No server entitlement |
| Non-institute student | Access to public exam catalog allowed |
| 2 institutes with same student accounts | Cross-tenant data denied |
| Android device QA | Real device/emulator evidence and screenshots |

**Evidence report template for every phase:**
```
Branch/commit:
Files changed:
Working demo path:
Commands executed + exit status:
Tests PASS:
Tests FAIL:
NOT TESTED:
BLOCKED (reason):
Secrets / console config user must supply (names only):
Known regression risks:
Docs and AGENTS.md updated:
Next prompt to paste:
```
