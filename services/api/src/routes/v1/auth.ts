import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { getFirestore } from '../../lib/firebase';
import { AppError } from '../../middleware/errorHandler';
import { UpdateProfileInputSchema, AccountDeletionRequestSchema, UserProfile } from '@clearexam/contracts';
import { logAuditEvent } from '../../lib/audit';

export const authRouter = Router();

// All routes here require authentication
authRouter.use(authMiddleware);

/**
 * GET /v1/auth/me
 * Retrieves the current authenticated user's profile.
 */
authRouter.get('/me', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const db = getFirestore();
    const userDocRef = db.collection('users').doc(user.uid);
    const docSnap = await userDocRef.get();

    if (!docSnap.exists) {
      // First-time user onboarding: Create default profile document
      const now = new Date().toISOString();
      const newProfile: UserProfile = {
        uid: user.uid,
        email: user.email,
        phoneNumber: user.phoneNumber || null,
        displayName: user.displayName || user.email?.split('@')[0] || 'ClearExam Aspirant',
        photoUrl: user.photoUrl || null,
        role: user.role,
        targetExamId: null,
        preferences: {
          theme: 'system',
          language: 'en',
          notificationsEnabled: true
        },
        subscription: {
          planId: 'free',
          isActive: false
        },
        ageAudience: {
          isMinor: false,
          parentalConsentGiven: false
        },
        isDeleted: false,
        createdAt: now,
        updatedAt: now
      };

      await userDocRef.set(newProfile);
      res.status(200).json({ data: newProfile, meta: { requestId: req.id } });
      return;
    }

    const profileData = docSnap.data() as UserProfile;
    if (profileData.isDeleted) {
      throw new AppError('FORBIDDEN', 'This account has been deactivated or scheduled for deletion', 403);
    }

    res.status(200).json({ data: profileData, meta: { requestId: req.id } });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /v1/auth/me
 * Updates safe profile fields. Prohibits self-modification of role or subscription.
 */
authRouter.put('/me', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const parseResult = UpdateProfileInputSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw parseResult.error;
    }

    const updates = parseResult.data;
    const db = getFirestore();
    const userDocRef = db.collection('users').doc(user.uid);

    const updatePayload = {
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await userDocRef.set(updatePayload, { merge: true });
    const updatedDoc = await userDocRef.get();

    res.status(200).json({
      data: updatedDoc.data(),
      meta: { requestId: req.id }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /v1/auth/me/delete
 * Submits an account deletion request (GDPR & Play Store compliance).
 */
authRouter.post('/me/delete', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const parseResult = AccountDeletionRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw parseResult.error;
    }

    const db = getFirestore();
    const userDocRef = db.collection('users').doc(user.uid);

    await userDocRef.update({
      isDeleted: true,
      deletionRequestedAt: new Date().toISOString(),
      deletionReason: parseResult.data.reason || 'User initiated deletion',
      updatedAt: new Date().toISOString()
    });

    await logAuditEvent({
      actorUid: user.uid,
      actorRole: user.role,
      action: 'USER_ACCOUNT_DELETION_REQUESTED',
      targetUid: user.uid,
      details: { reason: parseResult.data.reason },
      requestId: req.id
    });

    res.status(200).json({
      data: {
        message: 'Account deactivation recorded. User data scheduled for complete purge within compliance window.',
        status: 'DEACTIVATED'
      },
      meta: { requestId: req.id }
    });
  } catch (error) {
    next(error);
  }
});
