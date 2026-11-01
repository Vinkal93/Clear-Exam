import { z } from 'zod';

export const ErrorCodeEnum = z.enum([
  'UNAUTHORIZED',
  'FORBIDDEN',
  'RESOURCE_NOT_FOUND',
  'EXAM_EXPIRED',
  'ATTEMPT_ALREADY_SUBMITTED',
  'ATTEMPT_NOT_FOUND',
  'VALIDATION_ERROR',
  'CONFLICT',
  'RATE_LIMITED',
  'INTERNAL_ERROR',
  'SERVICE_UNAVAILABLE'
]);

export type ErrorCode = z.infer<typeof ErrorCodeEnum>;

export const ErrorDetailSchema = z.object({
  field: z.string().optional(),
  issue: z.string()
});

export type ErrorDetail = z.infer<typeof ErrorDetailSchema>;

export const ApiErrorEnvelopeSchema = z.object({
  code: ErrorCodeEnum,
  message: z.string(),
  requestId: z.string(),
  timestamp: z.string().datetime(),
  details: z.array(ErrorDetailSchema).optional()
});

export type ApiErrorEnvelope = z.infer<typeof ApiErrorEnvelopeSchema>;

export const ApiResponseMetaSchema = z.object({
  requestId: z.string(),
  timestamp: z.string().datetime().optional(),
  total: z.number().int().nonnegative().optional(),
  hasMore: z.boolean().optional(),
  nextCursor: z.string().nullable().optional()
});

export type ApiResponseMeta = z.infer<typeof ApiResponseMetaSchema>;

export function createSuccessEnvelope<T>(data: T, meta: ApiResponseMeta) {
  return {
    data,
    meta
  };
}
