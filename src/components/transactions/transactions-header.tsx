import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppIconButton } from '@/components/ui/app-icon-button';
import type { AppIconName } from '@/components/ui/app-icon';
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
          <HeaderIconButton
            icon="chevron-left"
            onPress={onBackPress}
            accessibilityLabel="Go back"
            iconColor={theme.text}
          />
        )}
        <ThemedText style={styles.title}>Transactions</ThemedText>
      </View>

      <View style={styles.rightGroup}>
        {rightAccessory}
        <HeaderIconButton
          icon="square-check"
          onPress={onSelectPress}
          accessibilityLabel="Select multiple transactions"
          iconColor={theme.text}
        />
        <HeaderIconButton
          icon="plus"
          onPress={onAddPress}
          accessibilityLabel="Add transaction"
          backgroundColor={theme.backgroundElement}
          iconColor={theme.text}
        />
      </View>
    </ThemedView>
  );
}

interface IconButtonProps {
  icon: AppIconName;
  onPress: () => void;
  accessibilityLabel: string;
  backgroundColor?: string;
  iconColor?: string;
}

function HeaderIconButton({
  icon,
  onPress,
  accessibilityLabel,
  backgroundColor,
  iconColor,
}: IconButtonProps) {
  const theme = useTheme();

  return (
    <AppIconButton
      iconName={icon}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      iconColor={iconColor ?? theme.text}
      iconSize={18}
      style={[
        styles.iconButton,
        { backgroundColor: backgroundColor ?? theme.backgroundElement, borderColor: theme.border },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.one,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  iconButton: {
    minWidth: 36,
    minHeight: 36,
  },
});

