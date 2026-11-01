import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';

// Mock Firestore for questions testing
vi.mock('../src/lib/firebase', () => {
  const mockQuestions = [
    {
      id: 'q_test_1',
      examId: 'exam_jee',
      subjectId: 'sub_physics',
      type: 'SINGLE_CHOICE',
      difficulty: 'MEDIUM',
      stemRichText: 'What is Newton second law?',
      stemHindi: 'न्यूटन का दूसरा नियम क्या है?',
      options: [
        { id: 'opt_a', text: 'F = ma' },
        { id: 'opt_b', text: 'E = mc^2' }
      ],
      tags: ['mechanics', 'newton'],
      version: 1,
      status: 'DRAFT',
      authorUid: 'editor_1',
      reviewerUid: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const mockEnclaves: Record<string, any> = {
    q_test_1: {
      questionId: 'q_test_1',
      correctOptionIds: ['opt_a'],
      explanationRichText: 'Force equals mass times acceleration.',
      explanationHindi: 'बल द्रव्यमान और त्वरण के गुणनफल के बराबर होता है।'
    }
  };

  const mockDb = {
    batch: vi.fn(() => ({
      set: vi.fn(),
      commit: vi.fn().mockResolvedValue(undefined)
    })),
    collection: vi.fn((colName: string) => {
      if (colName === 'question_banks') {
        return {
          where: vi.fn().mockReturnThis(),
          get: vi.fn().mockResolvedValue({
            docs: mockQuestions.map(d => ({ data: () => d }))
          }),
          doc: vi.fn((docId?: string) => ({
            get: vi.fn().mockResolvedValue({
              exists: docId === 'q_test_1',
              data: () => mockQuestions.find(q => q.id === docId) || mockQuestions[0]
            }),
            set: vi.fn().mockResolvedValue(undefined),
            update: vi.fn().mockResolvedValue(undefined)
          })),
          count: vi.fn(() => ({
            get: vi.fn().mockResolvedValue({ data: () => ({ count: 1 }) })
          }))
        };
      }

      if (colName === 'question_bank_keys') {
        return {
          doc: vi.fn((docId?: string) => ({
            get: vi.fn().mockResolvedValue({
              exists: Boolean(docId && mockEnclaves[docId]),
              data: () => (docId ? mockEnclaves[docId] : null)
            }),
            set: vi.fn().mockResolvedValue(undefined),
            update: vi.fn().mockResolvedValue(undefined)
          }))
        };
      }

      // Default mock for audit_logs, users, etc.
      return {
        add: vi.fn().mockResolvedValue(undefined),
        doc: vi.fn(() => ({
          get: vi.fn().mockResolvedValue({ exists: true, data: () => ({}) }),
          set: vi.fn().mockResolvedValue(undefined),
          update: vi.fn().mockResolvedValue(undefined)
        }))
      };
    })
  };

  return {
    getFirestore: () => mockDb,
    getFirebaseAuth: () => ({
      verifyIdToken: vi.fn()
    })
  };
});

describe('Phase 03: Question Bank & Review Flow Verification', () => {
  const app = createApp();

  describe('Security Boundaries & RBAC', () => {
    it('Blocks unauthenticated user from GET /v1/admin/questions with 401', async () => {
      const res = await request(app).get('/v1/admin/questions');
      expect(res.status).toBe(401);
      expect(res.body.code).toBe('UNAUTHORIZED');
    });

    it('Blocks STUDENT from creating questions with 403', async () => {
      const res = await request(app)
        .post('/v1/admin/questions')
        .set('Authorization', 'Bearer test-token-student-student123')
        .send({
          examId: 'exam_jee',
          subjectId: 'sub_physics',
          stemRichText: 'Test stem?',
          options: [{ id: 'opt_1', text: '1' }, { id: 'opt_2', text: '2' }],
          correctOptionIds: ['opt_1']
        });
      expect(res.status).toBe(403);
      expect(res.body.code).toBe('FORBIDDEN');
    });
  });

  describe('Question Authoring & Separation of Answer Key Enclave', () => {
    it('Allows EDITOR to author a new question draft with separated enclave', async () => {
      const res = await request(app)
        .post('/v1/admin/questions')
        .set('Authorization', 'Bearer test-token-editor-editor123')
        .send({
          examId: 'exam_jee',
          subjectId: 'sub_physics',
          type: 'SINGLE_CHOICE',
          difficulty: 'MEDIUM',
          stemRichText: 'What is the SI unit of electric current?',
          stemHindi: 'विद्युत धारा की SI इकाई क्या है?',
          options: [
            { id: 'opt_a', text: 'Ampere' },
            { id: 'opt_b', text: 'Volt' },
            { id: 'opt_c', text: 'Ohm' },
            { id: 'opt_d', text: 'Watt' }
          ],
          correctOptionIds: ['opt_a'],
          explanationRichText: 'Ampere (symbol: A) is the SI base unit of electric current.',
          tags: ['physics', 'units']
        });

      expect(res.status).toBe(201);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.status).toBe('DRAFT');
      expect(res.body.data.version).toBe(1);
      expect(res.body.data.correctOptionIds).toEqual(['opt_a']);
      expect(res.body.data.explanationRichText).toContain('Ampere');
    });

    it('Retrieves question with complete key and explanation for admins', async () => {
      const res = await request(app)
        .get('/v1/admin/questions/q_test_1')
        .set('Authorization', 'Bearer test-token-reviewer-reviewer123');

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe('q_test_1');
      expect(res.body.data.stemRichText).toBe('What is Newton second law?');
      expect(res.body.data.correctOptionIds).toEqual(['opt_a']);
      expect(res.body.data.explanationRichText).toBe('Force equals mass times acceleration.');
    });

    it('Allows EDITOR to update an existing question', async () => {
      const res = await request(app)
        .put('/v1/admin/questions/q_test_1')
        .set('Authorization', 'Bearer test-token-editor-editor123')
        .send({
          stemRichText: 'What is Newton second law of motion (revised)?',
          explanationRichText: 'Updated solution explanation.'
        });

      expect(res.status).toBe(200);
      expect(res.body.data.stemRichText).toBe('What is Newton second law of motion (revised)?');
      expect(res.body.data.version).toBe(2);
    });
  });

  describe('Review Workflow State Transitions', () => {
    it('Allows EDITOR to submit question for review (DRAFT -> IN_REVIEW)', async () => {
      const res = await request(app)
        .post('/v1/admin/questions/q_test_1/review')
        .set('Authorization', 'Bearer test-token-editor-editor123')
        .send({ action: 'SUBMIT_FOR_REVIEW', reviewNotes: 'Ready for peer verification' });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('IN_REVIEW');
    });

    it('Blocks EDITOR from approving a question with 403', async () => {
      const res = await request(app)
        .post('/v1/admin/questions/q_test_1/review')
        .set('Authorization', 'Bearer test-token-editor-editor123')
        .send({ action: 'APPROVE' });

      expect(res.status).toBe(403);
      expect(res.body.code).toBe('FORBIDDEN');
    });

    it('Allows REVIEWER to approve question (IN_REVIEW -> APPROVED)', async () => {
      const res = await request(app)
        .post('/v1/admin/questions/q_test_1/review')
        .set('Authorization', 'Bearer test-token-reviewer-reviewer123')
        .send({ action: 'APPROVE', reviewNotes: 'Formula and key verified' });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('APPROVED');
      expect(res.body.data.reviewerUid).toBe('reviewer123');
    });

    it('Allows CONTENT_ADMIN to publish question (APPROVED -> PUBLISHED)', async () => {
      const res = await request(app)
        .post('/v1/admin/questions/q_test_1/review')
        .set('Authorization', 'Bearer test-token-content_admin-admin123')
        .send({ action: 'PUBLISH' });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('PUBLISHED');
      expect(res.body.data.publishedAt).toBeDefined();
    });

    it('Allows CONTENT_ADMIN to archive a question', async () => {
      const res = await request(app)
        .delete('/v1/admin/questions/q_test_1')
        .set('Authorization', 'Bearer test-token-content_admin-admin123');

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('ARCHIVED');
    });
  });

  describe('Bulk Import Flow & Validation', () => {
    it('Provides standard CSV template download with correct headers', async () => {
      const res = await request(app)
        .get('/v1/admin/questions/import/template')
        .set('Authorization', 'Bearer test-token-editor-editor123');

      expect(res.status).toBe(200);
      expect(res.header['content-type']).toContain('text/csv');
      expect(res.text).toContain('stemRichText');
      expect(res.text).toContain('correctOption');
    });

    it('Validates CSV rows and detects invalid correctOption in preview', async () => {
      const res = await request(app)
        .post('/v1/admin/questions/import/preview')
        .set('Authorization', 'Bearer test-token-editor-editor123')
        .send({
          defaultExamId: 'exam_jee',
          defaultSubjectId: 'sub_physics',
          rows: [
            {
              stemRichText: 'Valid test question 1?',
              optionA: 'Opt 1',
              optionB: 'Opt 2',
              correctOption: 'A'
            },
            {
              stemRichText: 'Question with nonexistent option C?',
              optionA: 'Opt 1',
              optionB: 'Opt 2',
              correctOption: 'C' // Only A and B provided
            }
          ]
        });

      expect(res.status).toBe(200);
      expect(res.body.data.totalRows).toBe(2);
      expect(res.body.data.validCount).toBe(1);
      expect(res.body.data.invalidCount).toBe(1);
      expect(res.body.data.errors[0].message).toContain('does not exist');
    });

    it('Detects duplicate stem within the same batch in preview', async () => {
      const res = await request(app)
        .post('/v1/admin/questions/import/preview')
        .set('Authorization', 'Bearer test-token-editor-editor123')
        .send({
          defaultExamId: 'exam_jee',
          defaultSubjectId: 'sub_physics',
          rows: [
            {
              stemRichText: 'Identical Question Text?',
              optionA: 'Opt 1',
              optionB: 'Opt 2',
              correctOption: 'A'
            },
            {
              stemRichText: 'Identical Question Text?',
              optionA: 'Opt 1',
              optionB: 'Opt 2',
              correctOption: 'B'
            }
          ]
        });

      expect(res.status).toBe(200);
      expect(res.body.data.validCount).toBe(1);
      expect(res.body.data.invalidCount).toBe(1);
      expect(res.body.data.errors[0].message).toContain('Duplicate question text');
    });

    it('Persists bulk questions safely in commit endpoint', async () => {
      const res = await request(app)
        .post('/v1/admin/questions/import/commit')
        .set('Authorization', 'Bearer test-token-editor-editor123')
        .send({
          questions: [
            {
              examId: 'exam_jee',
              subjectId: 'sub_physics',
              type: 'SINGLE_CHOICE',
              difficulty: 'EASY',
              stemRichText: 'Sample imported question',
              options: [
                { id: 'opt_a', text: 'Option A' },
                { id: 'opt_b', text: 'Option B' }
              ],
              correctOptionIds: ['opt_a'],
              explanationRichText: 'Explanation for import'
            }
          ]
        });

      expect(res.status).toBe(201);
      expect(res.body.data.importedCount).toBe(1);
      expect(res.body.data.importedQuestionIds.length).toBe(1);
    });
  });
});
