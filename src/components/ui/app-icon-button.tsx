import React from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface AppIconButtonProps {
  icon?: React.ReactNode;
  iconName?: AppIconName;
  iconColor?: string;
  iconSize?: number;
  onPress?: () => void;
  active?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export function AppIconButton({
  icon,
  iconName,
  iconColor,
  iconSize = 20,
  onPress,
  active = false,
  disabled = false,
  style,
  accessibilityLabel,
}: AppIconButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [pressed && !disabled && styles.pressed, disabled && styles.disabled]}>
      <ThemedView
        style={[
          styles.button,
          {
            backgroundColor: active ? theme.backgroundSelected : theme.backgroundElement,
            borderColor: active ? theme.textMuted : theme.border,
          },
          style,
        ]}>
        <View style={styles.icon}>
          {icon ? icon : iconName ? <AppIcon name={iconName} size={iconSize} color={iconColor ?? theme.text} /> : null}
        </View>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 44,
    minHeight: 44,
    padding: Spacing.two,
    borderWidth: 1,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.82,
  },
  disabled: {
    opacity: 0.5,
  },
});
