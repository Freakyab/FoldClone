import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { TransactionsHeaderProps } from './types';

export function TransactionsHeader({
  onSelectPress,
  onAddPress,
  onBackPress,
  rightAccessory,
}: TransactionsHeaderProps) {
  const theme = useTheme();

  return (
    <ThemedView
      type="background"
      style={styles.container}
    >
      <View style={styles.leftGroup}>
        {onBackPress && (
          <IconButton
            icon="chevron-left"
            onPress={onBackPress}
            accessibilityLabel="Go back"
          />
        )}
        <ThemedText type="title">Transactions</ThemedText>
      </View>

      <View style={styles.rightGroup}>
        {rightAccessory}
        <IconButton
          icon="check-square"
          onPress={onSelectPress}
          accessibilityLabel="Select multiple transactions"
        />
        <IconButton
          icon="plus"
          onPress={onAddPress}
          accessibilityLabel="Add transaction"
          backgroundColor={theme.accentBlue}
          iconColor={theme.text}
        />
      </View>
    </ThemedView>
  );
}

interface IconButtonProps {
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
  accessibilityLabel: string;
  backgroundColor?: string;
  iconColor?: string;
}

function IconButton({
  icon,
  onPress,
  accessibilityLabel,
  backgroundColor,
  iconColor,
}: IconButtonProps) {
  const theme = useTheme();
  const bg = backgroundColor ?? theme.backgroundElement;
  const color = iconColor ?? theme.text;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.iconButton,
        { backgroundColor: bg, borderColor: theme.border },
        pressed && styles.pressed,
      ]}
    >
      <Feather
        name={icon}
        size={18}
        color={color}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.two,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.7,
  },
});

