import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AppIcon } from '@/components/ui/app-icon';
import { BaseCard, OverflowButton } from '@/components/ui/home';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatInr } from '@/utils/format-inr';

export interface CashFlowEntry {
  label: string;
  amount: number;
  tone?: 'positive' | 'negative' | 'neutral';
}

export interface CashFlowWidgetProps {
  monthLabel?: string;
  entries?: CashFlowEntry[];
  onOverflowPress?: () => void;
  isLoading?: boolean;
  helperText?: string | null;
}

const DEFAULT_ENTRIES: CashFlowEntry[] = [
  { label: 'Incoming', amount: 35700, tone: 'positive' },
  { label: 'Outgoing', amount: 18046, tone: 'negative' },
  { label: 'Invested', amount: 5000, tone: 'neutral' },
  { label: 'Left', amount: 12654, tone: 'neutral' },
];

function getDisplayAmount(entry: CashFlowEntry) {
  const formattedAmount = formatInr(entry.amount).replace('.00', '');

  if (entry.tone === 'positive') return `+ ${formattedAmount}`;
  if (entry.tone === 'negative') return `- ${formattedAmount}`;
  return formattedAmount;
}

export function CashFlowWidget({
  monthLabel = 'March 2026',
  entries = DEFAULT_ENTRIES,
  onOverflowPress = () => {},
  isLoading = false,
  helperText = null,
}: CashFlowWidgetProps) {
  const theme = useTheme();

  return (
    <BaseCard
      style={[
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
      ]}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <AppIcon name="arrow-left-right" size={15} color={theme.textMuted} />
          <ThemedText
            type="smallBold"
            style={[styles.headerTitle, { color: theme.text }]}>
            Cash Flow
          </ThemedText>
        </View>

        <OverflowButton
          onPress={onOverflowPress}
          accessibilityLabel="Cash flow menu"
        />
      </View>

      <ThemedText
        type="label"
        themeColor="textMuted"
        style={[styles.monthLabel, { color: theme.textMuted }]}>
        {isLoading ? 'Loading cash flow...' : monthLabel}
      </ThemedText>

      {helperText ? (
        <ThemedText
          type="small"
          themeColor="textMuted"
          style={[styles.helperText, { color: theme.textMuted }]}>
          {helperText}
        </ThemedText>
      ) : null}

      <View style={styles.entryList}>
        {entries.map((entry, index) => (
          <View key={entry.label}>
            <View style={styles.entryRow}>
              <ThemedText
                type="default"
                themeColor="textSecondary"
                style={[styles.entryLabel, { color: theme.textSecondary }]}>
                {entry.label}
              </ThemedText>
              <ThemedText
                type="bodyStrong"
                style={[
                  styles.entryAmount,
                  { color: theme.text },
                ]}>
                {getDisplayAmount(entry)}
              </ThemedText>
            </View>

            {index < entries.length - 1 ? (
              <View style={[styles.divider, { backgroundColor: theme.divider }]} />
            ) : null}
          </View>
        ))}
      </View>
    </BaseCard>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.three,
  },
  pressed: {
    opacity: 0.75,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  headerTitle: {
  },
  monthLabel: {
    marginTop: Spacing.one,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  helperText: {
    marginTop: Spacing.one,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    marginTop: Spacing.one,
  },
  badge: {
    width: 40,
    height: 32,
    borderRadius: Radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  entryList: {
    marginTop: Spacing.three,
  },
  entryRow: {
    gap: Spacing.one,
  },
  entryLabel: {
  },
  entryAmount: {
    fontSize: 22,
    lineHeight: 26,
    letterSpacing: -0.7,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginTop: Spacing.two,
    marginBottom: Spacing.two,
  },
});
