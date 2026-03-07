import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { TagBadge } from './tag-badge';
import type { Transaction } from './types';

interface TransactionListItemProps {
  transaction: Transaction;
  onPress: (transaction: Transaction) => void;
}

const TAG_ICON_MAP: Record<NonNullable<Transaction['tag']>, React.ComponentProps<typeof MaterialCommunityIcons>['name']> = {
  SELF_TRANSFER: 'sync',
  RETURN: 'refresh',
  PAYMENT: 'credit-card-outline',
};

export function TransactionListItem({ transaction, onPress }: TransactionListItemProps) {
  const theme = useTheme();
  const dateLabel = formatTimestamp(transaction.date);
  const tagIcon = transaction.tag ? TAG_ICON_MAP[transaction.tag] : undefined;

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

        {/* ── Row 2: amount (left) + tag / badges (right) ── */}
        <View style={styles.bodyRow}>
          <AmountLabel amount={transaction.amount} type={transaction.type} />

          <View style={styles.rightCluster}>
            {/* Tag badge or "Add Tag" prompt */}
            {transaction.tag ? (
              <TagBadge
                label={transaction.tag.replace(/_/g, ' ')}
                icon={tagIcon}
              />
            ) : (
              <AddTagBadge />
            )}

            {/* Excluded from cash-flow indicator */}
            {transaction.excludedFromCashFlow && (
              <MaterialCommunityIcons
                name="bell-off-outline"
                size={14}
                color={theme.textMuted}
              />
            )}

            {/* Bank source dot */}
            <View style={[styles.bankDot, { backgroundColor: '#E11D48' }]}>
              <MaterialCommunityIcons name="bank" size={9} color="#fff" />
            </View>

            {/* "…" more details cue */}
            <MaterialCommunityIcons
              name="dots-horizontal"
              size={18}
              color={theme.textMuted}
            />
          </View>
        </View>

        {/* ── Row 3: account ID + notes (truncated) ── */}
        <View style={styles.footerRow}>
          <View style={styles.accountRow}>
            <MaterialCommunityIcons
              name="credit-card-outline"
              size={11}
              color={theme.textMuted}
            />
            <ThemedText style={styles.accountText} themeColor="textMuted" numberOfLines={1}>
              {transaction.accountId}
            </ThemedText>
          </View>

          {transaction.notes ? (
            <View style={styles.notesRow}>
              <MaterialCommunityIcons
                name="note-text-outline"
                size={11}
                color={theme.textMuted}
              />
              <ThemedText
                style={styles.notesText}
                themeColor="textMuted"
                numberOfLines={1}
              >
                {transaction.notes}
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
      <MaterialCommunityIcons name="tag-plus-outline" size={11} color={theme.textMuted} />
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
  const isDebit = type === 'debit';
  const sign = isDebit ? '- ' : '+ ';
  const color = isDebit ? theme.text : theme.accentGreen;

  return (
    <ThemedText style={[styles.amount, { color }]}>
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
    paddingTop: Spacing.four,
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
    fontSize: 14,
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
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  rightCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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

  // Bank dot
  bankDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontWeight: '400',
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
    fontWeight: '400',
    flexShrink: 1,
  },
});
