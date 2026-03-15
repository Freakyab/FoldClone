import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Switch, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
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
  /** Called when tags change. May return a Promise; if it rejects, local tag state is reverted. */
  onTagsChange?: (tagKeys: string[]) => void | Promise<void>;
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
  onTagsChange,
}: TransactionDetailProps) {
  const [localNotes, setLocalNotes] = useState(transaction.notes ?? '');
  const [isExcluded, setIsExcluded] = useState(transaction.excludedFromCashFlow);
  const [tagSelectorVisible, setTagSelectorVisible] = useState(false);
  const [localTags, setLocalTags] = useState<string[]>((transaction.tags ?? []).slice(0, 1));

  useEffect(() => {
    setLocalTags((transaction.tags ?? []).slice(0, 1));
  }, [transaction.id, transaction.tags]);

  function handleToggle(next: boolean) {
    setIsExcluded(next);
    onToggleExcludeFromCashFlow?.(next);
  }

  function handleChangeNotes(text: string) {
    setLocalNotes(text);
    onChangeNotes?.(text);
  }

  async function handleTagSelect(tagId: string) {
    if (localTags[0] === tagId) {
      setTagSelectorVisible(false);
      return;
    }
    const prevTags = localTags;
    const nextTags = [tagId];
    setLocalTags(nextTags);
    setTagSelectorVisible(false);
    const result = onTagsChange?.(nextTags);
    if (result && typeof (result as Promise<unknown>).then === 'function') {
      try {
        await (result as Promise<void>);
      } catch {
        setLocalTags(prevTags);
      }
    }
  }

  async function handleRemoveTag(tagKey: string) {
    if (localTags[0] !== tagKey) return;
    const prevTags = localTags;
    const nextTags: string[] = [];
    setLocalTags(nextTags);
    const result = onTagsChange?.(nextTags);
    if (result && typeof (result as Promise<unknown>).then === 'function') {
      try {
        await (result as Promise<void>);
      } catch {
        setLocalTags(prevTags);
      }
    }
  }

  const isSelfTransfer = localTags.some(
    (k) => k === 'SELF_TRANSFER' || findTagSubItem(k)?.label?.toUpperCase() === 'SELF TRANSFER',
  );
  const selectedTagKey = localTags[0];
  const selectedTagItem = selectedTagKey ? findTagSubItem(selectedTagKey) : undefined;
  const accountPeriod = transaction.date.toLocaleDateString('en-IN', {
    month: 'short',
    year: 'numeric',
  });

  return (
    <View style={styles.root}>
      {/* ── Summary card ── */}
      <SummaryCard
        transaction={transaction}
        onPaidToEditPress={onPaidToEditPress}
        isSelfTransfer={isSelfTransfer}
        selectedTagKey={selectedTagKey}
        selectedTagLabel={selectedTagItem?.label}
        SelectedTagIcon={selectedTagItem?.Icon}
        onTagPress={() => setTagSelectorVisible(true)}
        onRemoveTag={selectedTagKey ? () => handleRemoveTag(selectedTagKey) : undefined}
      />

      <DetailOptionsCard
        accountPeriod={accountPeriod}
        onAccountInPress={onAccountInPress}
        onMoreDetailsPress={onMoreDetailsPress}
        onAddToGroupPress={onAddToGroupPress}
      />

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
        currentTagId={selectedTagKey}
        onSelect={(tagId) => handleTagSelect(tagId)}
        onClose={() => setTagSelectorVisible(false)}
        transactionType={transaction.type}
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
  isSelfTransfer?: boolean;
  selectedTagKey?: string;
  selectedTagLabel?: string;
  SelectedTagIcon?: React.ComponentType<{ size?: number; color?: string }>;
  onTagPress?: () => void;
  onRemoveTag?: () => void;
}

function SummaryCard({
  transaction,
  onPaidToEditPress,
  isSelfTransfer = false,
  selectedTagKey,
  selectedTagLabel,
  SelectedTagIcon,
  onTagPress,
  onRemoveTag,
}: SummaryCardProps) {
  const theme = useTheme();
  const { sign, currencySymbol, integerPart, decimalPart } = formatAmountParts(transaction.amount, transaction.type);
  const dateLabel = transaction.date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: '2-digit',
  });

  const maskedAccount = maskAccountId(transaction.accountId);

  return (
    <ThemedView
      type="backgroundElement"
      style={[styles.summaryCard, { borderColor: theme.border }]}
    >
      {/* Pin / bookmark icon top-right */}
      <View style={styles.summaryPinRow}>
        <AppIcon name="bookmark" size={16} color={theme.textMuted} />
      </View>

      {/* Amount — large display with superscript sign + currency */}
      <View style={styles.amountRow}>
        <ThemedText style={styles.amountSign}>{sign}</ThemedText>
        <ThemedText style={styles.amountCurrency}>{currencySymbol}</ThemedText>
        <ThemedText style={styles.amountInteger}>{integerPart}</ThemedText>
        {decimalPart ? (
          <ThemedText style={styles.amountDecimal}>.{decimalPart}</ThemedText>
        ) : null}
      </View>

      <View style={styles.tagsSection}>
        <View style={styles.tagChipRow}>
          <Pressable
            onPress={onTagPress}
            accessibilityRole="button"
            accessibilityLabel={selectedTagLabel ? `Edit tag ${selectedTagLabel}` : 'Add tag'}
            style={({ pressed }) => [
              styles.singleTagChip,
              {
                backgroundColor: selectedTagKey ? '#111111' : theme.background,
                borderColor: selectedTagKey ? '#111111' : theme.border,
              },
              pressed && styles.pressed,
            ]}
          >
            {selectedTagKey && selectedTagLabel && SelectedTagIcon ? (
              <>
                <SelectedTagIcon size={14} color="#FFFFFF" />
                <ThemedText style={[styles.singleTagChipText, { color: '#FFFFFF' }]}>
                  {selectedTagLabel.toUpperCase()}
                </ThemedText>
              </>
            ) : (
              <>
                <AppIcon name="search" size={14} color={theme.textMuted} />
                <ThemedText style={[styles.singleTagChipText, { color: theme.textMuted }]}>
                  ADD TAG
                </ThemedText>
              </>
            )}
          </Pressable>

          {selectedTagKey && onRemoveTag ? (
            <Pressable
              onPress={onRemoveTag}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={`Remove tag ${selectedTagLabel ?? selectedTagKey}`}
              style={({ pressed }) => [
                styles.singleTagRemove,
                { backgroundColor: theme.backgroundElement, borderColor: theme.border },
                pressed && styles.pressed,
              ]}
            >
              <AppIcon name="x" size={14} color={theme.textMuted} />
            </Pressable>
          ) : null}
        </View>
      </View>

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
              <AppIcon name="building-2" size={12} color={theme.textMuted} />
            </View>
            <ThemedText style={styles.gridValue} numberOfLines={1}>
              {maskedAccount}
            </ThemedText>
          </View>
        </View>

        {/* Vertical divider */}
        <View style={[styles.gridVerticalDivider, { backgroundColor: theme.border }]} />

        <View style={[styles.gridCell, styles.gridCellRight]}>
          <ThemedText type="small" themeColor="textMuted" style={styles.gridLabel}>
            ON
          </ThemedText>
          <ThemedText style={styles.gridValue} numberOfLines={1}>{dateLabel}</ThemedText>
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
              <AppIcon
                name="pencil"
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
              <AppIcon name="user-round" size={12} color={theme.text} />
            </View>
            <ThemedText style={styles.gridValue} numberOfLines={1}>{transaction.merchant}</ThemedText>
          </View>
        </View>
        <AppIcon name="chevron-right" size={20} color={theme.textMuted} />
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

interface DetailOptionsCardProps {
  accountPeriod: string;
  onAccountInPress?: () => void;
  onMoreDetailsPress?: () => void;
  onAddToGroupPress?: () => void;
}

function DetailOptionsCard({
  accountPeriod,
  onAccountInPress,
  onMoreDetailsPress,
  onAddToGroupPress,
}: DetailOptionsCardProps) {
  const theme = useTheme();

  return (
    <ThemedView
      type="backgroundElement"
      style={[styles.optionsCard, { borderColor: theme.border }]}
    >
      <OptionRow
        icon="grid-2x2"
        label="Account in"
        value={accountPeriod}
        onPress={onAccountInPress}
      />
      <View style={[styles.optionDivider, { backgroundColor: theme.border }]} />
      <OptionRow
        icon="info"
        label="More Details"
        onPress={onMoreDetailsPress}
      />
      <View style={[styles.optionDivider, { backgroundColor: theme.border }]} />
      <OptionRow
        icon="plus"
        label="Add transaction to group"
        onPress={onAddToGroupPress}
      />
    </ThemedView>
  );
}

interface OptionRowProps {
  icon: AppIconName;
  label: string;
  value?: string;
  onPress?: () => void;
}

function OptionRow({ icon, label, value, onPress }: OptionRowProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.optionRow, pressed && styles.pressed]}
    >
      <View style={styles.rowLeft}>
        <AppIcon name={icon} size={22} color={theme.textMuted} />
        <ThemedText style={styles.rowLabel}>{label}</ThemedText>
      </View>
      <View style={styles.rowRight}>
        {value ? (
          <ThemedText type="small" themeColor="textMuted">
            {value}
          </ThemedText>
        ) : null}
        <AppIcon name="chevron-right" size={20} color={theme.textMuted} />
      </View>
    </Pressable>
  );
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
          <AppIcon name="calendar" size={16} color={theme.textMuted} />
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
            <AppIcon name="file-text" size={14} color={theme.accentBlue} />
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
          <AppIcon name="bell-off" size={22} color={theme.textMuted} />
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

