import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BaseCard, MiniLine } from '@/components/ui/home';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatInr } from '@/utils/format-inr';

export interface NetWorthWidgetProps {
  /** Profile.specificId from backend (5-char uppercase identifier) */
  specificId?: string;
  userName?: string;
  total?: number;
  chartValues?: number[];
  chartLabel?: string;
  monthChange?: number;
  yearChange?: number;
  balance?: number;
  debt?: number;
  isLoading?: boolean;
}

function formatSignedAmount(amount: number) {
  if (amount === 0) return formatInr(0).replace('.00', '');
  const prefix = amount > 0 ? '+ ' : '- ';
  return `${prefix}${formatInr(Math.abs(amount)).replace('.00', '')}`;
}

function getDisplayName(userName?: string, specificId?: string) {
  const safeName = userName?.trim();
  const idCaps = specificId?.trim() ? specificId.trim().toUpperCase() : '';
  // Top: user name (bold). Bottom: specificId in small capitals or fallback.
  return {
    title: safeName || 'User',
    subtitle: idCaps || 'Your finances',
    isSpecificId: Boolean(idCaps),
  };
}

function Metric({
  label,
  value,
  tone = 'default',
}: {
  label: string;
  value: string;
  tone?: 'default' | 'positive' | 'negative';
}) {
  const theme = useTheme();
  return (
    <View style={styles.metricCell}>
      <ThemedText
        type="smallBold"
        style={[
          styles.metricValue,
          tone === 'negative'
            ? { color: theme.accentRed }
            : tone === 'positive'
              ? { color: theme.accentGreen }
              : { color: theme.text },
        ]}>
        {value}
      </ThemedText>
      <ThemedText
        type="label"
        themeColor="textMuted"
        style={[styles.metricLabel, { color: theme.textMuted }]}>
        {label}
      </ThemedText>
    </View>
  );
}

export function NetWorthWidget({
  specificId,
  userName,
  total = 0,
  chartValues = [0, 0],
  chartLabel = 'Last 180 days',
  monthChange = 0,
  yearChange = 0,
  balance = 0,
  debt = 0,
  isLoading = false,
}: NetWorthWidgetProps) {
  const theme = useTheme();
  const displayName = getDisplayName(userName, specificId);
  const safeChartValues = chartValues.length > 1 ? chartValues : [0, 0];

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
        <View>
          <ThemedText type="default" style={[styles.headerTitle, { color: theme.text }]}>
            {displayName.title}
          </ThemedText>
          <ThemedText
            type="small"
            themeColor="textMuted"
            style={[
              displayName.isSpecificId ? styles.headerSubSmallCaps : styles.headerSub,
              { color: theme.textMuted },
            ]}>
            {isLoading ? 'Loading net worth...' : displayName.subtitle}
          </ThemedText>
        </View>
        <View style={styles.headerRight}>
          <ThemedText
            type="subtitle"
            style={[styles.netWorthAmount, { color: theme.text }]}>
            {formatInr(total).replace('.00', '')}
          </ThemedText>
          <ThemedText
            type="small"
            themeColor="textMuted"
            style={[styles.netWorthLabel, { color: theme.textMuted }]}>
            Net worth
          </ThemedText>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <MiniLine values={safeChartValues} height={88} strokeWidth={2.4} />
        <View style={styles.captionRow}>
          <View style={[styles.captionLine, { backgroundColor: theme.border }]} />
          <ThemedText
            type="small"
            themeColor="textMuted"
            style={[styles.chartCaption, { color: theme.textMuted }]}>
            {chartLabel}
          </ThemedText>
          <View style={[styles.captionLine, { backgroundColor: theme.border }]} />
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <View style={styles.metricsRow}>
        <Metric
          label="THIS MONTH"
          value={formatSignedAmount(monthChange)}
          tone={monthChange < 0 ? 'negative' : monthChange > 0 ? 'positive' : 'default'}
        />
        <Metric
          label="THIS YEAR"
          value={formatSignedAmount(yearChange)}
          tone={yearChange < 0 ? 'negative' : yearChange > 0 ? 'positive' : 'default'}
        />
        <Metric label="BALANCE" value={formatInr(balance).replace('.00', '')} />
        <Metric label="DEBT" value={formatInr(debt).replace('.00', '')} />
      </View>
    </BaseCard>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingTop: Spacing.three,
    paddingBottom: Spacing.three,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.three,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  headerSub: {
    fontSize: 12,
    marginTop: 2,
    letterSpacing: 0.2,
  },
  headerSubSmallCaps: {
    fontSize: 10,
    marginTop: 2,
    letterSpacing: 1.2,
    fontWeight: '500',
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  netWorthAmount: {
    letterSpacing: 0.5,
  },
  netWorthLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  chartContainer: {
    marginBottom: Spacing.one,
  },
  captionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.one,
    marginBottom: Spacing.one,
  },
  captionLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  chartCaption: {
    fontSize: 10,
    letterSpacing: 0.4,
    marginHorizontal: 8,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginBottom: Spacing.three,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  metricCell: {
    alignItems: 'flex-start',
    flex: 1,
  },
  metricValue: {
    fontSize: 13,
    letterSpacing: 0.1,
  },
  metricLabel: {
    fontSize: 9,
    marginTop: 3,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
});