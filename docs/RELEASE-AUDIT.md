# ClearExam — Release Quality Audit Checklist

Before releasing any build or promoting to production, every item in this checklist must be satisfied.

## 1. Security & Integrity Audit
- [ ] No Firebase admin keys or secrets committed in Git history.
- [ ] Firestore rules explicitly tested against unauthorized access (negative tests).
- [ ] Active test payloads verified to contain ZERO correct answer keys or solution texts.
- [ ] Server expiration sweeps active attempts with expired duration.
- [ ] Multiple concurrent submits yield identical idempotent grading results.

## 2. Dynamic Catalog & Content
- [ ] Zero hardcoded exam names or test lists in Android APK.
- [ ] Empty state rendered properly when categories or tests are empty.
- [ ] AI-generated questions strictly quarantined until reviewer approval.

## 3. Client & UI Quality
- [ ] Android cold start measured under 2.0s on reference device.
- [ ] Offline response persistence in Room verified with airplane mode test.
- [ ] Colors and typography verified against design token specifications.
- [ ] All buttons have active event handlers or disabled states (no dead clicks).

## 4. Compliance & Monetization
- [ ] AdMob banners and interstitials completely absent during active test runs.
- [ ] Google Play Families compliance verified for youth audience protection.
- [ ] Google Play Billing subscription rights verified server-side.
