import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { ThemedText } from '@/components/themed-text';
import { SummaryRow } from '@/components/row-helpers';
import { BaseCard, OverflowButton, WidgetHeader } from '@/components/ui/home';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface SpendingSummaryWidgetProps {
  onOverflowPress: () => void;
  monthLabel?: string;
  items?: { label: string; percent: number }[];
  isLoading?: boolean;
}

export function SpendingSummaryWidget({
  onOverflowPress,
  monthLabel = 'FEB 2026',
  items = [],
  isLoading = false,
}: SpendingSummaryWidgetProps) {
  const theme = useTheme();
  const displayItems =
    items.length > 0
      ? items
      : [
          { label: isLoading ? 'Loading...' : 'No spending yet', percent: 0 },
        ];

  return (
    <BaseCard>
      <WidgetHeader
        title="Spending Summary"
        right={<OverflowButton onPress={onOverflowPress} accessibilityLabel="Spending summary menu" />}
      />

      <ThemedText type="small" themeColor="textMuted" style={styles.summaryDate}>
        {isLoading ? 'Loading spending...' : monthLabel.toUpperCase()}
      </ThemedText>

      <View style={styles.iconRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Previous month spending"
          style={({ pressed }) => [
            styles.iconPill,
            { borderColor: theme.accentRed, backgroundColor: theme.backgroundSelected },
            pressed && styles.pressed,
          ]}
        >
          <AppIcon name="flame" size={18} color={theme.accentRed} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Current month spending"
          style={({ pressed }) => [
            styles.iconPill,
            { borderColor: theme.accentRed, backgroundColor: theme.backgroundSelected },
            pressed && styles.pressed,
          ]}
        >
          <AppIcon name="flame" size={18} color={theme.accentRed} />
        </Pressable>
      </View>

      <View style={styles.summaryList}>
        {displayItems.map((item) => (
          <SummaryRow key={item.label} label={item.label} percent={item.percent} />
        ))}
      </View>
    </BaseCard>
  );
}

const styles = StyleSheet.create({
  summaryDate: {
    textTransform: 'uppercase',
    marginTop: Spacing.one,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    marginTop: Spacing.one,
  },
  iconPill: {
    width: 32,
    height: 32,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  summaryList: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
});

