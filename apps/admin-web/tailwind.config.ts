import type { Config } from 'tailwindcss';
import { ColorTokens, RadiusTokens } from '@clearexam/contracts';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: ColorTokens.brand.primaryNavy,
          indigo: ColorTokens.brand.primaryIndigo,
          'indigo-light': ColorTokens.brand.primaryIndigoLight,
          teal: ColorTokens.brand.accentTeal,
          'teal-light': ColorTokens.brand.accentTealLight,
        },
        feedback: {
          success: ColorTokens.feedback.success,
          warning: ColorTokens.feedback.warning,
          danger: ColorTokens.feedback.danger,
        },
        neutral: {
          surface: ColorTokens.neutral.surface,
          border: ColorTokens.neutral.border,
          main: ColorTokens.neutral.textMain,
          muted: ColorTokens.neutral.textMuted,
          subtle: ColorTokens.neutral.textSubtle,
        }
      },
      borderRadius: {
        button: `${RadiusTokens.button}px`,
        card: `${RadiusTokens.card}px`,
      }
    },
  },
  plugins: [],
};

export default config;
