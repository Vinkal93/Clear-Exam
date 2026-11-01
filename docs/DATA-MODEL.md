# ClearExam — Firestore Data Model & Schema Specifications

## 1. Top-Level Firestore Collections

```
/users/{userId}
/categories/{categoryId}
/exams/{examId}
/subjects/{subjectId}
/chapters/{chapterId}
/test_series/{seriesId}
/tests/{testId}
/question_banks/{questionId}
/question_bank_keys/{questionId}   <-- RESTRICTED: Backend Admin SDK only
/attempts/{attemptId}
/attempts/{attemptId}/responses/{questionId}
/results/{attemptId}
/institutes/{instituteId}
/system_settings/global
/audit_logs/{logId}
```

---

## 2. Document Schemas

### 2.1 `users/{userId}`
```typescript
interface UserProfile {
  uid: string;
  email: string | null;
  phoneNumber: string | null;
  displayName: string;
  photoUrl: string | null;
  role: 'superadmin' | 'content_admin' | 'editor' | 'reviewer' | 'student';
  instituteId: string | null;
  targetExamId: string | null;
  preferences: {
    theme: 'system' | 'light' | 'dark';
    language: string;
    notificationsEnabled: boolean;
  };
  subscription: {
    planId: 'free' | 'premium_monthly' | 'premium_annual';
    validUntil: string | null; // ISO UTC
    isActive: boolean;
  };
  createdAt: string; // ISO UTC
  updatedAt: string; // ISO UTC
}
```

### 2.2 `categories/{categoryId}` & `exams/{examId}`
```typescript
interface ExamCategory {
  id: string;
  title: string;          // e.g. "Engineering Entrance"
  slug: string;           // "engineering"
  iconUrl: string | null;
  displayOrder: number;
  isPublished: boolean;
  createdAt: string;
}

interface Exam {
  id: string;
  categoryId: string;
  title: string;          // e.g. "JEE Main"
  code: string;           // "JEE_MAIN"
  slug: string;           // "jee-main"
  shortDescription: string;
  bannerUrl: string | null;
  isPublished: boolean;
  displayOrder: number;
  officialYear: number;
  totalQuestionsDefault: number;
  durationMinutesDefault: number;
  createdAt: string;
  updatedAt: string;
}
```

### 2.3 `tests/{testId}`
```typescript
interface TestDefinition {
  id: string;
  examId: string;
  seriesId: string | null;
  title: string;              // e.g. "JEE Main Full Mock 01"
  type: 'FULL_MOCK' | 'CHAPTER_PRACTICE' | 'PYQ' | 'CUSTOM_QUIZ';
  durationMinutes: number;
  totalMarks: number;
  isPublished: boolean;
  publishedVersion: number;
  sections: Array<{
    id: string;
    title: string;          // e.g. "Physics - Section A"
    subjectId: string;
    totalQuestions: number;
    mandatoryQuestions: number;
    positiveMarks: number;  // e.g. 4.0
    negativeMarks: number;  // e.g. 1.0
    questionIds: string[];  // references to question_banks
  }>;
  createdAt: string;
  updatedAt: string;
}
```

### 2.4 `question_banks/{questionId}` (Public Student-Safe)
```typescript
interface QuestionStudentSafe {
  id: string;
  chapterId: string;
  subjectId: string;
  type: 'SINGLE_CHOICE' | 'MULTI_CHOICE' | 'NUMERICAL' | 'ASSERTION_REASON';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  stemRichText: string;
  stemLatex: string | null;
  mediaUrls: string[];
  options: Array<{
    id: string;            // 'opt_a', 'opt_b', etc.
    text: string;
    latex: string | null;
    imageUrl: string | null;
  }>;
  status: 'PUBLISHED';
  version: number;
}
```

### 2.5 `question_bank_keys/{questionId}` (Protected Enclave)
```typescript
interface QuestionKeyEnclave {
  questionId: string;
  correctOptionIds: string[];  // e.g. ['opt_b']
  numericalTolerance: {
    min: number;
    max: number;
  } | null;
  explanationRichText: string;
  explanationLatex: string | null;
  verifiedByReviewerId: string;
  verifiedAt: string;
}
```

### 2.6 `attempts/{attemptId}`
```typescript
interface ExamAttempt {
  id: string;
  userId: string;
  testId: string;
  examId: string;
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'GRADED' | 'EXPIRED';
  frozenTestVersion: number;
  serverStartedAt: string;   // ISO UTC
  serverExpiresAt: string;   // ISO UTC
  submittedAt: string | null;// ISO UTC
  totalDurationSeconds: number;
  questionOrderSnapshot: Record<string, string[]>; // sectionId -> questionIds
}

interface AttemptResponse {
  questionId: string;
  selectedOptionIds: string[];
  numericalValue: number | null;
  isMarkedForReview: boolean;
  timeSpentSeconds: number;
  persistedAt: string; // ISO UTC
}
```

### 2.7 `results/{attemptId}`
```typescript
interface ExamResult {
  attemptId: string;
  userId: string;
  testId: string;
  examId: string;
  scoreTotal: number;
  maxScore: number;
  accuracyPercentage: number;
  totalAttempted: number;
  totalCorrect: number;
  totalIncorrect: number;
  totalUnanswered: number;
  sectionBreakdown: Array<{
    sectionId: string;
    sectionTitle: string;
    score: number;
    maxScore: number;
    correctCount: number;
    incorrectCount: number;
    unansweredCount: number;
  }>;
  gradedAt: string; // ISO UTC
}
```
