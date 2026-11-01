import { z } from 'zod';

export const UserRoleEnum = z.enum([
  'superadmin',
  'content_admin',
  'editor',
  'reviewer',
  'student',
  'institute_admin'
]);

export type UserRole = z.infer<typeof UserRoleEnum>;

export const UserProfileSchema = z.object({
  uid: z.string(),
  email: z.string().email().nullable(),
  phoneNumber: z.string().nullable(),
  displayName: z.string(),
  photoUrl: z.string().url().nullable().optional(),
  role: UserRoleEnum,
  instituteId: z.string().nullable().optional(),
  targetExamId: z.string().nullable().optional(),
  preferences: z.object({
    theme: z.enum(['system', 'light', 'dark']).default('system'),
    language: z.string().default('en'),
    notificationsEnabled: z.boolean().default(true)
  }),
  subscription: z.object({
    planId: z.enum(['free', 'premium_monthly', 'premium_annual']).default('free'),
    validUntil: z.string().datetime().nullable().optional(),
    isActive: z.boolean().default(false)
  }),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export type UserProfile = z.infer<typeof UserProfileSchema>;
