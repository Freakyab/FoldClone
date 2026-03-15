import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import type { FilterState, TransactionTypeFilter } from '@/components/transactions/types';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const DEFAULT_FILTER: FilterState = {
  sourceAccountIds: [],
  transactionType: 'both',
  tags: [],
  dateFrom: null,
  dateTo: null,
  onlyBookmarked: false,
  onlyCash: false,
  onlyWithNotes: false,
};

interface AccountSource {
  id: string;
  label: string;
  lastFour: string;
}

export interface TransactionFilterModalProps {
  isVisible: boolean;
  filter: FilterState;
  accounts: AccountSource[];
  /** Oldest transaction date — clamps the minimum selectable FROM date */
  oldestDate?: Date | null;
  /** Called immediately on every filter change — no separate apply step */
  onFilterChange: (filter: FilterState) => void;
  onReset: () => void;
  onClose: () => void;
}

const TRANSACTION_TYPE_OPTIONS: { value: TransactionTypeFilter; label: string }[] = [
  { value: 'incoming', label: 'Incoming' },
  { value: 'outgoing', label: 'Outgoing' },
  { value: 'both', label: 'Both' },
];

const TAG_OPTIONS: {
  value: string;
  label: string;
  icon: AppIconName;
}[] = [
  { value: 'SELF_TRANSFER', label: 'Self Transfer', icon: 'arrow-left-right' },
  { value: 'RETURN', label: 'Return', icon: 'refresh-ccw' },
  { value: 'PAYMENT', label: 'Payment', icon: 'credit-card' },
];

interface Preset {
  label: string;
  getDates: () => { from: Date; to: Date };
}

function buildPresets(): Preset[] {
  return [
    {
      label: '1 WEEK',
      getDates() {
        const to = startOfDay(new Date());
        const from = startOfDay(new Date());
        from.setDate(from.getDate() - 7);
        return { from, to };
      },
    },
    {
      label: '1 MONTH',
      getDates() {
        const to = startOfDay(new Date());
        const from = startOfDay(new Date());
        from.setMonth(from.getMonth() - 1);
        return { from, to };
      },
    },
    {
      label: '4 MONTHS',
      getDates() {
        const to = startOfDay(new Date());
        const from = startOfDay(new Date());
        from.setMonth(from.getMonth() - 4);
        return { from, to };
      },
    },
    {
      label: '1 YEAR',
      getDates() {
        const to = startOfDay(new Date());
        const from = startOfDay(new Date());
        from.setFullYear(from.getFullYear() - 1);
        return { from, to };
      },
    },
  ];
}

