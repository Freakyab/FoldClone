import React, { useState } from 'react';
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Switch, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Transaction } from './types';
import { TagSelector } from './tag-selector';
import { findTagSubItem } from './tag-data';

interface TransactionDetailProps {
  transaction: Transaction;
  onToggleExcludeFromCashFlow?: (nextValue: boolean) => void;
  onChangeNotes?: (notes: string) => void;
  onAddReceipt?: () => void;
  onAccountInPress?: () => void;
  onMoreDetailsPress?: () => void;
  onAddToGroupPress?: () => void;
  onPaidToEditPress?: () => void;
  onTagChange?: (tagId: string, label: string) => void;
}

export function TransactionDetail({
  transaction,
  onToggleExcludeFromCashFlow,
  onChangeNotes,
  onAddReceipt,
  onAccountInPress,
  onMoreDetailsPress,
  onAddToGroupPress,
  onPaidToEditPress,
  onTagChange,
}: TransactionDetailProps) {
  const theme = useTheme();
  const [localNotes, setLocalNotes] = useState(transaction.notes ?? '');
  const [isExcluded, setIsExcluded] = useState(transaction.excludedFromCashFlow);
  const [tagSelectorVisible, setTagSelectorVisible] = useState(false);
  const [localTagId, setLocalTagId] = useState<string | undefined>(undefined);
  const [localTagLabel, setLocalTagLabel] = useState<string | undefined>(undefined);

  function handleToggle(next: boolean) {
    setIsExcluded(next);
    onToggleExcludeFromCashFlow?.(next);
  }

  function handleChangeNotes(text: string) {
    setLocalNotes(text);
    onChangeNotes?.(text);
  }

  function handleTagSelect(tagId: string, label: string) {
    setLocalTagId(tagId);
    setLocalTagLabel(label);
    onTagChange?.(tagId, label);
  }

  const isSelfTransfer = transaction.tag === 'SELF_TRANSFER';
  const accountPeriod = transaction.date.toLocaleDateString('en-IN', {
    month: 'short',
    year: 'numeric',
  });

  const displayTagId = localTagId;
  const displayTagLabel = localTagLabel ?? (localTagId ? findTagSubItem(localTagId)?.label : undefined);

  return (
    <View style={styles.root}>
      {/* ── Summary card ── */}
      <SummaryCard
        transaction={transaction}
        onPaidToEditPress={onPaidToEditPress}
      />

      {/* ── Add tags ── */}
      <Pressable
        onPress={() => setTagSelectorVisible(true)}
        accessibilityRole="button"
        accessibilityLabel="Add or change transaction tag"
        style={({ pressed }) => [
          styles.row,
          { backgroundColor: theme.backgroundElement, borderColor: theme.border },
          pressed && styles.pressed,
        ]}
      >
        <View style={styles.rowLeft}>
          <MaterialCommunityIcons
            name="tag-outline"
            size={22}
            color={displayTagId ? theme.accentBlue : theme.textMuted}
          />
          <ThemedText
            style={[
              styles.rowLabel,
              displayTagId && { color: theme.accentBlue },
            ]}
          >
            {displayTagLabel ? displayTagLabel : 'Add tags'}
          </ThemedText>
        </View>
        <View style={styles.rowRight}>
          {displayTagId && (
            <View
              style={[
                styles.tagPill,
                { backgroundColor: theme.backgroundSelected, borderColor: theme.border },
              ]}
            >
              {(() => {
                const item = findTagSubItem(displayTagId);
                if (!item) return null;
                const { Icon } = item;
                return <Icon size={12} color={theme.textMuted} />;
              })()}
            </View>
          )}
          <Feather
            name={displayTagId ? 'edit-2' : 'plus'}
            size={18}
            color={displayTagId ? theme.accentBlue : theme.textMuted}
          />
        </View>
      </Pressable>

      {/* ── Account in ── */}
      <Pressable
        onPress={onAccountInPress}
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.row,
          { backgroundColor: theme.backgroundElement, borderColor: theme.border },
          pressed && styles.pressed,
        ]}
      >
        <View style={styles.rowLeft}>
          <MaterialCommunityIcons
            name="view-grid-outline"
            size={22}
            color={theme.textMuted}
          />
          <ThemedText style={styles.rowLabel}>Account in</ThemedText>
        </View>
        <View style={styles.rowRight}>
          <ThemedText type="small" themeColor="textMuted">
            {accountPeriod}
          </ThemedText>
          <Feather name="chevron-right" size={20} color={theme.textMuted} />
        </View>
      </Pressable>

      {/* ── More Details ── */}
      <Pressable
        onPress={onMoreDetailsPress}
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.row,
          { backgroundColor: theme.backgroundElement, borderColor: theme.border },
          pressed && styles.pressed,
        ]}
      >
        <View style={styles.rowLeft}>
          <MaterialCommunityIcons
            name="account-details-outline"
            size={22}
            color={theme.textMuted}
          />
          <ThemedText style={styles.rowLabel}>More Details</ThemedText>
        </View>
        <Feather name="chevron-right" size={20} color={theme.textMuted} />
      </Pressable>

      {/* ── Add transaction to group ── */}
      <Pressable
        onPress={onAddToGroupPress}
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.row,
          { backgroundColor: theme.backgroundElement, borderColor: theme.border },
          pressed && styles.pressed,
        ]}
      >
        <View style={styles.rowLeft}>
          <MaterialCommunityIcons
            name="folder-plus-outline"
            size={22}
            color={theme.textMuted}
          />
          <ThemedText style={styles.rowLabel}>Add to Group</ThemedText>
        </View>
      </Pressable>

      {/* ── Notes + Add Receipt ── */}
      <NotesSection
        value={localNotes}
        onChangeText={handleChangeNotes}
        onAddReceipt={onAddReceipt}
      />

      {/* ── Exclude from Cash Flow ── */}
      <CashFlowToggle
        isExcluded={isExcluded}
        isSelfTransfer={isSelfTransfer}
        onToggle={handleToggle}
      />

      {/* ── Tag selector sheet ── */}
      <TagSelector
        visible={tagSelectorVisible}
        currentTagId={displayTagId}
        onSelect={handleTagSelect}
        onClose={() => setTagSelectorVisible(false)}
        transactionAmount={transaction.amount}
        transactionMerchant={transaction.merchant}
        transactionDate={transaction.date}
      />
    </View>
  );
}

