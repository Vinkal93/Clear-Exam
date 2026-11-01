# ClearExam — Changelog

All notable changes to the ClearExam platform are documented in this file.

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
