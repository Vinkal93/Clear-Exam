import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../../../middleware/auth';
import { requireRole } from '../../../middleware/rbac';
import { getFirebaseAuth, getFirestore } from '../../../lib/firebase';
import { AppError } from '../../../middleware/errorHandler';
import { AssignRoleInputSchema, UserRoleEnum, normalizeRole } from '@clearexam/contracts';
import { logAuditEvent } from '../../../lib/audit';

export const adminUsersRouter = Router();

// Base protection: Must be authenticated and have administrative role
adminUsersRouter.use(authMiddleware);

/**
 * GET /v1/admin/users
 * Lists user profiles. Accessible by CONTENT_ADMIN and SUPER_ADMIN.
 */
adminUsersRouter.get('/', requireRole('CONTENT_ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string, 10) || 20, 100);
    const roleFilter = req.query.role as string | undefined;

    const db = getFirestore();
    let query: FirebaseFirestore.Query = db.collection('users');

    if (roleFilter) {
      query = query.where('role', '==', roleFilter);
    }

    query = query.limit(limit);
    const snapshot = await query.get();

    const users = snapshot.docs.map((doc) => doc.data());

    res.status(200).json({
      data: users,
      meta: {
        total: users.length,
        hasMore: users.length === limit,
        requestId: req.id
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /v1/admin/users/:uid/role
 * Assigns a role to a user. Strictly restricted to SUPER_ADMIN.
 */
adminUsersRouter.post('/:uid/role', requireRole('SUPER_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const targetUid = req.params.uid;
    const actor = req.user!;

    const parseResult = AssignRoleInputSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw parseResult.error;
    }

    const { role, reason } = parseResult.data;
    const normalizedNewRole = normalizeRole(role);

    // Prevent demoting oneself to avoid orphaned admin system
    if (targetUid === actor.uid && normalizedNewRole !== 'SUPER_ADMIN') {
      throw new AppError('CONFLICT', 'Super Admin cannot revoke their own Super Admin privileges.', 409);
    }

    const auth = getFirebaseAuth();
    const db = getFirestore();
    const userDocRef = db.collection('users').doc(targetUid);
    const userDoc = await userDocRef.get();

    const previousRole = userDoc.exists ? (userDoc.data()?.role || 'STUDENT') : 'UNREGISTERED';

    // 1. Set Custom User Claims on Firebase Auth
    await auth.setCustomUserClaims(targetUid, { role: normalizedNewRole });

    // 2. Update user profile document in Firestore
    await userDocRef.set({
      role: normalizedNewRole,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    // 3. Record immutable security audit log
    await logAuditEvent({
      actorUid: actor.uid,
      actorRole: actor.role,
      action: 'ROLE_ASSIGNED',
      targetUid,
      details: {
        previousRole,
        newRole: normalizedNewRole,
        reason
      },
      requestId: req.id
    });

    res.status(200).json({
      data: {
        uid: targetUid,
        role: normalizedNewRole,
        assignedBy: actor.uid,
        reason
      },
      meta: { requestId: req.id }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /v1/admin/users/:uid/revoke
 * Forces revocation of all active sessions and refresh tokens for a user.
 */
adminUsersRouter.post('/:uid/revoke', requireRole('SUPER_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const targetUid = req.params.uid;
    const actor = req.user!;

    const auth = getFirebaseAuth();
    await auth.revokeRefreshTokens(targetUid);

    await logAuditEvent({
      actorUid: actor.uid,
      actorRole: actor.role,
      action: 'USER_SESSIONS_REVOKED',
      targetUid,
      details: { reason: req.body.reason || 'Administrative session revocation' },
      requestId: req.id
    });

    res.status(200).json({
      data: {
        uid: targetUid,
        status: 'REVOKED',
        message: 'All refresh tokens for this user have been revoked.'
      },
      meta: { requestId: req.id }
    });
  } catch (error) {
    next(error);
  }
});
