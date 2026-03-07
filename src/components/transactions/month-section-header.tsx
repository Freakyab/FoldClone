import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

interface MonthSectionHeaderProps {
  month: string;
  transactionCount: number;
}

export function MonthSectionHeader({ month, transactionCount }: MonthSectionHeaderProps) {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.month}>{month}</ThemedText>
      <ThemedText style={styles.count} themeColor="textMuted">
        {transactionCount} transactions
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  month: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  count: {
    fontSize: 13,
    fontWeight: '500',
  },
});
