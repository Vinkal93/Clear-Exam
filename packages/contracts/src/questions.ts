import { z } from 'zod';

export const QuestionTypeEnum = z.enum([
  'SINGLE_CHOICE',
  'MULTI_CHOICE',
  'NUMERICAL',
  'ASSERTION_REASON'
]);

export type QuestionType = z.infer<typeof QuestionTypeEnum>;

export const QuestionDifficultyEnum = z.enum(['EASY', 'MEDIUM', 'HARD']);
export type QuestionDifficulty = z.infer<typeof QuestionDifficultyEnum>;

export const QuestionOptionSchema = z.object({
  id: z.string(),
  text: z.string(),
  latex: z.string().nullable().optional(),
  imageUrl: z.string().url().nullable().optional()
});

export type QuestionOption = z.infer<typeof QuestionOptionSchema>;

/**
 * Public, safe question definition for active tests.
 * DOES NOT CONTAIN correct answer keys or explanations.
 */
export const StudentQuestionSchema = z.object({
  id: z.string(),
  subjectId: z.string(),
  chapterId: z.string().optional(),
  type: QuestionTypeEnum,
  difficulty: QuestionDifficultyEnum,
  stemRichText: z.string(),
  stemLatex: z.string().nullable().optional(),
  mediaUrls: z.array(z.string().url()).default([]),
  options: z.array(QuestionOptionSchema),
  version: z.number().int().default(1)
});

export type StudentQuestion = z.infer<typeof StudentQuestionSchema>;

/**
 * Restricted Question Key and Solution Enclave.
 * Never exposed during active test attempts.
 */
export const QuestionKeyEnclaveSchema = z.object({
  questionId: z.string(),
  correctOptionIds: z.array(z.string()),
  numericalRange: z.object({
    min: z.number(),
    max: z.number()
  }).nullable().optional(),
  explanationRichText: z.string(),
  explanationLatex: z.string().nullable().optional(),
  solutionMediaUrls: z.array(z.string().url()).default([]),
  verifiedByReviewerId: z.string().nullable().optional(),
  verifiedAt: z.string().datetime().nullable().optional()
});

export type QuestionKeyEnclave = z.infer<typeof QuestionKeyEnclaveSchema>;
