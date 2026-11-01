import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';

// Mock Firestore queries for catalog testing
vi.mock('../src/lib/firebase', () => {
  const mockCategories = [
    { id: 'cat_eng', title: 'Engineering Entrance', slug: 'engineering', isPublished: true, displayOrder: 1 },
    { id: 'cat_draft', title: 'Draft Category', slug: 'draft-cat', isPublished: false, displayOrder: 2 }
  ];

  const mockExams = [
    { id: 'exam_jee', categoryId: 'cat_eng', title: 'JEE Main', code: 'JEE_MAIN', slug: 'jee-main', isPublished: true, displayOrder: 1 },
    { id: 'exam_draft', categoryId: 'cat_eng', title: 'JEE Advanced Draft', code: 'JEE_ADV', slug: 'jee-adv', isPublished: false, displayOrder: 2 }
  ];

  const mockDb = {
    collection: vi.fn((colName: string) => {
      if (colName === 'categories') {
        return {
          where: vi.fn((field: string, op: string, val: any) => {
            if (field === 'isPublished' && val === true) {
              return {
                get: vi.fn().mockResolvedValue({
                  docs: mockCategories.filter(c => c.isPublished).map(d => ({ data: () => d }))
                })
              };
            }
            if (field === 'slug') {
              return {
                get: vi.fn().mockResolvedValue({
                  empty: val !== 'engineering'
                })
              };
            }
            return {
              get: vi.fn().mockResolvedValue({ docs: [] })
            };
          }),
          get: vi.fn().mockResolvedValue({
            docs: mockCategories.map(d => ({ data: () => d }))
          }),
          doc: vi.fn(() => ({
            get: vi.fn().mockResolvedValue({ exists: true, data: () => mockCategories[0] }),
            set: vi.fn().mockResolvedValue(undefined),
            update: vi.fn().mockResolvedValue(undefined)
          })),
          count: vi.fn(() => ({
            get: vi.fn().mockResolvedValue({ data: () => ({ count: 5 }) })
          }))
        };
      }

      if (colName === 'exams') {
        return {
          where: vi.fn((field: string, op: string, val: any) => {
            if (field === 'isPublished' && val === true) {
              return {
                get: vi.fn().mockResolvedValue({
                  docs: mockExams.filter(e => e.isPublished).map(d => ({ data: () => d }))
                }),
                where: vi.fn().mockReturnThis(),
                count: vi.fn(() => ({
                  get: vi.fn().mockResolvedValue({ data: () => ({ count: 2 }) })
                }))
              };
            }
            if (field === 'slug') {
              return {
                get: vi.fn().mockResolvedValue({ empty: true })
              };
            }
            return {
              get: vi.fn().mockResolvedValue({ docs: [] })
            };
          }),
          get: vi.fn().mockResolvedValue({
            docs: mockExams.map(d => ({ data: () => d }))
          }),
          doc: vi.fn(() => ({
            get: vi.fn().mockResolvedValue({ exists: true, data: () => mockExams[0] }),
            set: vi.fn().mockResolvedValue(undefined),
            update: vi.fn().mockResolvedValue(undefined)
          })),
          count: vi.fn(() => ({
            get: vi.fn().mockResolvedValue({ data: () => ({ count: 10 }) })
          }))
        };
      }

      // Default mock collection for other collections (users, attempts, etc.)
      return {
        count: vi.fn(() => ({
          get: vi.fn().mockResolvedValue({ data: () => ({ count: 42 }) })
        })),
        where: vi.fn().mockReturnThis(),
        get: vi.fn().mockResolvedValue({ docs: [] }),
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

describe('Phase 02: Dynamic Exam Catalog & Admin Management Tests', () => {
  const app = createApp();

  describe('Public Catalog Exploration', () => {
    it('GET /v1/catalog/categories returns published categories only', async () => {
      const res = await request(app).get('/v1/catalog/categories');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].slug).toBe('engineering');
    });

    it('GET /v1/catalog/exams returns published exams only', async () => {
      const res = await request(app).get('/v1/catalog/exams');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].code).toBe('JEE_MAIN');
    });
  });

  describe('Security Boundaries & RBAC on Admin Catalog', () => {
    it('Blocks unauthenticated user from POST /v1/admin/catalog/categories with 401', async () => {
      const res = await request(app)
        .post('/v1/admin/catalog/categories')
        .send({
          title: 'Medical Entrance',
          slug: 'medical'
        });
      expect(res.status).toBe(401);
      expect(res.body.code).toBe('UNAUTHORIZED');
    });

    it('Blocks STUDENT role from POST /v1/admin/catalog/categories with 403 FORBIDDEN', async () => {
      const res = await request(app)
        .post('/v1/admin/catalog/categories')
        .set('Authorization', 'Bearer test-token-student-student123')
        .send({
          title: 'Medical Entrance',
          slug: 'medical'
        });
      expect(res.status).toBe(403);
      expect(res.body.code).toBe('FORBIDDEN');
    });

    it('Allows CONTENT_ADMIN to create an exam category', async () => {
      const res = await request(app)
        .post('/v1/admin/catalog/categories')
        .set('Authorization', 'Bearer test-token-content_admin-admin123')
        .send({
          title: 'Civil Services',
          titleHindi: 'सिविल सेवा',
          slug: 'civil-services',
          description: 'UPSC and State Public Service Commissions',
          displayOrder: 3,
          isPublished: true
        });
      expect(res.status).toBe(201);
      expect(res.body.data.slug).toBe('civil-services');
      expect(res.body.data.title).toBe('Civil Services');
    });

    it('Allows CONTENT_ADMIN to toggle category publication', async () => {
      const res = await request(app)
        .patch('/v1/admin/catalog/categories/cat_eng/publish')
        .set('Authorization', 'Bearer test-token-content_admin-admin123')
        .send({ isPublished: false });
      expect(res.status).toBe(200);
      expect(res.body.data.isPublished).toBe(false);
    });

    it('Allows CONTENT_ADMIN to create an exam under category', async () => {
      const res = await request(app)
        .post('/v1/admin/catalog/exams')
        .set('Authorization', 'Bearer test-token-content_admin-admin123')
        .send({
          categoryId: 'cat_eng',
          title: 'NEET UG',
          titleHindi: 'नीट यूजी',
          code: 'NEET_UG',
          slug: 'neet-ug',
          shortDescription: 'National Eligibility cum Entrance Test for Undergraduates',
          conductingBody: 'NTA',
          totalQuestionsDefault: 200,
          durationMinutesDefault: 200,
          isPublished: true
        });
      expect(res.status).toBe(201);
      expect(res.body.data.code).toBe('NEET_UG');
    });

    it('Allows admin to fetch real dashboard metrics with zero fake data', async () => {
      const res = await request(app)
        .get('/v1/admin/catalog/stats')
        .set('Authorization', 'Bearer test-token-super_admin-super123');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('registeredUsers');
      expect(res.body.data).toHaveProperty('publishedExams');
      expect(res.body.data).toHaveProperty('totalCategories');
      expect(typeof res.body.data.registeredUsers).toBe('number');
    });
  });
});