function startOfDay(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function endOfDay(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(23, 59, 59, 999);
  return copy;
}

/** Returns how many non-default values are set */
export function countActiveFilters(filter: FilterState): number {
  let count = 0;
  if (filter.sourceAccountIds.length > 0) count++;
  if (filter.transactionType !== 'both') count++;
  if (filter.tags.length > 0) count++;
  if (filter.dateFrom || filter.dateTo) count++;
  if (filter.onlyBookmarked) count++;
  if (filter.onlyCash) count++;
  if (filter.onlyWithNotes) count++;
  return count;
}

function isPresetActive(filter: FilterState, preset: Preset): boolean {
  if (!filter.dateFrom || !filter.dateTo) return false;
  const { from, to } = preset.getDates();
  return (
    filter.dateFrom.toDateString() === from.toDateString() &&
    filter.dateTo.toDateString() === to.toDateString()
  );
}

/* ─────────────────────────────────────────────────────── */

export function TransactionFilterModal({
  isVisible,
  filter,
  accounts,
  oldestDate,
  onFilterChange,
  onReset,
  onClose,
}: TransactionFilterModalProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  /** Which picker is open: null | 'from' | 'to' */
  const [activePicker, setActivePicker] = useState<'from' | 'to' | null>(null);

  const PRESETS = buildPresets();
  const today = startOfDay(new Date());
  const minDate = oldestDate ? startOfDay(oldestDate) : undefined;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: isVisible ? 0 : SCREEN_HEIGHT,
      useNativeDriver: true,
      tension: 65,
      friction: 12,
    }).start();
    if (!isVisible) setActivePicker(null);
  }, [isVisible, slideAnim]);

  /* ── Immediate updaters ── */

  const toggleAccount = useCallback(
    (id: string) => {
      onFilterChange({
        ...filter,
        sourceAccountIds: filter.sourceAccountIds.includes(id)
          ? filter.sourceAccountIds.filter(a => a !== id)
          : [...filter.sourceAccountIds, id],
      });
    },
    [filter, onFilterChange],
  );

  const setTransactionType = useCallback(
    (type: TransactionTypeFilter) => {
      onFilterChange({ ...filter, transactionType: type });
    },
    [filter, onFilterChange],
  );

  const toggleTag = useCallback(
    (tag: string) => {
      onFilterChange({
        ...filter,
        tags: filter.tags.includes(tag)
          ? filter.tags.filter((t) => t !== tag)
          : [...filter.tags, tag],
      });
    },
    [filter, onFilterChange],
  );

  const setField = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      onFilterChange({ ...filter, [key]: value });
    },
    [filter, onFilterChange],
  );

  function applyPreset(preset: Preset) {
    const { from, to } = preset.getDates();
    onFilterChange({ ...filter, dateFrom: from, dateTo: to });
    setActivePicker(null);
  }

  function handleDateChange(_event: DateTimePickerEvent, selected?: Date) {
    if (Platform.OS === 'android') setActivePicker(null);
    if (!selected) return;

    if (activePicker === 'from') {
      const newFrom = startOfDay(selected);
      const newTo =
        filter.dateTo && filter.dateTo < newFrom ? endOfDay(newFrom) : filter.dateTo;
      onFilterChange({ ...filter, dateFrom: newFrom, dateTo: newTo });
    } else if (activePicker === 'to') {
      const newTo = endOfDay(selected);
      const newFrom =
        filter.dateFrom && filter.dateFrom > newTo ? startOfDay(newTo) : filter.dateFrom;
      onFilterChange({ ...filter, dateFrom: newFrom, dateTo: newTo });
    }
  }

  function clearDates() {
    onFilterChange({ ...filter, dateFrom: null, dateTo: null });
    setActivePicker(null);
  }

  const activeCount = countActiveFilters(filter);
  const hasDateRange = !!filter.dateFrom || !!filter.dateTo;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor: theme.backgroundElement,
              paddingBottom: insets.bottom + Spacing.three,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Pressable onPress={() => undefined}>
            {/* ── Handle ── */}
            <View style={styles.handleRow}>
              <View style={[styles.handle, { backgroundColor: theme.border }]} />
            </View>

            {/* ── Title row ── */}
            <View style={[styles.titleRow, { paddingHorizontal: Spacing.three }]}>
              <Pressable
                onPress={onClose}
                style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
                accessibilityRole="button"
                accessibilityLabel="Close filter"
              >
                <AppIcon name="x" size={18} color={theme.text} />
              </Pressable>

              <ThemedText type="subtitle" style={styles.titleText}>
                Filter transactions
              </ThemedText>

              <Pressable
                onPress={onReset}
                style={({ pressed }) => [
                  styles.iconButton,
                  {
                    backgroundColor: activeCount > 0 ? `${theme.accentBlue}22` : 'transparent',
                    borderColor: activeCount > 0 ? theme.accentBlue : 'transparent',
                    borderWidth: 1,
                  },
                  pressed && styles.pressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Reset all filters"
              >
                <AppIcon
                  name="refresh-ccw"
                  size={16}
                  color={activeCount > 0 ? theme.accentBlue : theme.textMuted}
                />
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: Spacing.three }}
              keyboardShouldPersistTaps="handled"
            >
              {/* ─── Source ─── */}
              {accounts.length > 0 && (
                <>
                  <FilterSection label="Source" theme={theme}>
                    <View style={styles.chipRow}>
                      {accounts.map(acc => {
                        const active = filter.sourceAccountIds.includes(acc.id);
                        return (
                          <Pressable
                            key={acc.id}
                            onPress={() => toggleAccount(acc.id)}
                            style={({ pressed }) => [
                              styles.accountChip,
                              {
                                borderColor: active ? theme.accentBlue : theme.border,
                                backgroundColor: active
                                  ? `${theme.accentBlue}22`
                                  : theme.backgroundSelected,
                              },
                              pressed && styles.pressed,
                            ]}
                            accessibilityRole="button"
                            accessibilityLabel={`Account ending in ${acc.lastFour}`}
                            accessibilityState={{ selected: active }}
                          >
                            <View
                              style={[styles.accountDot, { backgroundColor: theme.accentRed }]}
                            />
                            <ThemedText
                              style={[
                                styles.accountChipText,
                                active && { color: theme.accentBlue },
                              ]}
                            >
                              **{acc.lastFour}
                            </ThemedText>
                          </Pressable>
                        );
                      })}
                    </View>
                  </FilterSection>
                  <SectionDivider theme={theme} />
                </>
              )}

              {/* ─── Transaction type ─── */}
              <FilterSection label="Transaction type" theme={theme}>
                <View
                  style={[
                    styles.segmentRow,
                    { backgroundColor: theme.backgroundSelected, borderColor: theme.border },
                  ]}
                >
                  {TRANSACTION_TYPE_OPTIONS.map(opt => {
                    const active = filter.transactionType === opt.value;
                    return (
                      <Pressable
                        key={opt.value}
                        onPress={() => setTransactionType(opt.value)}
                        style={({ pressed }) => [
                          styles.segmentOption,
                          active && { backgroundColor: theme.backgroundElement },
                          pressed && !active && styles.pressed,
                        ]}
                        accessibilityRole="button"
                        accessibilityState={{ selected: active }}
                      >
                        <ThemedText
                          style={[
                            styles.segmentText,
                            { color: active ? theme.accentBlue : theme.textMuted },
                            active && styles.segmentTextActive,
                          ]}
                        >
                          {opt.label}
                        </ThemedText>
                      </Pressable>
                    );
                  })}
                </View>
              </FilterSection>

              <SectionDivider theme={theme} />

              {/* ─── Tags & Icons ─── */}
              <FilterSection label="Tags & Icons" theme={theme}>
                <View style={styles.chipRow}>
                  {TAG_OPTIONS.map(opt => {
                    const active = filter.tags.includes(opt.value);
                    return (
                      <Pressable
                        key={String(opt.value)}
                        onPress={() => toggleTag(opt.value)}
                        style={({ pressed }) => [
                          styles.tagChip,
                          {
                            borderColor: active ? theme.accentBlue : theme.border,
                            backgroundColor: active
                              ? `${theme.accentBlue}22`
                              : theme.backgroundSelected,
                          },
                          pressed && styles.pressed,
                        ]}
                        accessibilityRole="button"
                        accessibilityState={{ selected: active }}
                      >
                        <AppIcon
                          name={opt.icon}
                          size={14}
                          color={active ? theme.accentBlue : theme.textMuted}
                        />
                        <ThemedText
                          style={[
                            styles.tagChipText,
                            { color: active ? theme.accentBlue : theme.text },
                          ]}
                        >
                          {opt.label}
                        </ThemedText>
                      </Pressable>
                    );
                  })}
                </View>
                {filter.tags.length === 0 && (
                  <ThemedText themeColor="textMuted" style={styles.centeredHint}>
                    Tap a tag above to filter by it.
                  </ThemedText>
                )}
              </FilterSection>

              <SectionDivider theme={theme} />

              {/* ─── Date Range ─── */}
              <FilterSection
                label="Range"
                theme={theme}
                rightNode={
                  hasDateRange ? (
                    <Pressable
                      onPress={clearDates}
                      style={({ pressed }) => [styles.clearDatesBtn, pressed && styles.pressed]}
                      accessibilityRole="button"
                      accessibilityLabel="Clear date range"
                    >
                      <AppIcon name="circle-x" size={14} color={theme.accentRed} />
                      <ThemedText style={[styles.clearDatesText, { color: theme.accentRed }]}>
                        Clear
                      </ThemedText>
                    </Pressable>
                  ) : null
                }
              >
                {/* Preset pills */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.presetsRow}
                >
                  {PRESETS.map(preset => {
                    const active = isPresetActive(filter, preset);
                    return (
                      <Pressable
                        key={preset.label}
                        onPress={() => applyPreset(preset)}
                        style={({ pressed }) => [
                          styles.presetChip,
                          {
                            borderColor: active ? theme.accentBlue : theme.border,
                            backgroundColor: active
                              ? `${theme.accentBlue}22`
                              : theme.backgroundSelected,
                          },
                          pressed && styles.pressed,
                        ]}
                        accessibilityRole="button"
                        accessibilityState={{ selected: active }}
                      >
                        <ThemedText
                          style={[
                            styles.presetChipText,
                            { color: active ? theme.accentBlue : theme.textMuted },
                            active && { fontWeight: '700' },
                          ]}
                        >
                          {preset.label}
                        </ThemedText>
                      </Pressable>
                    );
                  })}
                </ScrollView>

                {/* From / To chips */}
                <View style={styles.dateRangeRow}>
                  <DateChip
                    heading="FROM"
                    date={filter.dateFrom}
                    isOpen={activePicker === 'from'}
                    onPress={() =>
                      setActivePicker(prev => (prev === 'from' ? null : 'from'))
                    }
                    theme={theme}
                  />
                  <View style={[styles.dateArrow, { backgroundColor: theme.border }]} />
                  <DateChip
                    heading="TO"
                    date={filter.dateTo}
                    isOpen={activePicker === 'to'}
                    onPress={() =>
                      setActivePicker(prev => (prev === 'to' ? null : 'to'))
                    }
                    theme={theme}
                  />
                </View>

                {/* Inline spinner picker */}
                {activePicker !== null && (
                  <View
                    style={[
                      styles.pickerWrapper,
                      { backgroundColor: theme.backgroundSelected, borderColor: theme.border },
                    ]}
                  >
                    <View style={styles.pickerHeader}>
                      <ThemedText style={[styles.pickerLabel, { color: theme.accentBlue }]}>
                        {activePicker === 'from' ? 'Select FROM date' : 'Select TO date'}
                      </ThemedText>
                      <Pressable
                        onPress={() => setActivePicker(null)}
                        style={({ pressed }) => [styles.pickerDoneBtn, pressed && styles.pressed]}
                        accessibilityRole="button"
                        accessibilityLabel="Done"
                      >
                        <ThemedText style={[styles.pickerDoneText, { color: theme.accentBlue }]}>
                          Done
                        </ThemedText>
                      </Pressable>
                    </View>

                    <DateTimePicker
                      value={
                        activePicker === 'from'
                          ? (filter.dateFrom ?? today)
                          : (filter.dateTo ?? today)
                      }
                      mode="date"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={handleDateChange}
                      minimumDate={activePicker === 'from' ? minDate : (filter.dateFrom ?? minDate)}
                      maximumDate={activePicker === 'to' ? today : (filter.dateTo ?? today)}
                      themeVariant="dark"
                      style={styles.pickerControl}
                    />
                  </View>
                )}

                {(filter.dateFrom || filter.dateTo) && (
                  <View style={styles.dateRangeSummary}>
                    <AppIcon name="calendar" size={12} color={theme.textMuted} />
                    <ThemedText themeColor="textMuted" style={styles.dateRangeSummaryText}>
                      {`${filter.dateFrom ? formatDate(filter.dateFrom) : '…'} - ${filter.dateTo ? formatDate(filter.dateTo) : 'today'}`}
                    </ThemedText>
                  </View>
                )}
              </FilterSection>

              <SectionDivider theme={theme} />

              {/* ─── Only show… toggles ─── */}
              <FilterSection label="Only show transactions..." theme={theme}>
                <ToggleRow
                  label="Bookmarked"
                  icon="bookmark"
                  value={filter.onlyBookmarked}
                  onValueChange={v => setField('onlyBookmarked', v)}
                  theme={theme}
                />
                <View style={[styles.toggleDivider, { backgroundColor: theme.divider }]} />
                <ToggleRow
                  label="Cash transactions"
                  icon="wallet"
                  value={filter.onlyCash}
                  onValueChange={v => setField('onlyCash', v)}
                  theme={theme}
                />
                <View style={[styles.toggleDivider, { backgroundColor: theme.divider }]} />
                <ToggleRow
                  label="With notes"
                  icon="sticky-note"
                  value={filter.onlyWithNotes}
                  onValueChange={v => setField('onlyWithNotes', v)}
                  theme={theme}
                />
              </FilterSection>
            </ScrollView>

            {/* ─── Bottom bar ── */}
            <View
              style={[
                styles.bottomRow,
                { borderTopColor: theme.border, paddingHorizontal: Spacing.three },
              ]}
            >
              {activeCount > 0 && (
                <ThemedText themeColor="textMuted" style={styles.activeCountText}>
                  {activeCount} filter{activeCount === 1 ? '' : 's'} active
                </ThemedText>
              )}
              <Pressable
                onPress={onClose}
                style={({ pressed }) => [
                  styles.closeBarButton,
                  { backgroundColor: theme.accentBlue },
                  pressed && styles.pressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Done"
              >
                <ThemedText style={styles.closeBarText}>DONE</ThemedText>
              </Pressable>
            </View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

/* ─── Sub-components ─── */

function SectionDivider({ theme }: { theme: ReturnType<typeof useTheme> }) {
  return <View style={[styles.divider, { backgroundColor: theme.divider }]} />;
}

interface FilterSectionProps {
  label: string;
  rightNode?: React.ReactNode;
  theme: ReturnType<typeof useTheme>;
  children: React.ReactNode;
}

function FilterSection({ label, rightNode, theme, children }: FilterSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <ThemedText style={[styles.sectionLabel, { color: theme.text }]}>{label}</ThemedText>
        {rightNode}
      </View>
      {children}
    </View>
  );
}

interface DateChipProps {
  heading: string;
  date: Date | null;
  isOpen: boolean;
  theme: ReturnType<typeof useTheme>;
  onPress: () => void;
}

function DateChip({ heading, date, isOpen, theme, onPress }: DateChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.dateChip,
        {
          backgroundColor: isOpen
            ? `${theme.accentBlue}18`
            : theme.backgroundSelected,
          borderColor: isOpen
            ? theme.accentBlue
            : date
            ? theme.accentBlue
            : theme.border,
          borderWidth: isOpen || date ? 1.5 : 1,
        },
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${heading} date ${date ? formatDate(date) : 'not set'}`}
    >
      <ThemedText style={[styles.dateChipHeading, { color: theme.textMuted }]}>
        {heading}
      </ThemedText>
      <ThemedText
        style={[
          styles.dateChipValue,
          { color: date ? theme.text : theme.textMuted },
          (date || isOpen) && { color: isOpen ? theme.accentBlue : theme.text },
        ]}
      >
        {date ? formatDateShort(date) : 'Any'}
      </ThemedText>
    </Pressable>
  );
}

interface ToggleRowProps {
  label: string;
  icon: AppIconName;
  value: boolean;
  onValueChange: (v: boolean) => void;
  theme: ReturnType<typeof useTheme>;
}

function ToggleRow({ label, icon, value, onValueChange, theme }: ToggleRowProps) {
  return (
    <View style={styles.toggleRow}>
      <View style={styles.toggleLeft}>
        <AppIcon name={icon} size={18} color={theme.textMuted} />
        <ThemedText style={styles.toggleLabel}>{label}</ThemedText>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: theme.backgroundSelected, true: theme.accentBlue }}
        thumbColor={value ? '#FFFFFF' : theme.textMuted}
      />
    </View>
  );
}

/* ─── Helpers ─── */

function formatDate(date: Date): string {
  return date
    .toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    .toUpperCase();
}

function formatDateShort(date: Date): string {
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' });
}

/* ─── Styles ─── */

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.92,
    overflow: 'hidden',
  },
  handleRow: {
    alignItems: 'center',
    paddingTop: Spacing.two,
    paddingBottom: Spacing.one,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.two,
    gap: Spacing.two,
  },
  titleText: {
    flex: 1,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: Spacing.three,
  },
  section: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    gap: Spacing.two,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  accountChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 999,
    paddingHorizontal: Spacing.two,
    paddingVertical: 6,
    gap: 6,
  },
  accountDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  accountChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  segmentRow: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 3,
    overflow: 'hidden',
  },
  segmentOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.two,
    borderRadius: 10,
  },
  segmentText: {
    fontSize: 13,
  },
  segmentTextActive: {
    fontWeight: '600',
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 999,
    paddingHorizontal: Spacing.two,
    paddingVertical: 6,
  },
  tagChipIcon: {
    marginRight: 4,
  },
  tagChipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  centeredHint: {
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: Spacing.two,
  },

  /* Presets */
  presetsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    paddingVertical: 2,
  },
  presetChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: Spacing.two + 2,
    paddingVertical: 6,
  },
  presetChipText: {
    fontSize: 11,
    letterSpacing: 0.4,
  },

  /* Date range */
  dateRangeRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: Spacing.two,
  },
  dateArrow: {
    width: 1,
    alignSelf: 'stretch',
    marginVertical: 6,
  },
  dateChip: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
    alignItems: 'flex-start',
    gap: 2,
  },
  dateChipHeading: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  dateChipValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  clearDatesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clearDatesText: {
    fontSize: 13,
    fontWeight: '500',
  },
  dateRangeSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateRangeSummaryText: {
    fontSize: 12,
  },

  /* Inline picker */
  pickerWrapper: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginTop: Spacing.one,
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.one,
  },
  pickerLabel: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  pickerDoneBtn: {
    paddingVertical: 4,
    paddingHorizontal: Spacing.two,
  },
  pickerDoneText: {
    fontSize: 14,
    fontWeight: '700',
  },
  pickerControl: {
    width: '100%',
    height: 160,
  },

  /* Toggles */
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.two,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  toggleIcon: {
    width: 20,
  },
  toggleLabel: {
    fontSize: 15,
  },
  toggleDivider: {
    height: StyleSheet.hairlineWidth,
  },

  /* Bottom bar */
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.three,
    gap: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  activeCountText: {
    flex: 1,
    fontSize: 13,
  },
  closeBarButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    paddingVertical: Spacing.two + 2,
  },
  closeBarText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  pressed: {
    opacity: 0.7,
  },
});