// ─────────────────────────────────────────────
// Summary card
// ─────────────────────────────────────────────

interface SummaryCardProps {
  transaction: Transaction;
  onPaidToEditPress?: () => void;
}

function SummaryCard({ transaction, onPaidToEditPress }: SummaryCardProps) {
  const theme = useTheme();
  const amountLabel = formatAmount(transaction.amount, transaction.type);
  const dateLabel = transaction.date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: '2-digit',
  });

  const isSelfTransfer = transaction.tag === 'SELF_TRANSFER';

  return (
    <ThemedView
      type="backgroundElement"
      style={[styles.summaryCard, { borderColor: theme.border }]}
    >
      {/* Pin / bookmark icon top-right */}
      <View style={styles.summaryPinRow}>
        <Feather name="bookmark" size={14} color={theme.textMuted} />
      </View>

      {/* Amount */}
      <ThemedText style={styles.summaryAmount}>{amountLabel}</ThemedText>

      {/* Tag badge */}
      {transaction.tag && (
        <View
          style={[
            styles.tagBadge,
            { backgroundColor: theme.background, borderColor: theme.border },
          ]}
        >
          {isSelfTransfer && (
            <MaterialCommunityIcons
              name="sync"
              size={12}
              color={theme.textMuted}
              style={styles.tagIcon}
            />
          )}
          <ThemedText type="small" themeColor="textMuted" style={styles.tagText}>
            {transaction.tag.replace('_', ' ')}
          </ThemedText>
        </View>
      )}

      {/* FROM / ON row */}
      <View style={[styles.gridDivider, { borderColor: theme.border }]} />
      <View style={styles.gridRow}>
        <View style={styles.gridCell}>
          <ThemedText type="small" themeColor="textMuted" style={styles.gridLabel}>
            FROM
          </ThemedText>
          <View style={styles.gridValueRow}>
            <View
              style={[styles.bankIconCircle, { backgroundColor: theme.backgroundSelected }]}
            >
              <MaterialCommunityIcons
                name="bank-outline"
                size={12}
                color={theme.textMuted}
              />
            </View>
            <ThemedText style={styles.gridValue}>{transaction.accountId}</ThemedText>
          </View>
        </View>

        <View style={[styles.gridCell, styles.gridCellRight]}>
          <ThemedText type="small" themeColor="textMuted" style={styles.gridLabel}>
            ON
          </ThemedText>
          <ThemedText style={styles.gridValue}>{dateLabel}</ThemedText>
        </View>
      </View>

      {/* PAID TO row */}
      <View style={[styles.gridDivider, { borderColor: theme.border }]} />
      <View style={styles.paidToRow}>
        <View style={styles.gridCell}>
          <ThemedText type="small" themeColor="textMuted" style={styles.gridLabel}>
            PAID TO
          </ThemedText>
          <View style={styles.gridValueRow}>
            <Pressable
              onPress={onPaidToEditPress}
              accessibilityRole="button"
              style={({ pressed }) => [pressed && styles.pressed]}
            >
              <Feather
                name="edit-2"
                size={13}
                color={theme.accentBlue}
                style={styles.editIcon}
              />
            </Pressable>
            <View
              style={[
                styles.avatarCircle,
                { backgroundColor: theme.avatarBackground },
              ]}
            >
              <Ionicons name="person" size={12} color={theme.text} />
            </View>
            <ThemedText style={styles.gridValue}>{transaction.merchant}</ThemedText>
          </View>
        </View>
        <Feather name="chevron-right" size={20} color={theme.textMuted} />
      </View>
    </ThemedView>
  );
}

// ─────────────────────────────────────────────
// Notes section
// ─────────────────────────────────────────────

