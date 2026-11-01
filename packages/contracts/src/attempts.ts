import { z } from 'zod';

export const AttemptStatusEnum = z.enum([
  'IN_PROGRESS',
  'SUBMITTED',
  'GRADED',
  'EXPIRED'
]);

export type AttemptStatus = z.infer<typeof AttemptStatusEnum>;

export const StartAttemptRequestSchema = z.object({
  testId: z.string().min(1)
});

export type StartAttemptRequest = z.infer<typeof StartAttemptRequestSchema>;

export const StartAttemptResponseSchema = z.object({
  attemptId: z.string(),
  testId: z.string(),
  examId: z.string(),
  serverStartedAt: z.string().datetime(),
  serverExpiresAt: z.string().datetime(),
  durationSeconds: z.number().int().positive(),
  status: AttemptStatusEnum,
  sections: z.array(z.object({
    id: z.string(),
    title: z.string(),
    questionIds: z.array(z.string()),
    positiveMarks: z.number(),
    negativeMarks: z.number()
  }))
});

export type StartAttemptResponse = z.infer<typeof StartAttemptResponseSchema>;

export const SaveResponseRequestSchema = z.object({
  selectedOptionIds: z.array(z.string()).default([]),
  numericalValue: z.number().nullable().optional(),
  isMarkedForReview: z.boolean().default(false),
  timeSpentSeconds: z.number().int().nonnegative().default(0)
});

export type SaveResponseRequest = z.infer<typeof SaveResponseRequestSchema>;

export const SaveResponseResultSchema = z.object({
  questionId: z.string(),
  status: z.literal('SAVED'),
  persistedAt: z.string().datetime()
});

export type SaveResponseResult = z.infer<typeof SaveResponseResultSchema>;

export const SubmitAttemptResponseSchema = z.object({
  attemptId: z.string(),
  status: z.literal('GRADED'),
  submittedAt: z.string().datetime(),
  scoreTotal: z.number(),
  maxScore: z.number(),
  accuracyPercentage: z.number(),
  totalAttempted: z.number(),
  totalCorrect: z.number(),
  totalIncorrect: z.number(),
  totalUnanswered: z.number(),
  reviewAvailable: z.boolean()
});

export type SubmitAttemptResponse = z.infer<typeof SubmitAttemptResponseSchema>;
