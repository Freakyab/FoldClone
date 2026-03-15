import '@/global.css';

import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#101828',
    background: '#F7F8FA',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    surfaceMuted: '#F0F2F5',
    backgroundElement: '#F0F2F5',
    backgroundSelected: '#E7EBF0',
    textSecondary: '#475467',
    textMuted: '#667085',
    textDisabled: '#98A2B3',
    border: '#E4E7EC',
    divider: '#EAECF0',
    accentBlue: '#3B82F6',
    accentGreen: '#22C55E',
    accentYellow: '#EAB308',
    accentRed: '#F04438',
    avatarBackground: '#E8EEF9',
    overlay: 'rgba(16, 24, 40, 0.08)',
    successSoft: '#EAFBF2',
    warningSoft: '#FFF6DD',
    dangerSoft: '#FFF0EE',
  },
  dark: {
    text: '#F5F7FA',
    background: '#05070A',
    surface: '#0F1318',
    surfaceElevated: '#151A21',
    surfaceMuted: '#0B0F13',
    backgroundElement: '#10151C',
    backgroundSelected: '#1A212B',
    textSecondary: '#C6CDD7',
    textMuted: '#8B96A5',
    textDisabled: '#667085',
    border: '#222A35',
    divider: '#1A2028',
    accentBlue: '#6C8CFF',
    accentGreen: '#4AD295',
    accentYellow: '#F0C65A',
    accentRed: '#FF6B6B',
    avatarBackground: '#1A2433',
    overlay: 'rgba(0, 0, 0, 0.35)',
    successSoft: '#12281F',
    warningSoft: '#2B2415',
    dangerSoft: '#2D181B',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

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

const codeFontWeight: '500' | '700' = Platform.OS === 'android' ? '700' : '500';

export const Spacing = {
  zero: 0,
  hairline: 2,
  half: 4,
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 24,
  six: 32,
  seven: 40,
  eight: 48,
} as const;

export const Radius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  full: 999,
} as const;

export const Typography = {
  title: {
    fontSize: 40,
    lineHeight: 44,
    fontWeight: '700' as const,
    letterSpacing: -1.2,
  },
  subtitle: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '700' as const,
    letterSpacing: -0.7,
  },
  default: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500' as const,
  },
  bodyStrong: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '700' as const,
  },
  small: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500' as const,
  },
  smallBold: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700' as const,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700' as const,
    letterSpacing: 0.3,
  },
  link: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600' as const,
  },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: codeFontWeight,
    fontSize: 12,
    lineHeight: 16,
  },
} as const;

const navigationLightColors = {
  ...NavigationDefaultTheme.colors,
  primary: Colors.light.accentBlue,
  background: Colors.light.background,
  card: Colors.light.surface,
  text: Colors.light.text,
  border: Colors.light.border,
  notification: Colors.light.accentRed,
};

const navigationDarkColors = {
  ...NavigationDarkTheme.colors,
  primary: Colors.dark.accentBlue,
  background: Colors.dark.background,
  card: Colors.dark.surface,
  text: Colors.dark.text,
  border: Colors.dark.border,
  notification: Colors.dark.accentRed,
};

export const NavigationThemes = {
  light: {
    ...NavigationDefaultTheme,
    colors: navigationLightColors,
  },
  dark: {
    ...NavigationDarkTheme,
    colors: navigationDarkColors,
  },
};

export const PaperThemes = {
  light: {
    ...MD3LightTheme,
    roundness: Radius.lg,
    colors: {
      ...MD3LightTheme.colors,
      primary: Colors.light.accentBlue,
      secondary: Colors.light.accentGreen,
      background: Colors.light.background,
      surface: Colors.light.surface,
      surfaceVariant: Colors.light.backgroundSelected,
      onSurface: Colors.light.text,
      onSurfaceVariant: Colors.light.textMuted,
      outline: Colors.light.border,
      outlineVariant: Colors.light.divider,
      error: Colors.light.accentRed,
    },
  },
  dark: {
    ...MD3DarkTheme,
    roundness: Radius.lg,
    colors: {
      ...MD3DarkTheme.colors,
      primary: Colors.dark.accentBlue,
      secondary: Colors.dark.accentGreen,
      background: Colors.dark.background,
      surface: Colors.dark.surface,
      surfaceVariant: Colors.dark.backgroundSelected,
      onSurface: Colors.dark.text,
      onSurfaceVariant: Colors.dark.textMuted,
      outline: Colors.dark.border,
      outlineVariant: Colors.dark.divider,
      error: Colors.dark.accentRed,
    },
  },
};

export const SurfacePresets = {
  card: {
    backgroundColor: Colors.dark.surface,
    borderColor: Colors.dark.border,
    borderWidth: 1,
    borderRadius: Radius.lg,
  },
  elevatedCard: {
    backgroundColor: Colors.dark.surfaceElevated,
    borderColor: Colors.dark.border,
    borderWidth: 1,
    borderRadius: Radius.xl,
  },
  pill: {
    backgroundColor: Colors.dark.backgroundSelected,
    borderColor: Colors.dark.border,
    borderWidth: 1,
    borderRadius: Radius.full,
  },
} as const;

export const BottomTabInset = Platform.select({ ios: 54, android: 78 }) ?? 0;
export const MaxContentWidth = 920;
