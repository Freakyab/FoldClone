import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

interface MonthSectionHeaderProps {
  month: string;
  transactionCount: number;
}

export function MonthSectionHeader({ month, transactionCount }: MonthSectionHeaderProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { borderBottomColor: theme.border }]}>
      <View style={styles.content}>
        <ThemedText style={styles.month}>{month}</ThemedText>
        <ThemedText style={styles.count} themeColor="textMuted">
          {transactionCount} transactions
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingBottom: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 12,
  },
  month: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0,
  },
  count: {
    fontSize: 13,
    fontWeight: '700',
  },
});
