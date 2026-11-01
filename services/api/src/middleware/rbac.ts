import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@clearexam/contracts';
import { AppError } from './errorHandler';

export function requireRole(...allowedRoles: string[]) {
  const normalizedAllowed = allowedRoles.map((r) => r.toUpperCase());

  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('UNAUTHORIZED', 'Authentication required', 401));
      return;
    }

    const userRole = (req.user.role || 'STUDENT').toUpperCase();

    // SUPER_ADMIN has access to all administrative actions
    if (userRole === 'SUPER_ADMIN' || normalizedAllowed.includes(userRole)) {
      next();
      return;
    }

    next(
      new AppError(
        'FORBIDDEN',
        `Access denied. Required role: [${allowedRoles.join(', ')}]. Current role: ${req.user.role}`,
        403
      )
    );
  };
}
