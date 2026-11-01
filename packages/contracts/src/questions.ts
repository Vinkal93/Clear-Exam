import { z } from 'zod';

export const QuestionTypeEnum = z.enum([
  'SINGLE_CHOICE',
  'MULTI_CHOICE',
  'TRUE_FALSE',
  'ASSERTION_REASON',
  'NUMERICAL',
  'PASSAGE_GROUP'
]);

export type QuestionType = z.infer<typeof QuestionTypeEnum>;

export const QuestionDifficultyEnum = z.enum(['EASY', 'MEDIUM', 'HARD']);
export type QuestionDifficulty = z.infer<typeof QuestionDifficultyEnum>;

export const QuestionStatusEnum = z.enum([
  'DRAFT',
  'IN_REVIEW',
  'APPROVED',
  'PUBLISHED',
  'REJECTED',
  'ARCHIVED'
]);

export type QuestionStatus = z.infer<typeof QuestionStatusEnum>;

export const QuestionOptionSchema = z.object({
  id: z.string(),
  text: z.string().min(1),
  textHindi: z.string().optional(),
  latex: z.string().nullable().optional(),
  imageUrl: z.string().url().nullable().optional()
});

export type QuestionOption = z.infer<typeof QuestionOptionSchema>;

/**
 * Public, safe question definition for active tests.
 * NEVER CONTAINS correct option IDs or explanations.
 */
export const StudentQuestionSchema = z.object({
  id: z.string(),
  examId: z.string(),
  subjectId: z.string(),
  chapterId: z.string().optional(),
  type: QuestionTypeEnum,
  difficulty: QuestionDifficultyEnum,
  stemRichText: z.string().min(1),
  stemHindi: z.string().optional(),
  stemLatex: z.string().nullable().optional(),
  mediaUrls: z.array(z.string().url()).default([]),
  options: z.array(QuestionOptionSchema),
  tags: z.array(z.string()).default([]),
  version: z.number().int().default(1)
});

export type StudentQuestion = z.infer<typeof StudentQuestionSchema>;

/**
 * Restricted Question Key and Solution Enclave.
 * Stored in /question_bank_keys/{id}. Accessible exclusively by Cloud API during review/grading.
 */
export const QuestionKeyEnclaveSchema = z.object({
  questionId: z.string(),
  correctOptionIds: z.array(z.string()).min(1),
  numericalTolerance: z.object({
    value: z.number(),
    min: z.number(),
    max: z.number()
  }).nullable().optional(),
  explanationRichText: z.string(),
  explanationHindi: z.string().optional(),
  explanationLatex: z.string().nullable().optional(),
  solutionMediaUrls: z.array(z.string().url()).default([]),
  verifiedByReviewerId: z.string().nullable().optional(),
  verifiedAt: z.string().datetime().nullable().optional()
});

export type QuestionKeyEnclave = z.infer<typeof QuestionKeyEnclaveSchema>;

/**
 * Full Question Admin Document stored in /question_banks/{id}
 */
export const AdminQuestionItemSchema = StudentQuestionSchema.extend({
  status: QuestionStatusEnum.default('DRAFT'),
  authorUid: z.string(),
  reviewerUid: z.string().nullable().optional(),
  reviewNotes: z.string().nullable().optional(),
  approvedAt: z.string().datetime().nullable().optional(),
  publishedAt: z.string().datetime().nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export type AdminQuestionItem = z.infer<typeof AdminQuestionItemSchema>;

// Authoring Input Schemas
export const CreateQuestionInputSchema = z.object({
  examId: z.string().min(1),
  subjectId: z.string().min(1),
  chapterId: z.string().optional(),
  type: QuestionTypeEnum.default('SINGLE_CHOICE'),
  difficulty: QuestionDifficultyEnum.default('MEDIUM'),
  stemRichText: z.string().min(3),
  stemHindi: z.string().optional(),
  stemLatex: z.string().nullable().optional(),
  mediaUrls: z.array(z.string().url()).default([]),
  options: z.array(QuestionOptionSchema).default([]),
  correctOptionIds: z.array(z.string()).default([]),
  numericalTolerance: z.object({
    value: z.number(),
    min: z.number(),
    max: z.number()
  }).nullable().optional(),
  explanationRichText: z.string().default(''),
  explanationHindi: z.string().optional(),
  explanationLatex: z.string().nullable().optional(),
  tags: z.array(z.string()).default([])
});

export type CreateQuestionInput = z.infer<typeof CreateQuestionInputSchema>;

export const UpdateQuestionInputSchema = CreateQuestionInputSchema.partial();
export type UpdateQuestionInput = z.infer<typeof UpdateQuestionInputSchema>;

export const ReviewQuestionActionSchema = z.object({
  action: z.enum(['SUBMIT_FOR_REVIEW', 'APPROVE', 'REJECT', 'PUBLISH', 'ARCHIVE']),
  reviewNotes: z.string().max(1000).optional()
});

export type ReviewQuestionAction = z.infer<typeof ReviewQuestionActionSchema>;

// Bulk Import Schemas
export const BulkImportRowSchema = z.object({
  stemRichText: z.string().min(3),
  stemHindi: z.string().optional(),
  type: QuestionTypeEnum.default('SINGLE_CHOICE'),
  difficulty: QuestionDifficultyEnum.default('MEDIUM'),
  optionA: z.string().min(1),
  optionB: z.string().min(1),
  optionC: z.string().optional(),
  optionD: z.string().optional(),
  correctOption: z.string().min(1), // e.g. "A" or "A,B" or "opt_a"
  explanation: z.string().optional(),
  tags: z.string().optional() // Comma-separated
});

export type BulkImportRow = z.infer<typeof BulkImportRowSchema>;

export const BulkImportPreviewResponseSchema = z.object({
  totalRows: z.number().int().nonnegative(),
  validCount: z.number().int().nonnegative(),
  invalidCount: z.number().int().nonnegative(),
  validRows: z.array(z.object({
    rowIndex: z.number(),
    data: CreateQuestionInputSchema
  })),
  errors: z.array(z.object({
    rowIndex: z.number(),
    field: z.string().optional(),
    message: z.string()
  }))
});

export type BulkImportPreviewResponse = z.infer<typeof BulkImportPreviewResponseSchema>;

export const BulkImportCommitResponseSchema = z.object({
  totalProcessed: z.number().int().nonnegative(),
  importedCount: z.number().int().nonnegative(),
  importedQuestionIds: z.array(z.string())
});

export type BulkImportCommitResponse = z.infer<typeof BulkImportCommitResponseSchema>;
