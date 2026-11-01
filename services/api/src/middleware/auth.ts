import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@clearexam/contracts';
import { getFirebaseAuth, getFirestore } from '../lib/firebase';
import { AppError } from './errorHandler';
import { logger } from '../lib/logger';
import { env } from '../config/env';

export interface AuthenticatedUser {
  uid: string;
  email: string | null;
  role: UserRole;
  phoneNumber?: string | null;
  displayName?: string;
  photoUrl?: string | null;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next(new AppError('UNAUTHORIZED', 'Authentication token missing or malformed', 401));
    return;
  }

  const token = authHeader.split('Bearer ')[1].trim();

  // Test mode mock bypass for deterministic unit tests
  if (env.NODE_ENV === 'test' && token.startsWith('test-token-')) {
    const parts = token.replace('test-token-', '').split('-');
    const role = (parts[0] || 'STUDENT').toUpperCase() as UserRole;
    const uid = parts[1] || 'test_user_123';
    req.user = {
      uid,
      email: `${uid}@example.com`,
      role,
      displayName: `Test User ${uid}`
    };
    next();
    return;
  }

  try {
    const auth = getFirebaseAuth();
    // verifyIdToken with checkRevoked = true
    const decodedToken = await auth.verifyIdToken(token, true);

    const role = (decodedToken.role as UserRole) || 'STUDENT';

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
      role,
      phoneNumber: decodedToken.phone_number || null,
      displayName: decodedToken.name || undefined,
      photoUrl: decodedToken.picture || undefined
    };

    next();
  } catch (error: any) {
    logger.warn({ err: error.message, requestId: req.id }, 'Token verification failed');

    if (error.code === 'auth/id-token-revoked') {
      next(new AppError('UNAUTHORIZED', 'Session revoked. Please log in again.', 401));
      return;
    }
    if (error.code === 'auth/id-token-expired') {
      next(new AppError('UNAUTHORIZED', 'Session expired. Please refresh your credentials.', 401));
      return;
    }

    next(new AppError('UNAUTHORIZED', 'Invalid authentication credentials', 401));
  }
}
