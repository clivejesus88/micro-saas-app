/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const AppColors = {
  light: {
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
  },
  dark: {
    background: '#0A0A0A',
    surface: '#141414',
    surfaceElevated: '#1C1C1C',
    text: '#F0F0F0',
    textSecondary: '#A0A0A0',
    textMuted: '#707070',
    textPlaceholder: '#555555',
    border: '#2A2A2A',
    borderLight: '#1E1E1E',
    borderSubtle: 'rgba(255,255,255,0.06)',
    accent: '#5CB832',
    accentLight: '#1A2E12',
    accentDark: '#3A6A1E',
    accentDeep: '#1A2E12',
    orange: '#FF7B2E',
    orangeLight: '#2E1A0A',
    destructive: '#EF5350',
    scanLine: '#4AE88C',
    shadow: '#000000',
    inputBg: '#1C1C1C',
    navBg: 'rgba(20,20,20,0.92)',
    navBorder: 'rgba(74,122,40,0.3)',
    navActive: '#5CB832',
    navInactive: 'rgba(255,255,255,0.35)',
    overlay: 'rgba(255,255,255,0.06)',
    cardBorder: 'rgba(255,255,255,0.06)',
    white: '#FFFFFF',
  },
} as const;

export type AppColorScheme = typeof AppColors.light;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
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
