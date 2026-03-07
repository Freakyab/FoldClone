import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import type { TransactionType } from './types';

interface AmountTextProps {
  amount: number;
  type: TransactionType;
}

export function AmountText({ amount, type }: AmountTextProps) {
  const theme = useTheme();
  const isDebit = type === 'debit';
  const sign = isDebit ? '-' : '+';
  const formatted = formatCurrency(amount);

  const color = isDebit ? theme.textMuted : theme.text;

  return (
    <Text
      style={[
        styles.amount,
        { color },
        isDebit && styles.debit,
      ]}
    >
      {sign}
      {formatted}
    </Text>
  );
}

function formatCurrency(value: number): string {
  const abs = Math.abs(value);

  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    })
      .format(abs)
      .replace('₹', '₹');
  } catch {
    return `₹${abs.toFixed(2)}`;
  }
}

const styles = StyleSheet.create({
  amount: {
    fontSize: 18,
    fontWeight: '700',
  },
  debit: {
    opacity: 0.9,
  },
});

