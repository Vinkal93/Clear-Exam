# AGENTS.md — ClearExam Autonomous Development & Engineering Rules

> **PERMANENT GOVERNANCE POLICY**: This document defines the engineering invariants, architectural contracts, security boundaries, and validation protocols for all human developers and autonomous AI agents working on **ClearExam**. Every phase of development must strictly comply with these rules.

---

## 1. Core Mission & Philosophy
ClearExam is a production-grade, dynamic Indian exam preparation SaaS platform comprising:
- Native Kotlin + Jetpack Compose Android Student App
- Responsive Next.js Super Admin Web Portal
- High-Performance Node.js TypeScript API (Cloud Run)
- Firebase Auth, Firestore, and Cloud Storage for identity and data
- Authoritative exam engine with versioned patterns and immutable submissions

**Rule 1.1 — Real Implementation Only**: Prototypes, mock screens with dead buttons, hardcoded placeholder arrays masquerading as dynamic catalogs, and simulated or fabricated test results are strictly forbidden. Every feature must connect to real data structures and real API endpoints with robust error handling.

**Rule 1.2 — Zero Fabricated Metrics**: Never display fake user counts, artificial rankings, synthetic PYQ badges, or fabricated test attempts. If an exam category or question bank is empty, render a helpful, properly designed empty state.

---

## 2. Server Trust & Exam Engine Invariants

**Rule 2.1 — Server-Authoritative Timer & Grading**:
- The client (Android app) never determines whether a test has expired or what marks a student scored.
- When an attempt starts, the backend issues an immutable snapshot with `serverStartedAt` and `serverExpiresAt` timestamps.
- When submitted (or expired), the backend executes idempotent grading against the versioned question bank.

**Rule 2.2 — Zero Answer Key Leakage**:
- Under no circumstances shall correct option indices, answer keys, or question explanations be delivered in student test payloads or accessible via public Firestore rules during an active or ongoing test.
- Explanations and answer keys are accessible *only* through an authorized `/v1/attempts/{id}/review` endpoint after the test is finalized and review is permitted.

**Rule 2.3 — Immutable Attempt Snapshots**:
- When a student initiates a test attempt, the exact question IDs, option order, and scoring pattern are frozen.
- Edits or revisions made to the question bank by administrators at a later date must never alter historical attempt snapshots, historical scores, or review views.

**Rule 2.4 — Single Source of Truth**:
- One shared database (Firestore) and one backend service. No parallel or duplicate databases for admin vs student.
- Both Android and Web Admin communicate with the authoritative Node.js API using `/v1` contracts.

---

## 3. Security, Authentication & Least Privilege

**Rule 3.1 — Firebase Auth & Role-Based Access Control (RBAC)**:
- Identity is managed via Firebase Authentication. Every sensitive backend endpoint validates the Firebase ID token using the Firebase Admin SDK.
- Roles (`superadmin`, `content_admin`, `editor`, `reviewer`, `student`, `institute_admin`) are verified server-side via custom claims and Firestore audit checks.
- Clients can never forge or claim their own roles or user IDs (`uid`).

**Rule 3.2 — Firestore Security Rules Default-Deny**:
- Direct client access to Firestore collections must default to `allow read, write: if false;`.
- Strict granular rules govern student profile reads/writes.
- Private collections (`question_bank_keys`, `admin_audit_logs`, `payout_records`) are inaccessible to any direct client request and accessible only by backend Admin SDK credentials.

**Rule 3.3 — Cross-Tenant & Cross-User Isolation**:
- Students may only view and mutate their own test attempts and profiles.
- Institute B2B data must be partitioned strictly by tenant ID. Cross-institute data leakage is a critical security violation.
- Non-institute students have unhindered access to all public exams without institute affiliation.

---

## 4. Multi-Platform Monorepo Architecture

The workspace is organized as a unified monorepo:
```
/
├── apps/
│   ├── admin-web/     # Next.js 15 App Router, TypeScript, Tailwind CSS
│   └── android/       # Native Kotlin, Jetpack Compose, Material 3, Coroutines
├── services/
│   └── api/           # Node.js, Express, TypeScript, Cloud Run HTTP API
├── packages/
│   └── contracts/     # Shared DTOs, Zod Schemas, API Error Envelopes, UI Tokens
├── infra/
│   └── firebase/      # Firestore rules, indexes, storage rules, emulator configs
├── docs/              # Comprehensive PRD, Architecture, ADRs, Data Models, Phase Trackers
└── .github/           # CI/CD workflows and automated quality checks
```

**Rule 4.1 — Shared Contracts First**:
- All data models and API request/response structures must be defined in `packages/contracts` using Zod and TypeScript.
- Backend and Admin Web must import and validate against these shared contracts. Android models must mirror these contracts verbatim.

**Rule 4.2 — UI Token Consistency**:
- All UI colors, typography scales, corner radii, and spacing tokens must align with the extracted reference UI design tokens (`docs/UI-TOKENS.md`).

---

## 5. Development & Verification Protocols

**Rule 5.1 — Phase Discipline**:
- Execute **one phase at a time**. Never advance to the next phase until the current phase passes all quality gates.
- Do not automatically trigger subsequent phases. Wait for user review and explicit command.

**Rule 5.2 — Verification & Evidence**:
- Every code change must be accompanied by real test runs, linter checks, and build executions.
- Provide an explicit Evidence Table at the end of every phase:
  ```markdown
  Branch/Commit:
  Files Changed:
  Working Demo/Verification Path:
  Commands Executed & Exit Status:
  Tests PASS:
  Tests FAIL:
  NOT TESTED:
  BLOCKED (Reason):
  Secrets / User Action Required:
  Known Risks:
  Next Step:
  ```
- If a toolchain or SDK is missing (e.g. Android SDK or external cloud credentials), label that specific check as **BLOCKED** with precise instructions, and complete all independent scaffold and unit test verifications.

**Rule 5.3 — Safe Git Operations**:
- Never force-push or commit directly to `main`.
- All work occurs in dedicated phase branches (`phase-00-foundation`, `phase-01-auth`, etc.).
- Never overwrite existing working code without explicit justification.
- Never commit private secrets, service account JSON files, or live API credentials into Git.

---

## 6. Phase Acceptance Quality Gates
To mark any phase as complete, it must satisfy:
1. Source code compiles and builds without syntax or type errors.
2. Automated tests pass with zero regressions.
3. Security boundaries (auth, RBAC, rule coverage) are verified.
4. Input validation (Zod schemas) handles edge cases, empty states, and invalid payloads.
5. All relevant documentation in `docs/` is updated in sync with code.
