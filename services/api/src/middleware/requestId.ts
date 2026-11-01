import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

declare global {
  namespace Express {
    interface Request {
      id: string;
    }
  }
}

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const existingId = req.header('x-request-id');
  const id = existingId || `req_${uuidv4().replace(/-/g, '')}`;
  req.id = id;
  res.setHeader('x-request-id', id);
  next();
}
