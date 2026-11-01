import { z } from 'zod';

export const ExamCategorySchema = z.object({
  id: z.string(),
  title: z.string().min(2),
  slug: z.string().min(2),
  iconUrl: z.string().url().nullable().optional(),
  displayOrder: z.number().int().default(0),
  isPublished: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional()
});

export type ExamCategory = z.infer<typeof ExamCategorySchema>;

export const ExamSchema = z.object({
  id: z.string(),
  categoryId: z.string(),
  title: z.string().min(2),
  code: z.string().min(2),
  slug: z.string().min(2),
  shortDescription: z.string(),
  bannerUrl: z.string().url().nullable().optional(),
  isPublished: z.boolean().default(false),
  displayOrder: z.number().int().default(0),
  officialYear: z.number().int(),
  totalQuestionsDefault: z.number().int().positive(),
  durationMinutesDefault: z.number().int().positive(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export type Exam = z.infer<typeof ExamSchema>;

export const SubjectSchema = z.object({
  id: z.string(),
  examId: z.string(),
  title: z.string().min(2),
  code: z.string(),
  displayOrder: z.number().int().default(0),
  createdAt: z.string().datetime()
});

export type Subject = z.infer<typeof SubjectSchema>;

export const ChapterSchema = z.object({
  id: z.string(),
  subjectId: z.string(),
  title: z.string().min(2),
  displayOrder: z.number().int().default(0),
  createdAt: z.string().datetime()
});

export type Chapter = z.infer<typeof ChapterSchema>;

export const TestSectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  subjectId: z.string(),
  totalQuestions: z.number().int().positive(),
  mandatoryQuestions: z.number().int().positive(),
  positiveMarks: z.number().positive(),
  negativeMarks: z.number().nonnegative(),
  questionIds: z.array(z.string())
});

export type TestSection = z.infer<typeof TestSectionSchema>;

export const TestTypeEnum = z.enum([
  'FULL_MOCK',
  'CHAPTER_PRACTICE',
  'PYQ',
  'CUSTOM_QUIZ'
]);

export type TestType = z.infer<typeof TestTypeEnum>;

export const TestDefinitionSchema = z.object({
  id: z.string(),
  examId: z.string(),
  seriesId: z.string().nullable().optional(),
  title: z.string().min(3),
  type: TestTypeEnum,
  durationMinutes: z.number().int().positive(),
  totalMarks: z.number().positive(),
  isPublished: z.boolean().default(false),
  publishedVersion: z.number().int().default(1),
  sections: z.array(TestSectionSchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export type TestDefinition = z.infer<typeof TestDefinitionSchema>;
