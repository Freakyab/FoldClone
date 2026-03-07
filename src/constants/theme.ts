/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#FFFFFF',
    backgroundElement: '#F4F4F5',
    backgroundSelected: '#E4E4E7',
    textSecondary: '#4B5563',
    border: '#E5E7EB',
    divider: '#E5E7EB',
    textMuted: '#6B7280',
    textDisabled: '#9CA3AF',
    accentBlue: '#3B82F6',
    accentGreen: '#4ADE80',
    accentYellow: '#FACC15',
    accentRed: '#E11D48',
    avatarBackground: '#E5E7EB',
  },
  dark: {
    text: '#FFFFFF',
    background: '#000000',
    backgroundElement: '#121212',
    backgroundSelected: '#1A1A1A',
    textSecondary: '#B3B3B3',
    border: '#2A2A2A',
    divider: '#242424',
    textMuted: '#8A8A8A',
    textDisabled: '#6B7280',
    accentBlue: '#3B82F6',
    accentGreen: '#4ADE80',
    accentYellow: '#FACC15',
    accentRed: '#E11D48',
    avatarBackground: '#FACC15',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

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
