import { z } from 'zod';

export const BilingualTextSchema = z.object({
  en: z.string().min(1),
  hi: z.string().optional()
});

export type BilingualText = z.infer<typeof BilingualTextSchema>;

export const ExamCategorySchema = z.object({
  id: z.string(),
  title: z.string().min(2),
  titleHindi: z.string().optional(),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().optional(),
  iconUrl: z.string().url().nullable().optional(),
  displayOrder: z.number().int().default(0),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export type ExamCategory = z.infer<typeof ExamCategorySchema>;

export const ExamSchema = z.object({
  id: z.string(),
  categoryId: z.string(),
  title: z.string().min(2),
  titleHindi: z.string().optional(),
  code: z.string().min(2).toUpperCase(),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  shortDescription: z.string(),
  longDescription: z.string().optional(),
  bannerUrl: z.string().url().nullable().optional(),
  conductingBody: z.string().optional(),       // e.g. "NTA", "UPSC", "IBPS", "SSC"
  officialWebsiteUrl: z.string().url().nullable().optional(),
  eligibilitySummary: z.string().optional(),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  displayOrder: z.number().int().default(0),
  officialYear: z.number().int().default(new Date().getFullYear()),
  totalQuestionsDefault: z.number().int().positive().default(100),
  durationMinutesDefault: z.number().int().positive().default(120),
  totalSubjects: z.number().int().default(0),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export type Exam = z.infer<typeof ExamSchema>;

export const SubjectSchema = z.object({
  id: z.string(),
  examId: z.string(),
  title: z.string().min(2),
  titleHindi: z.string().optional(),
  code: z.string(),
  displayOrder: z.number().int().default(0),
  isPublished: z.boolean().default(true),
  totalChapters: z.number().int().default(0),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export type Subject = z.infer<typeof SubjectSchema>;

export const ChapterSchema = z.object({
  id: z.string(),
  subjectId: z.string(),
  examId: z.string(),
  title: z.string().min(2),
  titleHindi: z.string().optional(),
  displayOrder: z.number().int().default(0),
  isPublished: z.boolean().default(true),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export type Chapter = z.infer<typeof ChapterSchema>;

export const SyllabusVersionSchema = z.object({
  id: z.string(),
  examId: z.string(),
  versionTag: z.string(), // e.g. "2026-v1"
  validFromYear: z.number().int(),
  validToYear: z.number().int().nullable().optional(),
  notes: z.string().optional(),
  isCurrent: z.boolean().default(true),
  createdAt: z.string().datetime()
});

export type SyllabusVersion = z.infer<typeof SyllabusVersionSchema>;

// Input Schemas for Admin Operations
export const CreateCategoryInputSchema = z.object({
  title: z.string().min(2).max(100),
  titleHindi: z.string().max(100).optional(),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional(),
  iconUrl: z.string().url().nullable().optional(),
  displayOrder: z.number().int().default(0),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false)
});

export type CreateCategoryInput = z.infer<typeof CreateCategoryInputSchema>;

export const UpdateCategoryInputSchema = CreateCategoryInputSchema.partial();
export type UpdateCategoryInput = z.infer<typeof UpdateCategoryInputSchema>;

export const CreateExamInputSchema = z.object({
  categoryId: z.string().min(1),
  title: z.string().min(2).max(150),
  titleHindi: z.string().max(150).optional(),
  code: z.string().min(2).max(30).toUpperCase(),
  slug: z.string().min(2).max(150).regex(/^[a-z0-9-]+$/),
  shortDescription: z.string().min(5).max(300),
  longDescription: z.string().max(5000).optional(),
  bannerUrl: z.string().url().nullable().optional(),
  conductingBody: z.string().max(100).optional(),
  officialWebsiteUrl: z.string().url().nullable().optional(),
  eligibilitySummary: z.string().max(1000).optional(),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  displayOrder: z.number().int().default(0),
  officialYear: z.number().int().default(new Date().getFullYear()),
  totalQuestionsDefault: z.number().int().positive().default(100),
  durationMinutesDefault: z.number().int().positive().default(120)
});

export type CreateExamInput = z.infer<typeof CreateExamInputSchema>;

export const UpdateExamInputSchema = CreateExamInputSchema.partial();
export type UpdateExamInput = z.infer<typeof UpdateExamInputSchema>;

export const CreateSubjectInputSchema = z.object({
  examId: z.string().min(1),
  title: z.string().min(2).max(100),
  titleHindi: z.string().max(100).optional(),
  code: z.string().min(1).max(30),
  displayOrder: z.number().int().default(0),
  isPublished: z.boolean().default(true)
});

export type CreateSubjectInput = z.infer<typeof CreateSubjectInputSchema>;

export const CreateChapterInputSchema = z.object({
  subjectId: z.string().min(1),
  examId: z.string().min(1),
  title: z.string().min(2).max(100),
  titleHindi: z.string().max(100).optional(),
  displayOrder: z.number().int().default(0),
  isPublished: z.boolean().default(true)
});

export type CreateChapterInput = z.infer<typeof CreateChapterInputSchema>;

export const PublishToggleSchema = z.object({
  isPublished: z.boolean()
});

export type PublishToggle = z.infer<typeof PublishToggleSchema>;

export const DashboardStatsSchema = z.object({
  registeredUsers: z.number().int().nonnegative(),
  totalCategories: z.number().int().nonnegative(),
  publishedExams: z.number().int().nonnegative(),
  totalExams: z.number().int().nonnegative(),
  approvedQuestions: z.number().int().nonnegative(),
  completedAttempts: z.number().int().nonnegative()
});

export type DashboardStats = z.infer<typeof DashboardStatsSchema>;
