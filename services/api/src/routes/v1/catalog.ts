import { Router, Request, Response, NextFunction } from 'express';
import { getFirestore } from '../../lib/firebase';
import { AppError } from '../../middleware/errorHandler';
import { ExamCategory, Exam, Subject, Chapter } from '@clearexam/contracts';

export const publicCatalogRouter = Router();

/**
 * GET /v1/catalog/categories
 * Returns published exam categories for public/student exploration.
 */
publicCatalogRouter.get('/categories', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const db = getFirestore();
    const snapshot = await db.collection('categories')
      .where('isPublished', '==', true)
      .get();

    const categories: ExamCategory[] = snapshot.docs
      .map((doc) => doc.data() as ExamCategory)
      .sort((a, b) => a.displayOrder - b.displayOrder);

    res.status(200).json({
      data: categories,
      meta: {
        total: categories.length,
        requestId: req.id
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /v1/catalog/exams
 * Returns published exams. Supports filter by categoryId and search.
 */
publicCatalogRouter.get('/exams', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryId, featured, search } = req.query;
    const db = getFirestore();

    let query: FirebaseFirestore.Query = db.collection('exams')
      .where('isPublished', '==', true);

    if (categoryId && typeof categoryId === 'string') {
      query = query.where('categoryId', '==', categoryId);
    }

    if (featured === 'true') {
      query = query.where('isFeatured', '==', true);
    }

    const snapshot = await query.get();
    let exams: Exam[] = snapshot.docs
      .map((doc) => doc.data() as Exam)
      .sort((a, b) => a.displayOrder - b.displayOrder);

    if (search && typeof search === 'string') {
      const term = search.toLowerCase();
      exams = exams.filter(
        (e) =>
          e.title.toLowerCase().includes(term) ||
          e.code.toLowerCase().includes(term) ||
          (e.titleHindi && e.titleHindi.includes(term))
      );
    }

    res.status(200).json({
      data: exams,
      meta: {
        total: exams.length,
        requestId: req.id
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /v1/catalog/exams/:id
 * Returns single published exam details.
 */
publicCatalogRouter.get('/exams/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const db = getFirestore();
    const docSnap = await db.collection('exams').doc(id).get();

    if (!docSnap.exists) {
      throw new AppError('RESOURCE_NOT_FOUND', 'Exam not found', 404);
    }

    const exam = docSnap.data() as Exam;
    if (!exam.isPublished) {
      throw new AppError('RESOURCE_NOT_FOUND', 'Exam not found or unpublished', 404);
    }

    res.status(200).json({
      data: exam,
      meta: { requestId: req.id }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /v1/catalog/exams/:id/subjects
 * Returns published subjects and chapters for an exam.
 */
publicCatalogRouter.get('/exams/:id/subjects', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const db = getFirestore();

    // Verify exam is published
    const examSnap = await db.collection('exams').doc(id).get();
    if (!examSnap.exists || !(examSnap.data() as Exam).isPublished) {
      throw new AppError('RESOURCE_NOT_FOUND', 'Exam not found or unpublished', 404);
    }

    const subjectsSnap = await db.collection('subjects')
      .where('examId', '==', id)
      .where('isPublished', '==', true)
      .get();

    const subjects: Subject[] = subjectsSnap.docs
      .map((doc) => doc.data() as Subject)
      .sort((a, b) => a.displayOrder - b.displayOrder);

    const chaptersSnap = await db.collection('chapters')
      .where('examId', '==', id)
      .where('isPublished', '==', true)
      .get();

    const chapters: Chapter[] = chaptersSnap.docs
      .map((doc) => doc.data() as Chapter)
      .sort((a, b) => a.displayOrder - b.displayOrder);

    // Group chapters under their respective subjects
    const structure = subjects.map((sub) => ({
      ...sub,
      chapters: chapters.filter((ch) => ch.subjectId === sub.id)
    }));

    res.status(200).json({
      data: structure,
      meta: {
        totalSubjects: subjects.length,
        totalChapters: chapters.length,
        requestId: req.id
      }
    });
  } catch (error) {
    next(error);
  }
});
