import { z } from 'zod';

export const UserRoleEnum = z.enum([
  'SUPER_ADMIN',
  'CONTENT_ADMIN',
  'EDITOR',
  'REVIEWER',
  'STUDENT',
  'INSTITUTE_ADMIN',
  // Lowercase compatibility
  'superadmin',
  'content_admin',
  'editor',
  'reviewer',
  'student',
  'institute_admin'
]);

export type UserRole = z.infer<typeof UserRoleEnum>;

export function normalizeRole(role: string): string {
  return role.toUpperCase();
}

export const UserPreferencesSchema = z.object({
  theme: z.enum(['system', 'light', 'dark']).default('system'),
  language: z.string().default('en'),
  notificationsEnabled: z.boolean().default(true)
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export const UserSubscriptionSchema = z.object({
  planId: z.enum(['free', 'premium_monthly', 'premium_annual']).default('free'),
  validUntil: z.string().datetime().nullable().optional(),
  isActive: z.boolean().default(false)
});

export type UserSubscription = z.infer<typeof UserSubscriptionSchema>;

export const AgeAudienceSchema = z.object({
  isMinor: z.boolean().default(false),
  parentalConsentGiven: z.boolean().default(false)
});

export type AgeAudience = z.infer<typeof AgeAudienceSchema>;

export const UserProfileSchema = z.object({
  uid: z.string(),
  email: z.string().email().nullable(),
  phoneNumber: z.string().nullable().optional(),
  displayName: z.string(),
  photoUrl: z.string().url().nullable().optional(),
  role: UserRoleEnum.default('STUDENT'),
  instituteId: z.string().nullable().optional(),
  targetExamId: z.string().nullable().optional(),
  preferences: UserPreferencesSchema.default({}),
  subscription: UserSubscriptionSchema.default({}),
  ageAudience: AgeAudienceSchema.default({}),
  isDeleted: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

export const UpdateProfileInputSchema = z.object({
  displayName: z.string().min(2).max(100).optional(),
  photoUrl: z.string().url().nullable().optional(),
  targetExamId: z.string().nullable().optional(),
  preferences: UserPreferencesSchema.partial().optional(),
  ageAudience: AgeAudienceSchema.partial().optional()
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileInputSchema>;

export const AssignRoleInputSchema = z.object({
  role: UserRoleEnum,
  reason: z.string().min(3).max(500)
});

export type AssignRoleInput = z.infer<typeof AssignRoleInputSchema>;

export const AccountDeletionRequestSchema = z.object({
  reason: z.string().max(1000).optional(),
  confirmDelete: z.literal(true)
});

export type AccountDeletionRequest = z.infer<typeof AccountDeletionRequestSchema>;

export const AuditLogEntrySchema = z.object({
  id: z.string(),
  actorUid: z.string(),
  actorRole: z.string(),
  action: z.string(),
  targetUid: z.string().optional(),
  details: z.record(z.unknown()),
  timestamp: z.string().datetime()
});

export type AuditLogEntry = z.infer<typeof AuditLogEntrySchema>;
