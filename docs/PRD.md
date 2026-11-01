# ClearExam — Product Requirements Document (PRD)

## 1. Product Overview
**ClearExam** is a modern, high-performance Indian exam preparation SaaS designed to empower students across engineering (JEE Main/Advanced), medical (NEET-UG), civil services (UPSC CSE Prelims), banking (IBPS, SBI PO), and SSC (CGL, CHSL) with real-time test simulations, dynamic question catalogs, detailed performance analytics, and personalized revision.

### Value Proposition
- **For Students**: Free and transparent B2C access to high-yield questions, real exam-pattern mock tests, server-enforced countdown timers, instant performance breakdowns, and offline revision.
- **For Super Admins & Educators**: Complete web-based control over exam categories, subjects, chapters, versioned test series, bulk question imports, AI-assisted question draft workflows, and institute B2B cohort management.

---

## 2. Target Personas
1. **Aspirant Student (Aarav, 18)**: Prepares for JEE/NEET. Needs distraction-free timed test series on Android, immediate accuracy feedback, negative marking calculations, and bookmarking.
2. **Content Creator / Admin (Sunita, 34)**: Manages exam curricula, question banks with LaTeX/diagrams, imports CSV/JSON questions, configures marking rules (+4, -1).
3. **Reviewer / SME (Rajesh, 42)**: Verifies AI-generated or imported questions, inspects answer keys, and approves test publication.
4. **Super Admin**: Oversees system health, user entitlements, security audit trails, monetization, and compliance.

---

## 3. High-Level Core Modules
| Module | Description | Primary Platform |
|---|---|---|
| **Auth & Identity** | Phone, Email/Password, Google Sign-In with Firebase Auth. Role-based claims. | Android & Admin Web |
| **Catalog & Taxonomies** | Dynamic categories, sub-categories, exams, subjects, and chapters. No hardcoding. | Admin Web (Manage) / Android (Browse) |
| **Question Bank & Imports** | Rich text, LaTeX math formulas, multiple choice, numerical, assertion-reason. Bulk import. | Admin Web |
| **Exam Engine** | Versioned patterns, sectional timing, server-authoritative timer, auto-submit on expiry. | Shared Cloud API & Android |
| **Results & Analytics** | Section-wise scores, accuracy, percentile, time spent per question, review with explanations. | Android & Admin Web |
| **Custom Mocks & Revision** | User-created custom practice quizzes, weak-area targeting, saved bookmarks. | Android |
| **AI Content Pipeline** | AI draft generation with mandatory human editor & reviewer sign-off before publishing. | Admin Web |
| **Monetization & AdMob** | Non-intrusive AdMob banners/interstitials (strictly outside active tests), Google Play Billing. | Android |
| **B2B Institute Portal** | Multi-tenant batch management, student assignments, cohort leaderboards. | Admin Web |

---

## 4. Key Functional Requirements

### 4.1 Exam Engine & Test Delivery
- **Start Test**: Calls `POST /v1/attempts`. Backend calculates `serverExpiresAt = now + duration`. Generates shuffled question order snapshot.
- **Save Response**: Continuous `PUT /v1/attempts/{id}/responses/{questionId}` with local caching. UI clearly distinguishes between `SAVED`, `SAVING`, and `SYNC_PENDING`.
- **Submit Test**: Idempotent `POST /v1/attempts/{id}/submit`. Backend locks attempt, calculates marks based on versioned grading scheme, and marks attempt as `GRADED`.
- **Timer Expiry**: Background cron sweeper grades any attempt whose `serverExpiresAt` has elapsed + grace period.
- **Review**: Answer keys and explanations are only available post-submission when authorized by test settings.

### 4.2 Super Admin Control
- Live CRUD on Categories, Exams, Subjects, and Chapters with publish toggles.
- Test Series builder with configurable marking (+4/-1, +2/-0.5, sectional cutoff).
- AI question pipeline requiring explicit Reviewer approval before being added to public question banks.

---

## 5. Non-Functional & Compliance Requirements
- **Performance**: Android app cold start < 1.8s; API response time P95 < 180ms.
- **Offline Resilience**: Student responses are stored locally in Room/DataStore and synced reliably when network recovers.
- **Data Protection & Privacy**: Zero storage of sensitive personal data; AdMob child/family safety compliance.
- **Reliability**: Server-authoritative timer prevents local clock manipulation from altering test time.
