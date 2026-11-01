# ClearExam — API Contract Specification (REST v1)

All endpoints conform to `/v1`. Authenticated requests require the HTTP header:
`Authorization: Bearer <FIREBASE_ID_TOKEN>`

## 1. Standard Error Envelope (RFC 7807 Aligned)
Every non-2xx response returns:
```json
{
  "code": "INVALID_CREDENTIALS | EXAM_EXPIRED | FORBIDDEN | RESOURCE_NOT_FOUND | VALIDATION_ERROR | INTERNAL_ERROR",
  "message": "Human readable explanation without leaking internal infrastructure details.",
  "requestId": "req_01h7abc...",
  "timestamp": "2026-11-01T03:00:00.000Z",
  "details": [
    {
      "field": "testId",
      "issue": "Required string"
    }
  ]
}
```

---

## 2. Standard Success Envelope & Cursor Pagination
List endpoints return:
```json
{
  "data": [ ... ],
  "meta": {
    "total": 42,
    "hasMore": true,
    "nextCursor": "cursor_eyJpZCI6...",
    "requestId": "req_01h7abc..."
  }
}
```

Single resource responses return:
```json
{
  "data": { ... },
  "meta": {
    "requestId": "req_01h7abc..."
  }
}
```

---

## 3. Endpoints Matrix

### 3.1 System & Health
- `GET /healthz` — System health, node uptime, and database readiness.

### 3.2 Public & Student Catalog
- `GET /v1/catalog/categories` — List all published exam categories.
- `GET /v1/catalog/exams?categoryId={id}` — List exams with optional category filter.
- `GET /v1/catalog/exams/{examId}` — Get detailed exam info and structure.
- `GET /v1/catalog/exams/{examId}/tests` — List published test series and practice mock tests.

### 3.3 Test Execution & Attempts (Student Role)
- `POST /v1/attempts`
  - Body: `{ "testId": string }`
  - Returns: `{ attemptId, serverExpiresAt, serverStartedAt, sections }`
  - Note: Questions returned do NOT contain correct answers or explanations.
- `GET /v1/attempts/{id}`
  - Returns current attempt state and synced responses.
- `PUT /v1/attempts/{id}/responses/{questionId}`
  - Body: `{ "selectedOptionIds": string[], "numericalValue": number | null, "isMarkedForReview": boolean, "timeSpentSeconds": number }`
  - Returns: `{ "status": "SAVED", "persistedAt": string }`
- `POST /v1/attempts/{id}/submit`
  - Body: `{}` (Idempotent call)
  - Returns: Result summary.
- `GET /v1/attempts/{id}/result`
  - Returns score breakdown, accuracy, section stats.
- `GET /v1/attempts/{id}/review`
  - Returns questions with correct options, solutions, and explanations (only after grading).
- `GET /v1/me/attempts` — Student's historical attempts with cursor pagination.
- `GET /v1/me/analytics` — Student's aggregate performance and accuracy statistics.

### 3.4 Admin APIs (Role: `content_admin` or `superadmin`)
- `POST /v1/admin/categories` — Create/update categories.
- `POST /v1/admin/exams` — Create/update exams and publication status.
- `POST /v1/admin/questions` — Create rich questions with separate answer key payload.
- `POST /v1/admin/questions/import` — Bulk CSV/JSON import with validation.
- `POST /v1/admin/test-series` — Build versioned test patterns and publish tests.
- `GET /v1/admin/audit-logs` — Review actions and changes.
