# ClearExam — Security & Compliance Architecture

## 1. Authentication & Identity
- Firebase Authentication is the sole identity authority.
- The Node.js API verifies all requests via `admin.auth().verifyIdToken(token)`.
- Client requests pass the JWT in the standard `Authorization: Bearer <token>` header.
- Roles are assigned strictly by the backend in custom claims:
  - `superadmin`: Global administration and settings.
  - `content_admin`: Full CRUD over catalog and test series.
  - `editor`: Question bank draft creation.
  - `reviewer`: Question verification and publication authorization.
  - `student`: Standard B2C user.

---

## 2. Authorization & Least Privilege
- **No Direct Answer Access**: Client devices are denied direct Firestore read access to `/question_bank_keys/{id}` via strict security rules:
  ```
  match /question_bank_keys/{questionId} {
    allow read, write: if false; // Accessible only by Cloud API Admin SDK
  }
  ```
- **Attempt Isolation**: Students can read and write only their own attempts:
  ```
  match /attempts/{attemptId} {
    allow read: if request.auth != null && resource.data.userId == request.auth.uid;
    allow write: if false; // All attempt transitions handled via server API
  }
  ```
- **Audit Logging**: Any modification to exam questions, patterns, or user roles creates an immutable document in `/audit_logs`.

---

## 3. Anti-Cheating & Integrity Safeguards
1. **Server-Side Expiry**: Student clocks are untrusted. If `now() > serverExpiresAt`, the backend rejects subsequent response writes with `EXAM_EXPIRED` (409 Conflict) and transitions the attempt to `SUBMITTED`.
2. **Idempotent Submission**: Multiple concurrent submit requests from erratic connections result in a single atomic grading transaction.
3. **Question Scrambling**: The question and option orders are shuffled per student attempt and frozen on the server.
4. **App Check**: Google Play Integrity App Check tokens are verified to ensure calls originate from authentic Android APK builds.

---

## 4. Child & Student Privacy Policy
- ClearExam adheres to Google Play Families Policy guidelines.
- Advertising (AdMob) is restricted:
  - No behavioral targeting or personalized ad tracking for users under 18 or unknown age.
  - Ads are never displayed during active test countdowns or across results review screens.
