# ClearExam — Changelog

All notable changes to the ClearExam platform are documented in this file.

## [Phase 02: Admin Dynamic Catalog] — 2026-11-01
### Added
- Unlimited dynamic exam hierarchy: Category → Exam → Syllabus Version → Paper/Subject → Chapter/Topic.
- Public read-only catalog routes: `/v1/catalog/categories`, `/v1/catalog/exams`, `/v1/catalog/exams/:id`, and `/v1/catalog/exams/:id/subjects`.
- Role-guarded Super Admin catalog APIs (`CONTENT_ADMIN`, `SUPER_ADMIN`, `EDITOR`):
  - Real database aggregate metrics endpoint `/v1/admin/catalog/stats` (zero fake numbers).
  - Category CRUD & instant publish toggle with security audit trail.
  - Exam CRUD with bilingual labels (English/Hindi), conducting bodies (NTA, UPSC, SSC, etc.), and duration.
  - Subject and chapter hierarchy creation endpoints.
- Super Admin Web views:
  - Persistent desktop sidebar & mobile drawer with active breadcrumbs.
  - Real metrics Dashboard (`/`) with honest zero states.
  - Category Manager (`/admin/categories`) with search, filter, and modal.
  - Exam Manager (`/admin/exams`) with category filters and publish toggle.
  - Syllabus & Hierarchy Manager (`/admin/exams/[id]/syllabus`) with visual tree view.
- Android student dynamic catalog integration:
  - Dynamic horizontal category carousel on `HomeScreen.kt`.
  - Dynamic exam cards showing duration, questions count, and conducting body.
  - Clean non-fabricated empty state when no exams are published.
- Automated API test suite expanded to 21 passing tests (zero regressions).

## [Phase 01: Auth, Users & Permissions] — 2026-11-01
### Added
- Authoritative Firebase ID token verification middleware (`authMiddleware`) checking revoked and expired tokens.
- Role-based authorization (`requireRole`) supporting `SUPER_ADMIN`, `CONTENT_ADMIN`, `EDITOR`, `REVIEWER`, `STUDENT`.
- Immutable security audit logger recording administrative actions and role transitions to `/audit_logs`.
- Profile API endpoints: `GET /v1/auth/me`, `PUT /v1/auth/me` (safe fields), and `POST /v1/auth/me/delete` (GDPR/compliance deletion).
- Administrative role management endpoints: `GET /v1/admin/users`, `POST /v1/admin/users/:uid/role`, `POST /v1/admin/users/:uid/revoke`.
- Offline Super Admin bootstrap CLI tool (`npm run bootstrap:superadmin`) with dry-run protection.
- Hardened `firestore.rules` denying student self-elevation of role or subscription.
- Admin Web authentication portal: `AuthContext`, `/login`, and `/admin/users` role directory with assignment modal.
- Android student authentication layer: `AuthRepository`, `LoginScreen.kt` with Google Sign-in and guest browse disclaimers.
- Automated security integration test suite (10 security tests + 3 health checks passing).

## [Phase 00: Foundation & Governance] — 2026-11-01
### Added
- Monorepo structure with npm workspaces (`packages/*`, `services/*`, `apps/*`).
- Root `AGENTS.md` establishing autonomous development contracts and invariant rules.
- Complete specification documentation suite (`PRD.md`, `ARCHITECTURE.md`, `ADR-001.md`, `DATA-MODEL.md`, `API-CONTRACT.md`, `SECURITY.md`, `UI-TOKENS.md`, `SETUP.md`, `PHASE-TRACKER.md`).
- `@clearexam/contracts` package with Zod validation and TypeScript types for catalog, tests, attempts, errors, and design tokens.
- Shared Node.js Express API (`services/api`) with structured Pino logging, request ID tracking, RFC 7807 error envelopes, and `/healthz` endpoint.
- Next.js 15 Super Admin web portal (`apps/admin-web`) with Tailwind CSS, health route, and system dashboard shell.
- Android Jetpack Compose clean architecture app skeleton (`apps/android`) with Gradle configuration, extracted UI tokens, and Material 3 theme.
- Firebase infrastructure definitions (`infra/firebase`) including default-deny `firestore.rules`, emulator configs, and seed scripts.
- GitHub Actions CI workflow (`.github/workflows/ci.yml`).
