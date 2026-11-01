/**
 * Shared Design Tokens for ClearExam Web & Android
 * Extracted from Reference UI screens
 */

export const ColorTokens = {
  brand: {
    primaryNavy: '#0F172A',
    primaryIndigo: '#4F46E5',
    primaryIndigoLight: '#EEF2FF',
    accentTeal: '#0EA5E9',
    accentTealLight: '#E0F2FE'
  },
  feedback: {
    success: '#10B981',
    successLight: '#ECFDF5',
    warning: '#F59E0B',
    warningLight: '#FFFBEB',
    danger: '#EF4444',
    dangerLight: '#FEF2F2'
  },
  neutral: {
    white: '#FFFFFF',
    surface: '#F8FAFC',
    border: '#E2E8F0',
    textMain: '#1E293B',
    textMuted: '#64748B',
    textSubtle: '#94A3B8'
  }
} as const;

export const SpacingTokens = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32
} as const;

export const RadiusTokens = {
  button: 12,
  card: 16,
  chip: 9999
} as const;
