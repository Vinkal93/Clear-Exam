# ClearExam | Frozen Architectural Decisions (v1.0)

## Scope and identity
- Product is an independent, unofficial practice platform for *multiple* exam categories, not an official exam delivery system.
- Primary clients: Kotlin Compose Android; Next.js TypeScript Admin. Shared server Node/TypeScript Cloud Run.
- Firebase Authentication for identity; Firestore for catalog/attempts/aggregates; Cloud Storage for media. Server Admin SDK handles privileged operations. Native Android may use Room/DataStore for approved local caches/preferences only.
- One repo and one shared `/v1` OpenAPI contract. Dev, staging and prod are separate Firebase/Cloud environments.

## Server trust boundaries
- Firebase ID token verified on server; explicit role & resource ownership checks on every sensitive API.
- Student-safe public questions contain no correct option, answer key or explanation until review is authorized.
- A test start locks a published revision and a stable question order with server-start and server-expiry timestamps.
- A response save acknowledges actual persistence and handles retries/revisions; offline pending save is never shown as saved.
- Server-only idempotent submit + grading + expiry sweeper. Historical attempt snapshots immutable.
- Firestore rules deny private answer key reads, other users' attempts and any unauthorized admin writes. App Check is defense-in-depth, not auth.

## Business and compliance
- Any student can practice public exams without institute membership. Institutes are optional B2B tenants.
- Fully dynamic exam catalog and configurable patterns. New exam needs published validated questions; no app update required.
- All AI questions human-reviewed before publication. Unverified PYQs/official logos/affiliations prohibited.
- App ads are secondary monetization and never gate results. No ads while answering timed tests. Children/unknown-age ad policy assessed before launch.
- Google Play digital in-app purchases via Play Billing where required; subscription rights verified server-side.

## Coding and operations
- GitHub main protected and feature branches; no secrets committed. CI verification, emulator tests, Cloud logging, cost budgets, Firestore index review, backup/restore.
- Prefer modular monolith services and a single database initially, not premature microservices or a second database.
- Public search can start with normalized Firestore query indexes and bounded categories; introduce dedicated search only after measurement.
- No claim of production-readiness without physical Android device QA and a live staging end-to-end test.
