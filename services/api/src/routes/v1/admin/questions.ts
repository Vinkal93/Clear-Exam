import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../../../middleware/auth';
import { requireRole } from '../../../middleware/rbac';
import { getFirestore } from '../../../lib/firebase';
import { AppError } from '../../../middleware/errorHandler';
import {
  CreateQuestionInputSchema,
  UpdateQuestionInputSchema,
  ReviewQuestionActionSchema,
  BulkImportRowSchema,
  AdminQuestionItem,
  QuestionKeyEnclave,
  QuestionType,
  QuestionDifficulty,
  QuestionStatus,
  BulkImportRow,
  CreateQuestionInput
} from '@clearexam/contracts';
import { logAuditEvent } from '../../../lib/audit';
import { v4 as uuidv4 } from 'uuid';

export const adminQuestionsRouter = Router();

// Base protection: All question routes require authentication
adminQuestionsRouter.use(authMiddleware);

/**
 * GET /v1/admin/questions
 * Filterable list of questions across exams and subjects.
 */
adminQuestionsRouter.get(
  '/',
  requireRole('EDITOR', 'REVIEWER', 'CONTENT_ADMIN', 'SUPER_ADMIN'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const db = getFirestore();
      const {
        examId,
        subjectId,
        chapterId,
        status,
        type,
        difficulty,
        search,
        page = '1',
        pageSize = '20'
      } = req.query;

      const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
      const limitNum = Math.min(100, Math.max(1, parseInt(pageSize as string, 10) || 20));

      let query: FirebaseFirestore.Query = db.collection('question_banks');

      if (examId && typeof examId === 'string') {
        query = query.where('examId', '==', examId);
      }
      if (subjectId && typeof subjectId === 'string') {
        query = query.where('subjectId', '==', subjectId);
      }
      if (chapterId && typeof chapterId === 'string') {
        query = query.where('chapterId', '==', chapterId);
      }
      if (status && typeof status === 'string') {
        query = query.where('status', '==', status);
      }
      if (type && typeof type === 'string') {
        query = query.where('type', '==', type);
      }
      if (difficulty && typeof difficulty === 'string') {
        query = query.where('difficulty', '==', difficulty);
      }

      const snapshot = await query.get();
      let questions: AdminQuestionItem[] = snapshot.docs.map(doc => doc.data() as AdminQuestionItem);

      // Search filter if provided
      if (search && typeof search === 'string') {
        const queryTerm = search.toLowerCase().trim();
        questions = questions.filter(q =>
          q.stemRichText.toLowerCase().includes(queryTerm) ||
          (q.stemHindi && q.stemHindi.toLowerCase().includes(queryTerm)) ||
          q.tags.some(tag => tag.toLowerCase().includes(queryTerm))
        );
      }

      // Sort by updatedAt descending
      questions.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

      const totalItems = questions.length;
      const startIndex = (pageNum - 1) * limitNum;
      const paginatedItems = questions.slice(startIndex, startIndex + limitNum);

      res.status(200).json({
        data: paginatedItems,
        meta: {
          requestId: req.id,
          total: totalItems,
          page: pageNum,
          pageSize: limitNum,
          totalPages: Math.ceil(totalItems / limitNum)
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /v1/admin/questions/import/template
 * Downloadable CSV template for bulk question imports.
 */
adminQuestionsRouter.get(
  '/import/template',
  requireRole('EDITOR', 'CONTENT_ADMIN', 'SUPER_ADMIN'),
  async (_req: Request, res: Response) => {
    const csvHeader = 'stemRichText,stemHindi,type,difficulty,optionA,optionB,optionC,optionD,correctOption,explanation,tags\n';
    const sampleRows = [
      '"What is the speed of light in vacuum?","निर्वात में प्रकाश की चाल क्या है?",SINGLE_CHOICE,EASY,"3 x 10^8 m/s","3 x 10^6 m/s","3 x 10^5 m/s","3 x 10^10 m/s",A,"Speed of light in vacuum is approximately 300,000 km/s.","physics,optics"',
      '"Which of the following are prime numbers?","निम्नलिखित में से कौन सी अभाज्य संख्याएँ हैं?",MULTI_CHOICE,MEDIUM,"2","4","7","9","A,C","2 and 7 have only two distinct positive divisors: 1 and themselves.","math,numbers"'
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="question_import_template.csv"');
    res.status(200).send(csvHeader + sampleRows);
  }
);

/**
 * GET /v1/admin/questions/:id
 * Fetch full question document along with its protected answer key enclave for administrators.
 */
adminQuestionsRouter.get(
  '/:id',
  requireRole('EDITOR', 'REVIEWER', 'CONTENT_ADMIN', 'SUPER_ADMIN'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const db = getFirestore();
      const { id } = req.params;

      const [questionDoc, enclaveDoc] = await Promise.all([
        db.collection('question_banks').doc(id).get(),
        db.collection('question_bank_keys').doc(id).get()
      ]);

      if (!questionDoc.exists) {
        throw new AppError('RESOURCE_NOT_FOUND', 'Question not found', 404);
      }

      const questionData = questionDoc.data() as AdminQuestionItem;
      const enclaveData = enclaveDoc.exists ? (enclaveDoc.data() as QuestionKeyEnclave) : null;

      res.status(200).json({
        data: {
          ...questionData,
          correctOptionIds: enclaveData?.correctOptionIds || [],
          numericalTolerance: enclaveData?.numericalTolerance || null,
          explanationRichText: enclaveData?.explanationRichText || '',
          explanationHindi: enclaveData?.explanationHindi || '',
          explanationLatex: enclaveData?.explanationLatex || null,
          solutionMediaUrls: enclaveData?.solutionMediaUrls || []
        },
        meta: { requestId: req.id }
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /v1/admin/questions
 * Create a new question draft with separated stem and answer key enclave.
 */
adminQuestionsRouter.post(
  '/',
  requireRole('EDITOR', 'CONTENT_ADMIN', 'SUPER_ADMIN'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parseResult = CreateQuestionInputSchema.safeParse(req.body);
      if (!parseResult.success) {
        throw new AppError('VALIDATION_ERROR', 'Validation failed', 400);
      }

      const data = parseResult.data;
      const db = getFirestore();
      const questionId = uuidv4();
      const now = new Date().toISOString();

      const questionDoc: AdminQuestionItem = {
        id: questionId,
        examId: data.examId,
        subjectId: data.subjectId,
        chapterId: data.chapterId,
        type: data.type,
        difficulty: data.difficulty,
        stemRichText: data.stemRichText,
        stemHindi: data.stemHindi,
        stemLatex: data.stemLatex || null,
        mediaUrls: data.mediaUrls,
        options: data.options,
        tags: data.tags,
        version: 1,
        status: 'DRAFT',
        authorUid: req.user!.uid,
        reviewerUid: null,
        reviewNotes: null,
        approvedAt: null,
        publishedAt: null,
        createdAt: now,
        updatedAt: now
      };

      const enclaveDoc: QuestionKeyEnclave = {
        questionId,
        correctOptionIds: data.correctOptionIds,
        numericalTolerance: data.numericalTolerance || null,
        explanationRichText: data.explanationRichText || '',
        explanationHindi: data.explanationHindi,
        explanationLatex: data.explanationLatex || null,
        solutionMediaUrls: [],
        verifiedByReviewerId: null,
        verifiedAt: null
      };

      const batch = db.batch();
      batch.set(db.collection('question_banks').doc(questionId), questionDoc);
      batch.set(db.collection('question_bank_keys').doc(questionId), enclaveDoc);
      await batch.commit();

      await logAuditEvent({
        actorUid: req.user!.uid,
        actorRole: req.user!.role,
        action: 'QUESTION_CREATED',
        targetUid: questionId,
        details: { examId: data.examId, subjectId: data.subjectId, type: data.type },
        requestId: req.id
      });

      res.status(201).json({
        data: {
          ...questionDoc,
          correctOptionIds: enclaveDoc.correctOptionIds,
          numericalTolerance: enclaveDoc.numericalTolerance,
          explanationRichText: enclaveDoc.explanationRichText,
          explanationHindi: enclaveDoc.explanationHindi,
          explanationLatex: enclaveDoc.explanationLatex
        },
        meta: { requestId: req.id }
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PUT /v1/admin/questions/:id
 * Update an existing question and/or its answer key enclave.
 */
adminQuestionsRouter.put(
  '/:id',
  requireRole('EDITOR', 'CONTENT_ADMIN', 'SUPER_ADMIN'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const parseResult = UpdateQuestionInputSchema.safeParse(req.body);
      if (!parseResult.success) {
        throw new AppError('VALIDATION_ERROR', 'Validation failed', 400);
      }

      const data = parseResult.data;
      const db = getFirestore();
      const questionRef = db.collection('question_banks').doc(id);
      const enclaveRef = db.collection('question_bank_keys').doc(id);

      const [existingDoc, existingEnclave] = await Promise.all([
        questionRef.get(),
        enclaveRef.get()
      ]);

      if (!existingDoc.exists) {
        throw new AppError('RESOURCE_NOT_FOUND', 'Question not found', 404);
      }

      const current = existingDoc.data() as AdminQuestionItem;
      const currentEnclave = existingEnclave.exists ? (existingEnclave.data() as QuestionKeyEnclave) : null;
      const now = new Date().toISOString();

      const updatedQuestion: AdminQuestionItem = {
        ...current,
        examId: data.examId ?? current.examId,
        subjectId: data.subjectId ?? current.subjectId,
        chapterId: data.chapterId !== undefined ? data.chapterId : current.chapterId,
        type: data.type ?? current.type,
        difficulty: data.difficulty ?? current.difficulty,
        stemRichText: data.stemRichText ?? current.stemRichText,
        stemHindi: data.stemHindi !== undefined ? data.stemHindi : current.stemHindi,
        stemLatex: data.stemLatex !== undefined ? data.stemLatex : current.stemLatex,
        mediaUrls: data.mediaUrls ?? current.mediaUrls,
        options: data.options ?? current.options,
        tags: data.tags ?? current.tags,
        version: current.version + 1,
        updatedAt: now
      };

      const updatedEnclave: QuestionKeyEnclave = {
        questionId: id,
        correctOptionIds: data.correctOptionIds ?? (currentEnclave?.correctOptionIds || []),
        numericalTolerance: data.numericalTolerance !== undefined ? data.numericalTolerance : (currentEnclave?.numericalTolerance || null),
        explanationRichText: data.explanationRichText !== undefined ? data.explanationRichText : (currentEnclave?.explanationRichText || ''),
        explanationHindi: data.explanationHindi !== undefined ? data.explanationHindi : currentEnclave?.explanationHindi,
        explanationLatex: data.explanationLatex !== undefined ? data.explanationLatex : currentEnclave?.explanationLatex,
        solutionMediaUrls: currentEnclave?.solutionMediaUrls || [],
        verifiedByReviewerId: currentEnclave?.verifiedByReviewerId || null,
        verifiedAt: currentEnclave?.verifiedAt || null
      };

      const batch = db.batch();
      batch.set(questionRef, updatedQuestion);
      batch.set(enclaveRef, updatedEnclave);
      await batch.commit();

      await logAuditEvent({
        actorUid: req.user!.uid,
        actorRole: req.user!.role,
        action: 'QUESTION_UPDATED',
        targetUid: id,
        details: { newVersion: updatedQuestion.version },
        requestId: req.id
      });

      res.status(200).json({
        data: {
          ...updatedQuestion,
          correctOptionIds: updatedEnclave.correctOptionIds,
          numericalTolerance: updatedEnclave.numericalTolerance,
          explanationRichText: updatedEnclave.explanationRichText,
          explanationHindi: updatedEnclave.explanationHindi,
          explanationLatex: updatedEnclave.explanationLatex
        },
        meta: { requestId: req.id }
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /v1/admin/questions/:id/review
 * Lifecycle review transitions: SUBMIT_FOR_REVIEW, APPROVE, REJECT, PUBLISH, ARCHIVE.
 */
adminQuestionsRouter.post(
  '/:id/review',
  requireRole('EDITOR', 'REVIEWER', 'CONTENT_ADMIN', 'SUPER_ADMIN'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const parseResult = ReviewQuestionActionSchema.safeParse(req.body);
      if (!parseResult.success) {
        throw new AppError('VALIDATION_ERROR', 'Validation failed', 400);
      }

      const { action, reviewNotes } = parseResult.data;
      const userRole = req.user!.role;

      // Role check for specific workflow actions
      if ((action === 'APPROVE' || action === 'REJECT') && !['REVIEWER', 'CONTENT_ADMIN', 'SUPER_ADMIN'].includes(userRole)) {
        throw new AppError('FORBIDDEN', 'Only reviewers and admins can approve or reject questions', 403);
      }

      if ((action === 'PUBLISH' || action === 'ARCHIVE') && !['CONTENT_ADMIN', 'SUPER_ADMIN'].includes(userRole)) {
        throw new AppError('FORBIDDEN', 'Only content administrators and superadmins can publish or archive questions', 403);
      }

      const db = getFirestore();
      const questionRef = db.collection('question_banks').doc(id);
      const questionDoc = await questionRef.get();

      if (!questionDoc.exists) {
        throw new AppError('RESOURCE_NOT_FOUND', 'Question not found', 404);
      }

      const current = questionDoc.data() as AdminQuestionItem;
      const now = new Date().toISOString();

      let targetStatus: QuestionStatus = current.status;
      let reviewerUid = current.reviewerUid;
      let approvedAt = current.approvedAt;
      let publishedAt = current.publishedAt;

      switch (action) {
        case 'SUBMIT_FOR_REVIEW':
          targetStatus = 'IN_REVIEW';
          break;
        case 'APPROVE':
          targetStatus = 'APPROVED';
          reviewerUid = req.user!.uid;
          approvedAt = now;
          break;
        case 'REJECT':
          targetStatus = 'REJECTED';
          reviewerUid = req.user!.uid;
          break;
        case 'PUBLISH':
          targetStatus = 'PUBLISHED';
          publishedAt = now;
          break;
        case 'ARCHIVE':
          targetStatus = 'ARCHIVED';
          break;
      }

      const updatePayload: Partial<AdminQuestionItem> = {
        status: targetStatus,
        reviewerUid,
        reviewNotes: reviewNotes || current.reviewNotes,
        approvedAt,
        publishedAt,
        updatedAt: now
      };

      await questionRef.update(updatePayload);

      // If approved or published, reflect reviewer in enclave
      if (action === 'APPROVE' || action === 'PUBLISH') {
        const enclaveRef = db.collection('question_bank_keys').doc(id);
        await enclaveRef.update({
          verifiedByReviewerId: req.user!.uid,
          verifiedAt: now
        }).catch(() => {
          // Non-blocking if enclave key was created without key
        });
      }

      await logAuditEvent({
        actorUid: req.user!.uid,
        actorRole: req.user!.role,
        action: `QUESTION_${action}`,
        targetUid: id,
        details: { previousStatus: current.status, newStatus: targetStatus, reviewNotes },
        requestId: req.id
      });

      res.status(200).json({
        data: {
          ...current,
          ...updatePayload
        },
        meta: { requestId: req.id }
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /v1/admin/questions/:id/clone
 * Duplicate an existing question into a new DRAFT question.
 */
adminQuestionsRouter.post(
  '/:id/clone',
  requireRole('EDITOR', 'CONTENT_ADMIN', 'SUPER_ADMIN'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const db = getFirestore();

      const [questionDoc, enclaveDoc] = await Promise.all([
        db.collection('question_banks').doc(id).get(),
        db.collection('question_bank_keys').doc(id).get()
      ]);

      if (!questionDoc.exists) {
        throw new AppError('RESOURCE_NOT_FOUND', 'Question not found', 404);
      }

      const current = questionDoc.data() as AdminQuestionItem;
      const currentEnclave = enclaveDoc.exists ? (enclaveDoc.data() as QuestionKeyEnclave) : null;

      const newId = uuidv4();
      const now = new Date().toISOString();

      const clonedQuestion: AdminQuestionItem = {
        ...current,
        id: newId,
        stemRichText: `${current.stemRichText} (Copy)`,
        version: 1,
        status: 'DRAFT',
        authorUid: req.user!.uid,
        reviewerUid: null,
        reviewNotes: null,
        approvedAt: null,
        publishedAt: null,
        createdAt: now,
        updatedAt: now
      };

      const clonedEnclave: QuestionKeyEnclave = {
        questionId: newId,
        correctOptionIds: currentEnclave?.correctOptionIds || [],
        numericalTolerance: currentEnclave?.numericalTolerance || null,
        explanationRichText: currentEnclave?.explanationRichText || '',
        explanationHindi: currentEnclave?.explanationHindi,
        explanationLatex: currentEnclave?.explanationLatex || null,
        solutionMediaUrls: currentEnclave?.solutionMediaUrls || [],
        verifiedByReviewerId: null,
        verifiedAt: null
      };

      const batch = db.batch();
      batch.set(db.collection('question_banks').doc(newId), clonedQuestion);
      batch.set(db.collection('question_bank_keys').doc(newId), clonedEnclave);
      await batch.commit();

      await logAuditEvent({
        actorUid: req.user!.uid,
        actorRole: req.user!.role,
        action: 'QUESTION_CLONED',
        targetUid: newId,
        details: { originalQuestionId: id },
        requestId: req.id
      });

      res.status(201).json({
        data: clonedQuestion,
        meta: { requestId: req.id }
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /v1/admin/questions/:id
 * Archive (soft-delete) question.
 */
adminQuestionsRouter.delete(
  '/:id',
  requireRole('CONTENT_ADMIN', 'SUPER_ADMIN'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const db = getFirestore();
      const questionRef = db.collection('question_banks').doc(id);

      const doc = await questionRef.get();
      if (!doc.exists) {
        throw new AppError('RESOURCE_NOT_FOUND', 'Question not found', 404);
      }

      const now = new Date().toISOString();
      await questionRef.update({
        status: 'ARCHIVED',
        updatedAt: now
      });

      await logAuditEvent({
        actorUid: req.user!.uid,
        actorRole: req.user!.role,
        action: 'QUESTION_ARCHIVED',
        targetUid: id,
        requestId: req.id
      });

      res.status(200).json({
        data: { id, status: 'ARCHIVED', updatedAt: now },
        meta: { requestId: req.id }
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /v1/admin/questions/import/preview
 * Validate CSV rows and detect duplicate stems/options before committing.
 */
adminQuestionsRouter.post(
  '/import/preview',
  requireRole('EDITOR', 'CONTENT_ADMIN', 'SUPER_ADMIN'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { rows, defaultExamId, defaultSubjectId, defaultChapterId } = req.body;

      if (!Array.isArray(rows) || rows.length === 0) {
        throw new AppError('VALIDATION_ERROR', 'Rows array is required and must not be empty', 400);
      }

      if (!defaultExamId || !defaultSubjectId) {
        throw new AppError('VALIDATION_ERROR', 'defaultExamId and defaultSubjectId are required', 400);
      }

      const validRows: Array<{ rowIndex: number; data: CreateQuestionInput }> = [];
      const errors: Array<{ rowIndex: number; field?: string; message: string }> = [];
      const seenStems = new Set<string>();

      rows.forEach((rawRow, idx) => {
        const rowIndex = idx + 1;
        const rowResult = BulkImportRowSchema.safeParse(rawRow);

        if (!rowResult.success) {
          rowResult.error.errors.forEach(err => {
            errors.push({
              rowIndex,
              field: err.path.join('.'),
              message: err.message
            });
          });
          return;
        }

        const row: BulkImportRow = rowResult.data;
        const normalizedStem = row.stemRichText.trim().toLowerCase();

        if (seenStems.has(normalizedStem)) {
          errors.push({
            rowIndex,
            field: 'stemRichText',
            message: 'Duplicate question text detected within this batch'
          });
          return;
        }
        seenStems.add(normalizedStem);

        // Build options array
        const options = [
          { id: 'opt_a', text: row.optionA },
          { id: 'opt_b', text: row.optionB }
        ];

        if (row.optionC && row.optionC.trim()) {
          options.push({ id: 'opt_c', text: row.optionC.trim() });
        }
        if (row.optionD && row.optionD.trim()) {
          options.push({ id: 'opt_d', text: row.optionD.trim() });
        }

        // Map correct option(s) (e.g., 'A', 'B', 'A,C', 'opt_a')
        const rawTokens = row.correctOption.split(',').map(s => s.trim().toUpperCase());
        const correctOptionIds: string[] = [];

        rawTokens.forEach(tok => {
          if (tok === 'A' || tok === 'OPT_A') correctOptionIds.push('opt_a');
          else if (tok === 'B' || tok === 'OPT_B') correctOptionIds.push('opt_b');
          else if (tok === 'C' || tok === 'OPT_C') correctOptionIds.push('opt_c');
          else if (tok === 'D' || tok === 'OPT_D') correctOptionIds.push('opt_d');
        });

        if (correctOptionIds.length === 0) {
          errors.push({
            rowIndex,
            field: 'correctOption',
            message: `Invalid correctOption "${row.correctOption}". Must be A, B, C, D or combinations like A,C.`
          });
          return;
        }

        // Check that specified correct options actually exist in options list
        const validOptionIds = new Set(options.map(o => o.id));
        const invalidSelections = correctOptionIds.filter(id => !validOptionIds.has(id));
        if (invalidSelections.length > 0) {
          errors.push({
            rowIndex,
            field: 'correctOption',
            message: `Option ${invalidSelections.join(', ')} does not exist in the provided options`
          });
          return;
        }

        const tags = row.tags ? row.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

        const questionInput: CreateQuestionInput = {
          examId: defaultExamId,
          subjectId: defaultSubjectId,
          chapterId: defaultChapterId || undefined,
          type: row.type || 'SINGLE_CHOICE',
          difficulty: row.difficulty || 'MEDIUM',
          stemRichText: row.stemRichText,
          stemHindi: row.stemHindi || undefined,
          options,
          correctOptionIds,
          explanationRichText: row.explanation || '',
          tags,
          mediaUrls: []
        };

        validRows.push({
          rowIndex,
          data: questionInput
        });
      });

      res.status(200).json({
        data: {
          totalRows: rows.length,
          validCount: validRows.length,
          invalidCount: errors.length,
          validRows,
          errors
        },
        meta: { requestId: req.id }
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /v1/admin/questions/import/commit
 * Persist validated questions in chunked Firestore batch writes (<= 500 writes per batch).
 */
adminQuestionsRouter.post(
  '/import/commit',
  requireRole('EDITOR', 'CONTENT_ADMIN', 'SUPER_ADMIN'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { questions } = req.body;

      if (!Array.isArray(questions) || questions.length === 0) {
        throw new AppError('VALIDATION_ERROR', 'Questions array is required', 400);
      }

      if (questions.length > 500) {
        throw new AppError('VALIDATION_ERROR', 'Cannot import more than 500 questions in a single request', 400);
      }

      const db = getFirestore();
      const importedQuestionIds: string[] = [];
      const now = new Date().toISOString();

      // Each question requires 2 writes: 1 to question_banks and 1 to question_bank_keys
      // Firestore batch limit is 500 writes -> max 250 questions per batch
      const CHUNK_SIZE = 200;

      for (let i = 0; i < questions.length; i += CHUNK_SIZE) {
        const chunk = questions.slice(i, i + CHUNK_SIZE);
        const batch = db.batch();

        for (const rawQuestion of chunk) {
          const validated = CreateQuestionInputSchema.parse(rawQuestion);
          const questionId = uuidv4();

          const questionDoc: AdminQuestionItem = {
            id: questionId,
            examId: validated.examId,
            subjectId: validated.subjectId,
            chapterId: validated.chapterId,
            type: validated.type,
            difficulty: validated.difficulty,
            stemRichText: validated.stemRichText,
            stemHindi: validated.stemHindi,
            stemLatex: validated.stemLatex || null,
            mediaUrls: validated.mediaUrls,
            options: validated.options,
            tags: validated.tags,
            version: 1,
            status: 'DRAFT',
            authorUid: req.user!.uid,
            reviewerUid: null,
            reviewNotes: null,
            approvedAt: null,
            publishedAt: null,
            createdAt: now,
            updatedAt: now
          };

          const enclaveDoc: QuestionKeyEnclave = {
            questionId,
            correctOptionIds: validated.correctOptionIds,
            numericalTolerance: validated.numericalTolerance || null,
            explanationRichText: validated.explanationRichText || '',
            explanationHindi: validated.explanationHindi,
            explanationLatex: validated.explanationLatex || null,
            solutionMediaUrls: [],
            verifiedByReviewerId: null,
            verifiedAt: null
          };

          batch.set(db.collection('question_banks').doc(questionId), questionDoc);
          batch.set(db.collection('question_bank_keys').doc(questionId), enclaveDoc);
          importedQuestionIds.push(questionId);
        }

        await batch.commit();
      }

      await logAuditEvent({
        actorUid: req.user!.uid,
        actorRole: req.user!.role,
        action: 'QUESTIONS_BULK_IMPORTED',
        details: { count: importedQuestionIds.length },
        requestId: req.id
      });

      res.status(201).json({
        data: {
          totalProcessed: questions.length,
          importedCount: importedQuestionIds.length,
          importedQuestionIds
        },
        meta: { requestId: req.id }
      });
    } catch (error) {
      next(error);
    }
  }
);