interface NotesSectionProps {
  value: string;
  onChangeText: (text: string) => void;
  onAddReceipt?: () => void;
}

function NotesSection({ value, onChangeText, onAddReceipt }: NotesSectionProps) {
  const theme = useTheme();

  return (
    <ThemedView
      type="backgroundElement"
      style={[styles.notesCard, { borderColor: theme.border }]}
    >
      {/* Header row */}
      <View style={styles.notesHeader}>
        <View style={styles.rowLeft}>
          <MaterialCommunityIcons
            name="calendar-blank-outline"
            size={16}
            color={theme.textMuted}
          />
          <ThemedText type="small" themeColor="textMuted" style={styles.notesLabel}>
            NOTES
          </ThemedText>
        </View>
        <Pressable
          onPress={onAddReceipt}
          disabled={!onAddReceipt}
          accessibilityRole="button"
          style={({ pressed }) => [pressed && styles.pressed]}
        >
          <View style={styles.rowLeft}>
            <MaterialCommunityIcons
              name="receipt"
              size={14}
              color={theme.accentBlue}
            />
            <ThemedText type="small" style={styles.addReceiptText}>
              ADD RECEIPT
            </ThemedText>
          </View>
        </Pressable>
      </View>

      {/* Input */}
      <TextInput
        multiline
        value={value}
        onChangeText={onChangeText}
        placeholder="Something about this transaction you would like to recall later?"
        placeholderTextColor={theme.textMuted}
        style={[styles.notesInput, { color: theme.text }]}
      />
    </ThemedView>
  );
}

// ─────────────────────────────────────────────
// Cash flow toggle
// ─────────────────────────────────────────────

interface CashFlowToggleProps {
  isExcluded: boolean;
  isSelfTransfer: boolean;
  onToggle: (next: boolean) => void;
}

function CashFlowToggle({ isExcluded, isSelfTransfer, onToggle }: CashFlowToggleProps) {
  const theme = useTheme();

  const description = isSelfTransfer
    ? 'Since you have tagged this transaction as Self Transfer, we have automatically excluded it from your Cash Flow.'
    : 'Exclude this transaction from your cash flow calculations.';

  return (
    <ThemedView
      type="backgroundElement"
      style={[styles.cashFlowCard, { borderColor: theme.border }]}
    >
      <View style={styles.cashFlowRow}>
        <View style={styles.rowLeft}>
          <MaterialCommunityIcons
            name="bell-off-outline"
            size={22}
            color={theme.textMuted}
          />
          <ThemedText style={styles.cashFlowLabel}>Exclude from Cash Flow</ThemedText>
        </View>
        <Switch
          value={isExcluded}
          onValueChange={onToggle}
          thumbColor={theme.text}
          trackColor={{ false: theme.border, true: theme.backgroundSelected }}
        />
      </View>

      <ThemedText type="small" themeColor="textMuted" style={styles.cashFlowDesc}>
        {description}
      </ThemedText>
    </ThemedView>
  );
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function formatAmount(amount: number, type: Transaction['type']): string {
  const sign = type === 'debit' ? '- ' : '+ ';
  const abs = Math.abs(amount);

  try {
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(abs);

    return `${sign}${formatted}`;
  } catch {
    return `${sign}₹${abs.toFixed(2)}`;
  }
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    gap: Spacing.two,
  },

  // Summary card
  summaryCard: {
    borderWidth: 1,
    borderRadius: 20,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.three,
    paddingHorizontal: Spacing.three,
    alignItems: 'center',
  },
  summaryPinRow: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.two,
  },
  summaryAmount: {
    fontSize: 40,
    fontWeight: '700',
    letterSpacing: -1,
    marginBottom: Spacing.two,
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.two,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    marginBottom: Spacing.three,
  },
  tagIcon: {
    marginRight: 5,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  gridDivider: {
    alignSelf: 'stretch',
    borderTopWidth: StyleSheet.hairlineWidth,
    marginBottom: Spacing.three,
  },
  gridRow: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    marginBottom: Spacing.three,
  },
  gridCell: {
    flex: 1,
    gap: 6,
  },
  gridCellRight: {
    alignItems: 'flex-end',
  },
  gridLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  gridValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  bankIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  paidToRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
  },
  editIcon: {
    marginRight: 4,
  },
  avatarCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },

  // Shared row style
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: Spacing.three,
    borderRadius: 20,
    borderWidth: 1,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: '500',
  },

  tagPill: {
    width: 26,
    height: 26,
    borderRadius: 7,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  pressed: {
    opacity: 0.7,
  },

  // Notes
  notesCard: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.three,
    gap: Spacing.two,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  addReceiptText: {
    color: '#3B82F6',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  notesInput: {
    minHeight: 56,
    textAlignVertical: 'top',
    fontSize: 15,
    lineHeight: 22,
  },

  // Cash flow
  cashFlowCard: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.three,
    gap: Spacing.two,
  },
  cashFlowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cashFlowLabel: {
    fontSize: 17,
    fontWeight: '500',
  },
  cashFlowDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
});
