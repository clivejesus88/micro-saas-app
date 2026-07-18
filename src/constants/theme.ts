import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  text: '#000000',
  background: '#ffffff',
  backgroundElement: '#F0F0F3',
  backgroundSelected: '#E0E1E6',
  textSecondary: '#60646C',
} as const;

export type ThemeColor = keyof typeof Colors;

export const AppColors = {
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#888888',
  textMuted: '#AAAAAA',
  textPlaceholder: '#BBBBBB',
  border: '#F0F0F0',
  borderLight: '#F5F5F5',
  borderSubtle: 'rgba(0,0,0,0.04)',
  accent: '#4A7A28',
  accentLight: '#F0F6E8',
  accentDark: '#2D4A1E',
  accentDeep: '#1C2A0E',
  orange: '#FF6B1A',
  orangeLight: '#FFF0E6',
  destructive: '#E8453C',
  scanLine: '#4AE88C',
  shadow: '#1A1A1A',
  inputBg: '#F5F5F5',
  navBg: 'rgba(244,247,242,0.08)',
  navBorder: 'rgba(74,122,40,0.22)',
  navActive: '#037e4a',
  navInactive: 'rgba(0,0,0,0.35)',
  overlay: 'rgba(0,0,0,0.06)',
  cardBorder: 'rgba(0,0,0,0.04)',
  white: '#FFFFFF',
} as const;

export type AppColorScheme = typeof AppColors;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