interface AmountParts {
  sign: string;
  currencySymbol: string;
  integerPart: string;
  decimalPart: string;
}

function formatAmountParts(amount: number, type: Transaction['type']): AmountParts {
  const sign = type === 'debit' ? '- ' : '+ ';
  const abs = Math.abs(amount);
  const fixed = abs.toFixed(2);
  const [integer, decimal] = fixed.split('.');

  const integerFormatted = new Intl.NumberFormat('en-IN').format(Number(integer));

  return {
    sign,
    currencySymbol: '₹',
    integerPart: integerFormatted,
    decimalPart: decimal === '00' ? '' : decimal,
  };
}

function maskAccountId(accountId: string): string {
  if (!accountId) return accountId;
  const clean = accountId.replace(/\s/g, '');
  if (clean.length <= 4) return `***${clean}`;
  const last4 = clean.slice(-4);
  return `***${last4}`;
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    gap: Spacing.three,
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

  // Large amount display
  amountRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: Spacing.two,
  },
  amountSign: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 46,
    marginRight: 2,
    opacity: 0.7,
  },
  amountCurrency: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 46,
    marginRight: 1,
  },
  amountInteger: {
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 42,
    letterSpacing: -1,
  },
  amountDecimal: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 34,
    letterSpacing: -0.5,
    marginLeft: 1,
  },

  tagsSection: {
    gap: Spacing.two,
    alignItems: 'center',
  },
  tagChipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  singleTagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
    minHeight: 36,
    paddingHorizontal: Spacing.three,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    maxWidth: '85%',
  },
  singleTagChipText: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  singleTagRemove: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    marginBottom: Spacing.four,
  },
  tagIcon: {
    marginRight: 5,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
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
    gap: Spacing.three,
  },
  gridCell: {
    flex: 1,
    gap: 8,
  },
  gridCellRight: {
    alignItems: 'flex-end',
  },
  gridLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
  gridValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  gridVerticalDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
  },
  bankIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridValue: {
    fontSize: 16,
    fontWeight: '600',
    flexShrink: 1,
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
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },

  optionsCard: {
    borderWidth: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: Spacing.three,
  },
  optionDivider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: Spacing.three,
  },

  // Shared row style
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
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
    minHeight: 60,
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
