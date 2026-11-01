import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';

// Mock Firebase Admin methods for unit testing security boundaries
vi.mock('../src/lib/firebase', () => {
  const mockSetCustomUserClaims = vi.fn().mockResolvedValue(undefined);
  const mockRevokeRefreshTokens = vi.fn().mockResolvedValue(undefined);

  const mockDoc = {
    get: vi.fn().mockResolvedValue({
      exists: true,
      data: () => ({
        uid: 'user_target_456',
        role: 'STUDENT',
        displayName: 'Target Student',
        isDeleted: false
      })
    }),
    set: vi.fn().mockResolvedValue(undefined),
    update: vi.fn().mockResolvedValue(undefined)
  };

  const mockCollection = {
    doc: vi.fn().mockReturnValue(mockDoc),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    get: vi.fn().mockResolvedValue({
      docs: [
        { data: () => ({ uid: 'user_1', role: 'STUDENT', displayName: 'Student One' }) },
        { data: () => ({ uid: 'user_2', role: 'EDITOR', displayName: 'Editor Two' }) }
      ]
    })
  };

  return {
    getFirebaseAuth: () => ({
      verifyIdToken: vi.fn(),
      setCustomUserClaims: mockSetCustomUserClaims,
      revokeRefreshTokens: mockRevokeRefreshTokens
    }),
    getFirestore: () => ({
      collection: vi.fn().mockReturnValue(mockCollection)
    })
  };
});

describe('Phase 01: Auth & Role-Based Access Control (RBAC) Security Boundaries', () => {
  const app = createApp();

  describe('Authentication Enforcement', () => {
    it('Rejects requests to /v1/auth/me without Authorization header with 401 UNAUTHORIZED', async () => {
      const res = await request(app).get('/v1/auth/me');
      expect(res.status).toBe(401);
      expect(res.body.code).toBe('UNAUTHORIZED');
      expect(res.body).toHaveProperty('requestId');
    });

    it('Rejects malformed token with 401 UNAUTHORIZED', async () => {
      const res = await request(app)
        .get('/v1/auth/me')
        .set('Authorization', 'Basic 123456');
      expect(res.status).toBe(401);
      expect(res.body.code).toBe('UNAUTHORIZED');
    });

    it('Allows valid token to access /v1/auth/me and returns profile', async () => {
      const res = await request(app)
        .get('/v1/auth/me')
        .set('Authorization', 'Bearer test-token-student-student123');
      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
    });
  });

  describe('RBAC & Privilege Escalation Prevention', () => {
    it('Blocks STUDENT from accessing /v1/admin/users with 403 FORBIDDEN', async () => {
      const res = await request(app)
        .get('/v1/admin/users')
        .set('Authorization', 'Bearer test-token-student-student123');
      expect(res.status).toBe(403);
      expect(res.body.code).toBe('FORBIDDEN');
    });

    it('Allows CONTENT_ADMIN to list users on /v1/admin/users', async () => {
      const res = await request(app)
        .get('/v1/admin/users')
        .set('Authorization', 'Bearer test-token-content_admin-admin123');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(2);
    });

    it('Blocks CONTENT_ADMIN from elevating roles via /v1/admin/users/:uid/role with 403 FORBIDDEN', async () => {
      const res = await request(app)
        .post('/v1/admin/users/user_target_456/role')
        .set('Authorization', 'Bearer test-token-content_admin-admin123')
        .send({
          role: 'SUPER_ADMIN',
          reason: 'Unauthorized elevation attempt'
        });
      expect(res.status).toBe(403);
      expect(res.body.code).toBe('FORBIDDEN');
    });

    it('Allows SUPER_ADMIN to assign roles via /v1/admin/users/:uid/role', async () => {
      const res = await request(app)
        .post('/v1/admin/users/user_target_456/role')
        .set('Authorization', 'Bearer test-token-super_admin-super123')
        .send({
          role: 'CONTENT_ADMIN',
          reason: 'Promoted to content manager'
        });
      expect(res.status).toBe(200);
      expect(res.body.data.role).toBe('CONTENT_ADMIN');
      expect(res.body.data.uid).toBe('user_target_456');
    });

    it('Allows SUPER_ADMIN to revoke user sessions via /v1/admin/users/:uid/revoke', async () => {
      const res = await request(app)
        .post('/v1/admin/users/user_target_456/revoke')
        .set('Authorization', 'Bearer test-token-super_admin-super123')
        .send({
          reason: 'Suspicious activity detected'
        });
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('REVOKED');
    });
  });

  describe('Profile Self-Modification Boundaries', () => {
    it('Allows updating safe profile fields', async () => {
      const res = await request(app)
        .put('/v1/auth/me')
        .set('Authorization', 'Bearer test-token-student-student123')
        .send({
          displayName: 'Updated Name',
          targetExamId: 'exam_jee_main'
        });
      expect(res.status).toBe(200);
    });

    it('Allows account deletion request lifecycle', async () => {
      const res = await request(app)
        .post('/v1/auth/me/delete')
        .set('Authorization', 'Bearer test-token-student-student123')
        .send({
          confirmDelete: true,
          reason: 'Student graduated'
        });
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('DEACTIVATED');
    });
  });
});
