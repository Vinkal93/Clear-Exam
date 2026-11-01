# Clear-Exam — Indian Competitive Exam Preparation SaaS

Practice Smarter. Score Higher.

ClearExam is an autonomous, high-performance Indian exam preparation SaaS platform engineered with:
- **Native Android Student App**: Kotlin + Jetpack Compose + Material 3
- **Super Admin Web Portal**: Next.js 15 App Router + TypeScript + Tailwind CSS
- **Shared Cloud Run API**: Node.js + Express + TypeScript
- **Shared Contracts**: `@clearexam/contracts` (Zod schemas, DTOs, Design Tokens)
- **Authoritative Identity & Data**: Firebase Authentication & Google Cloud Firestore

---

## Workspace Structure
```
/
├── apps/
│   ├── admin-web/     # Next.js 15 Super Admin portal
│   └── android/       # Native Kotlin Jetpack Compose app
├── services/
│   └── api/           # Node.js Express REST API (Cloud Run)
├── packages/
│   └── contracts/     # Shared Zod schemas, DTOs, and tokens
├── infra/
│   └── firebase/      # Firestore rules, storage rules, and emulator config
└── docs/              # Comprehensive PRD, Architecture, and Phase Trackers
```

---

## Getting Started

### Prerequisites
- Node.js >= 20.x
- JDK 17 LTS
- Android SDK 35/36

### Quickstart
```bash
# Install all dependencies across monorepo
npm install

# Build shared contracts
npm run build --workspace=@clearexam/contracts

# Run backend API
npm run dev --workspace=@clearexam/api

# Run Super Admin portal
npm run dev --workspace=@clearexam/admin-web
```

---

## Governance & Rules
See [AGENTS.md](AGENTS.md) for non-negotiable engineering invariants, security policies, and phase protocols.
