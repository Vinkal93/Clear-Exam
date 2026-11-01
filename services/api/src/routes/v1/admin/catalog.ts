import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../../../middleware/auth';
import { requireRole } from '../../../middleware/rbac';
import { getFirestore } from '../../../lib/firebase';
import { AppError } from '../../../middleware/errorHandler';
import {
  CreateCategoryInputSchema,
  UpdateCategoryInputSchema,
  CreateExamInputSchema,
  UpdateExamInputSchema,
  CreateSubjectInputSchema,
  CreateChapterInputSchema,
  PublishToggleSchema,
  ExamCategory,
  Exam,
  Subject,
  Chapter,
  DashboardStats
} from '@clearexam/contracts';
import { logAuditEvent } from '../../../lib/audit';
import { v4 as uuidv4 } from 'uuid';

export const adminCatalogRouter = Router();

// Base protection: All admin catalog routes require authentication
adminCatalogRouter.use(authMiddleware);

/**
 * GET /v1/admin/catalog/stats
 * Real aggregated dashboard metrics. Zero synthetic metrics.
 */
adminCatalogRouter.get('/stats', requireRole('EDITOR', 'REVIEWER', 'CONTENT_ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const db = getFirestore();

    // Use Firestore count aggregation queries for fast, scalable, real numbers
    const [usersCountSnap, categoriesCountSnap, publishedExamsSnap, totalExamsSnap, questionsSnap, attemptsSnap] = await Promise.all([
      db.collection('users').count().get(),
      db.collection('categories').count().get(),
      db.collection('exams').where('isPublished', '==', true).count().get(),
      db.collection('exams').count().get(),
      db.collection('question_banks').count().get(),
      db.collection('attempts').where('status', 'in', ['SUBMITTED', 'GRADED']).count().get()
    ]);

    const stats: DashboardStats = {
      registeredUsers: usersCountSnap.data().count,
      totalCategories: categoriesCountSnap.data().count,
      publishedExams: publishedExamsSnap.data().count,
      totalExams: totalExamsSnap.data().count,
      approvedQuestions: questionsSnap.data().count,
      completedAttempts: attemptsSnap.data().count
    };

    res.status(200).json({
      data: stats,
      meta: { requestId: req.id }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /v1/admin/catalog/categories
 * Lists all categories (published and drafts).
 */
adminCatalogRouter.get('/categories', requireRole('EDITOR', 'REVIEWER', 'CONTENT_ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const db = getFirestore();
    const snapshot = await db.collection('categories').get();
    const categories: ExamCategory[] = snapshot.docs
      .map((doc) => doc.data() as ExamCategory)
      .sort((a, b) => a.displayOrder - b.displayOrder);

    res.status(200).json({
      data: categories,
      meta: { total: categories.length, requestId: req.id }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /v1/admin/catalog/categories
 * Creates a new exam category.
 */
adminCatalogRouter.post('/categories', requireRole('CONTENT_ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseResult = CreateCategoryInputSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw parseResult.error;
    }

    const data = parseResult.data;
    const db = getFirestore();

    // Verify slug uniqueness
    const existing = await db.collection('categories').where('slug', '==', data.slug).get();
    if (!existing.empty) {
      throw new AppError('CONFLICT', `Category slug '${data.slug}' already exists`, 409);
    }

    const categoryId = `cat_${uuidv4().replace(/-/g, '').slice(0, 12)}`;
    const now = new Date().toISOString();

    const category: ExamCategory = {
      id: categoryId,
      title: data.title,
      titleHindi: data.titleHindi,
      slug: data.slug,
      description: data.description,
      iconUrl: data.iconUrl,
      displayOrder: data.displayOrder,
      isPublished: data.isPublished,
      isFeatured: data.isFeatured,
      createdAt: now,
      updatedAt: now
    };

    await db.collection('categories').doc(categoryId).set(category);

    await logAuditEvent({
      actorUid: req.user!.uid,
      actorRole: req.user!.role,
      action: 'CATEGORY_CREATED',
      targetUid: categoryId,
      details: { title: category.title, slug: category.slug },
      requestId: req.id
    });

    res.status(201).json({
      data: category,
      meta: { requestId: req.id }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /v1/admin/catalog/categories/:id
 * Updates an existing category.
 */
adminCatalogRouter.put('/categories/:id', requireRole('CONTENT_ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const parseResult = UpdateCategoryInputSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw parseResult.error;
    }

    const db = getFirestore();
    const docRef = db.collection('categories').doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      throw new AppError('RESOURCE_NOT_FOUND', 'Category not found', 404);
    }

    const updates = {
      ...parseResult.data,
      updatedAt: new Date().toISOString()
    };

    await docRef.update(updates);
    const updatedSnap = await docRef.get();

    res.status(200).json({
      data: updatedSnap.data(),
      meta: { requestId: req.id }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /v1/admin/catalog/categories/:id/publish
 * Toggles category publication status.
 */
adminCatalogRouter.patch('/categories/:id/publish', requireRole('CONTENT_ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const parseResult = PublishToggleSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw parseResult.error;
    }

    const { isPublished } = parseResult.data;
    const db = getFirestore();
    const docRef = db.collection('categories').doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      throw new AppError('RESOURCE_NOT_FOUND', 'Category not found', 404);
    }

    await docRef.update({
      isPublished,
      updatedAt: new Date().toISOString()
    });

    await logAuditEvent({
      actorUid: req.user!.uid,
      actorRole: req.user!.role,
      action: isPublished ? 'CATEGORY_PUBLISHED' : 'CATEGORY_UNPUBLISHED',
      targetUid: id,
      details: { isPublished },
      requestId: req.id
    });

    res.status(200).json({
      data: { id, isPublished },
      meta: { requestId: req.id }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /v1/admin/catalog/exams
 * Lists all exams with optional category filter.
 */
adminCatalogRouter.get('/exams', requireRole('EDITOR', 'REVIEWER', 'CONTENT_ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryId } = req.query;
    const db = getFirestore();

    let query: FirebaseFirestore.Query = db.collection('exams');
    if (categoryId && typeof categoryId === 'string') {
      query = query.where('categoryId', '==', categoryId);
    }

    const snapshot = await query.get();
    const exams: Exam[] = snapshot.docs
      .map((doc) => doc.data() as Exam)
      .sort((a, b) => a.displayOrder - b.displayOrder);

    res.status(200).json({
      data: exams,
      meta: { total: exams.length, requestId: req.id }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /v1/admin/catalog/exams
 * Creates a new exam.
 */
adminCatalogRouter.post('/exams', requireRole('CONTENT_ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseResult = CreateExamInputSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw parseResult.error;
    }

    const data = parseResult.data;
    const db = getFirestore();

    // Verify category exists
    const categorySnap = await db.collection('categories').doc(data.categoryId).get();
    if (!categorySnap.exists) {
      throw new AppError('VALIDATION_ERROR', 'Associated Category does not exist', 400);
    }

    // Verify slug uniqueness
    const existing = await db.collection('exams').where('slug', '==', data.slug).get();
    if (!existing.empty) {
      throw new AppError('CONFLICT', `Exam slug '${data.slug}' already exists`, 409);
    }

    const examId = `exam_${uuidv4().replace(/-/g, '').slice(0, 12)}`;
    const now = new Date().toISOString();

    const exam: Exam = {
      id: examId,
      categoryId: data.categoryId,
      title: data.title,
      titleHindi: data.titleHindi,
      code: data.code,
      slug: data.slug,
      shortDescription: data.shortDescription,
      longDescription: data.longDescription,
      bannerUrl: data.bannerUrl,
      conductingBody: data.conductingBody,
      officialWebsiteUrl: data.officialWebsiteUrl,
      eligibilitySummary: data.eligibilitySummary,
      isPublished: data.isPublished,
      isFeatured: data.isFeatured,
      displayOrder: data.displayOrder,
      officialYear: data.officialYear,
      totalQuestionsDefault: data.totalQuestionsDefault,
      durationMinutesDefault: data.durationMinutesDefault,
      totalSubjects: 0,
      createdAt: now,
      updatedAt: now
    };

    await db.collection('exams').doc(examId).set(exam);

    await logAuditEvent({
      actorUid: req.user!.uid,
      actorRole: req.user!.role,
      action: 'EXAM_CREATED',
      targetUid: examId,
      details: { title: exam.title, code: exam.code },
      requestId: req.id
    });

    res.status(201).json({
      data: exam,
      meta: { requestId: req.id }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /v1/admin/catalog/exams/:id
 * Updates exam metadata.
 */
adminCatalogRouter.put('/exams/:id', requireRole('CONTENT_ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const parseResult = UpdateExamInputSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw parseResult.error;
    }

    const db = getFirestore();
    const docRef = db.collection('exams').doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      throw new AppError('RESOURCE_NOT_FOUND', 'Exam not found', 404);
    }

    const updates = {
      ...parseResult.data,
      updatedAt: new Date().toISOString()
    };

    await docRef.update(updates);
    const updatedSnap = await docRef.get();

    res.status(200).json({
      data: updatedSnap.data(),
      meta: { requestId: req.id }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /v1/admin/catalog/exams/:id/publish
 * Toggles exam publication.
 */
adminCatalogRouter.patch('/exams/:id/publish', requireRole('CONTENT_ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const parseResult = PublishToggleSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw parseResult.error;
    }

    const { isPublished } = parseResult.data;
    const db = getFirestore();
    const docRef = db.collection('exams').doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      throw new AppError('RESOURCE_NOT_FOUND', 'Exam not found', 404);
    }

    await docRef.update({
      isPublished,
      updatedAt: new Date().toISOString()
    });

    await logAuditEvent({
      actorUid: req.user!.uid,
      actorRole: req.user!.role,
      action: isPublished ? 'EXAM_PUBLISHED' : 'EXAM_UNPUBLISHED',
      targetUid: id,
      details: { isPublished },
      requestId: req.id
    });

    res.status(200).json({
      data: { id, isPublished },
      meta: { requestId: req.id }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /v1/admin/catalog/subjects
 * Adds a subject/paper to an exam.
 */
adminCatalogRouter.post('/subjects', requireRole('CONTENT_ADMIN', 'SUPER_ADMIN', 'EDITOR'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseResult = CreateSubjectInputSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw parseResult.error;
    }

    const data = parseResult.data;
    const db = getFirestore();
    const examDoc = await db.collection('exams').doc(data.examId).get();
    if (!examDoc.exists) {
      throw new AppError('VALIDATION_ERROR', 'Exam not found', 400);
    }

    const subjectId = `sub_${uuidv4().replace(/-/g, '').slice(0, 12)}`;
    const now = new Date().toISOString();

    const subject: Subject = {
      id: subjectId,
      examId: data.examId,
      title: data.title,
      titleHindi: data.titleHindi,
      code: data.code,
      displayOrder: data.displayOrder,
      isPublished: data.isPublished,
      totalChapters: 0,
      createdAt: now,
      updatedAt: now
    };

    await db.collection('subjects').doc(subjectId).set(subject);

    res.status(201).json({
      data: subject,
      meta: { requestId: req.id }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /v1/admin/catalog/chapters
 * Adds a chapter/topic to a subject.
 */
adminCatalogRouter.post('/chapters', requireRole('CONTENT_ADMIN', 'SUPER_ADMIN', 'EDITOR'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseResult = CreateChapterInputSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw parseResult.error;
    }

    const data = parseResult.data;
    const db = getFirestore();

    const chapterId = `ch_${uuidv4().replace(/-/g, '').slice(0, 12)}`;
    const now = new Date().toISOString();

    const chapter: Chapter = {
      id: chapterId,
      subjectId: data.subjectId,
      examId: data.examId,
      title: data.title,
      titleHindi: data.titleHindi,
      displayOrder: data.displayOrder,
      isPublished: data.isPublished,
      createdAt: now,
      updatedAt: now
    };

    await db.collection('chapters').doc(chapterId).set(chapter);

    res.status(201).json({
      data: chapter,
      meta: { requestId: req.id }
    });
  } catch (error) {
    next(error);
  }
});
