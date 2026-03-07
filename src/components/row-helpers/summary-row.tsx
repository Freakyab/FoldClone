import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface SummaryRowProps {
  label: string;
  percent: number;
}

export function SummaryRow({ label, percent }: SummaryRowProps) {
  const theme = useTheme();

  return (
    <View style={styles.summaryRow}>
      <View style={[styles.categoryPill, { backgroundColor: theme.backgroundSelected, borderColor: theme.border }]}>
        <ThemedText type="small" themeColor="textSecondary">
          {label}
        </ThemedText>
      </View>
      <ThemedText type="smallBold">{percent}%</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  categoryPill: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderRadius: 999,
    borderWidth: 1,
  },
});

