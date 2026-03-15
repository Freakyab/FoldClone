import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { TagBadge } from './tag-badge';
import { findTagSubItem } from './tag-data';
import type { Transaction } from './types';

interface TransactionListItemProps {
  transaction: Transaction;
  onPress: (transaction: Transaction) => void;
}

interface TransactionTagIconProps {
  size?: number;
  color?: string;
}

function createLegacyTagIcon(name: AppIconName) {
  return function LegacyTagIcon({ size = 11, color = '#FFFFFF' }: TransactionTagIconProps) {
    return <AppIcon name={name} size={size} color={color} />;
  };
}

const LEGACY_TAG_ICON_MAP: Record<string, React.ComponentType<TransactionTagIconProps>> = {
  SELF_TRANSFER: createLegacyTagIcon('arrow-left-right'),
  RETURN: createLegacyTagIcon('refresh-ccw'),
  PAYMENT: createLegacyTagIcon('credit-card'),
};

function getTagDisplay(tag: string | undefined): { label: string; Icon?: React.ComponentType<TransactionTagIconProps> } | null {
  if (!tag) return null;
  const fromData = findTagSubItem(tag);
  if (fromData) return { label: fromData.label, Icon: fromData.Icon };
  return { label: tag.replace(/_/g, ' '), Icon: LEGACY_TAG_ICON_MAP[tag] };
}

export function TransactionListItem({ transaction, onPress }: TransactionListItemProps) {
  const theme = useTheme();
  const dateLabel = formatTimestamp(transaction.date);
  const tagDisplay = getTagDisplay(transaction.tags?.[0]);
  const maskedAccount = maskAccountId(transaction.accountId);

  return (
    <Pressable
      onPress={() => onPress(transaction)}
      accessibilityRole="button"
      accessibilityLabel={`Open transaction ${transaction.merchant}`}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
    >
      <ThemedView
        type="backgroundElement"
        style={[styles.card, { borderColor: theme.border }]}
      >
        {/* ── Row 1: merchant name + timestamp ── */}
        <View style={styles.headerRow}>
          <ThemedText style={styles.merchant} numberOfLines={1}>
            {transaction.merchant}
          </ThemedText>
          <ThemedText style={styles.timestamp} themeColor="textMuted">
            {dateLabel}
          </ThemedText>
        </View>

        {/* ── Row 2: amount (left) + tag / metadata icons (right) ── */}
        <View style={styles.bodyRow}>
          <AmountLabel amount={transaction.amount} type={transaction.type} />

          <View style={styles.rightCluster}>
            {tagDisplay ? (
              <TagBadge
                label={tagDisplay.label}
                Icon={tagDisplay.Icon}
              />
            ) : (
              <AddTagBadge />
            )}

            {/* Excluded from cash-flow indicator */}
            {transaction.excludedFromCashFlow && (
              <AppIcon name="bell-off" size={14} color={theme.textMuted} />
            )}

            {transaction.notes ? (
              <AppIcon name="sticky-note" size={14} color={theme.accentRed} />
            ) : null}

            <AppIcon name="info" size={16} color={theme.textMuted} />
          </View>
        </View>

        {/* ── Row 3: secondary bank/reference information ── */}
        <View style={styles.footerRow}>
          <View style={styles.accountRow}>
            <AppIcon name="building-2" size={11} color={theme.textMuted} />
            <ThemedText style={styles.accountText} themeColor="textMuted" numberOfLines={1}>
              {`Bank ref ${maskedAccount}`}
            </ThemedText>
          </View>

          {transaction.category ? (
            <View style={styles.notesRow}>
              <AppIcon name="tag" size={11} color={theme.textMuted} />
              <ThemedText
                style={styles.notesText}
                themeColor="textMuted"
                numberOfLines={1}
              >
                {transaction.category}
              </ThemedText>
            </View>
          ) : null}
        </View>
      </ThemedView>
    </Pressable>
  );
}

// ─────────────────────────────────────────────
// Add Tag prompt badge
// ─────────────────────────────────────────────

function AddTagBadge() {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.addTagBadge,
        { borderColor: theme.border, backgroundColor: 'transparent' },
      ]}
    >
      <AppIcon name="tag" size={11} color={theme.textMuted} />
      <ThemedText style={styles.addTagText} themeColor="textMuted">
        Add Tag
      </ThemedText>
    </View>
  );
}

// ─────────────────────────────────────────────
// Amount label
// ─────────────────────────────────────────────

interface AmountLabelProps {
  amount: number;
  type: Transaction['type'];
}

function AmountLabel({ amount, type }: AmountLabelProps) {
  const theme = useTheme();
  const sign = type === 'debit' ? '- ' : '+ ';

  return (
    <ThemedText style={[styles.amount, { color: theme.text }]}>
      {sign}{formatCurrency(amount)}
    </ThemedText>
  );
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function formatTimestamp(date: Date): string {
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const time = date.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
  });

  if (isToday) return `Today, ${time}`;

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
  });
}

function formatCurrency(value: number): string {
  const abs = Math.abs(value);
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(abs);
  } catch {
    return `₹${abs.toFixed(2)}`;
  }
}

function maskAccountId(accountId: string): string {
  if (!accountId) return '';
  const clean = accountId.replace(/\s/g, '');
  const last4 = clean.slice(-4);
  return last4 ? `***${last4}` : clean;
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const styles = StyleSheet.create({
  pressable: {
    borderRadius: 14,
  },
  pressed: {
    opacity: 0.75,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.three,
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
  },

  // Row 1
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  merchant: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  timestamp: {
    fontSize: 11,
    fontWeight: '400',
    flexShrink: 0,
  },

  // Row 2
  bodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  amount: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  rightCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },

  // Add tag badge
  addTagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  addTagText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.2,
  },

  // Row 3
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    marginTop: 2,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    flexShrink: 1,
  },
  accountText: {
    fontSize: 11,
    fontWeight: '500',
  },
  notesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    flexShrink: 1,
    maxWidth: '55%',
  },
  notesText: {
    fontSize: 11,
    fontWeight: '500',
    flexShrink: 1,
  },
});
