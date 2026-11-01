import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiErrorEnvelope, ErrorCode } from '@clearexam/contracts';
import { logger } from '../lib/logger';

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: Array<{ field?: string; issue: string }>;

  constructor(
    code: ErrorCode,
    message: string,
    statusCode: number = 400,
    details?: Array<{ field?: string; issue: string }>
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const requestId = req.id || 'req_unknown';

  if (err instanceof AppError) {
    logger.warn({ err, requestId }, `AppError: ${err.message}`);
    const envelope: ApiErrorEnvelope = {
      code: err.code,
      message: err.message,
      requestId,
      timestamp: new Date().toISOString(),
      details: err.details
    };
    res.status(err.statusCode).json(envelope);
    return;
  }

  if (err instanceof ZodError) {
    logger.warn({ issues: err.issues, requestId }, 'Validation Error');
    const envelope: ApiErrorEnvelope = {
      code: 'VALIDATION_ERROR',
      message: 'Request payload failed schema validation',
      requestId,
      timestamp: new Date().toISOString(),
      details: err.issues.map((issue) => ({
        field: issue.path.join('.'),
        issue: issue.message
      }))
    };
    res.status(400).json(envelope);
    return;
  }

  logger.error({ err, requestId }, 'Unhandled Internal Server Error');
  const envelope: ApiErrorEnvelope = {
    code: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred while processing the request',
    requestId,
    timestamp: new Date().toISOString()
  };
  res.status(500).json(envelope);
}
