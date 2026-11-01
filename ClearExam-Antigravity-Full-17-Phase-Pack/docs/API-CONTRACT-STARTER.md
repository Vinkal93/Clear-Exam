# ClearExam | API Contract Starter (Design Reference)

Base path `/v1`. Exact error schema, authorization, versioning and DTOs must be formalized in OpenAPI by Phase 00/05. All authenticated calls use Firebase ID token (backend-verified), least privilege; App Check where configured.

| Route | Role | Notes |
|---|---|---|
| `GET /healthz` | Public | no sensitive data |
| `GET /v1/catalog/categories` | Public | published and safe fields only |
| `GET /v1/catalog/exams` | Public | search, filter, pagination |
| `GET /v1/catalog/exams/{examId}` | Public | no answer keys |
| `GET /v1/catalog/exams/{examId}/tests` | Public | published only |
| `POST /v1/attempts` | Student | server start, revision, expiry, frozen order |
| `GET /v1/attempts/{id}` | Attempt owner | safe session state |
| `PUT /v1/attempts/{id}/responses/{questionId}` | Attempt owner | response revision/idempotency |
| `POST /v1/attempts/{id}/submit` | Attempt owner | single, idempotent finalization |
| `GET /v1/attempts/{id}/result` | Attempt owner | result visibility enforced |
| `GET /v1/attempts/{id}/review` | Attempt owner | keys only after authorized reveal |
| `GET /v1/me/attempts` | Student | paginated |
| `GET /v1/me/analytics` | Student | aggregate only verified data |
| `/v1/admin/categories/*` | Content Admin+ | CRUD + RBAC |
| `/v1/admin/exams/*` | Content Admin+ | CRUD + publish workflow |
| `/v1/admin/questions/*` | Editor/Reviewer per action | separate private keys |
| `/v1/admin/test-series/*` | Content Admin+ | versioned patterns |
| `/v1/admin/imports/*` | Content Admin+ | batch preview/commit |
| `/v1/admin/settings/*` | Super Admin | changes validated/audited |
| `/v1/admin/ai-jobs/*` | Editor+ | quota and human review |
| `/v1/institutes/*` | Scoped member | isolation checks |

Recommended error JSON `{code, message, requestId, details?}` with stable error codes; normalize errors and avoid disclosing internal keys. Time fields UTC ISO-8601; no client-forged UID or score input. Use paginated list responses with cursor tokens.
