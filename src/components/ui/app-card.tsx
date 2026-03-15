import React from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface AppCardProps extends React.PropsWithChildren {
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'elevated' | 'subtle';
  padding?: keyof typeof Spacing;
}

export function AppCard({
  children,
  style,
  variant = 'default',
  padding = 'four',
}: AppCardProps) {
  const theme = useTheme();

  return (
    <ThemedView
      style={[
        styles.base,
        {
          backgroundColor:
            variant === 'elevated'
              ? theme.surfaceElevated
              : variant === 'subtle'
                ? theme.backgroundElement
                : theme.surface,
          borderColor: theme.border,
          padding: Spacing[padding],
        },
        style,
      ]}>
      {children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderRadius: Radius.lg,
    gap: Spacing.two,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 0,
  },
});
