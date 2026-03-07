import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { MonthSectionHeader } from '@/components/transactions/month-section-header';
import { TransactionDetail } from '@/components/transactions/transaction-detail';
import { TransactionListItem } from '@/components/transactions/transaction-list-item';
import { TransactionSearchBar } from '@/components/transactions/transaction-search-bar';
import { TransactionsHeader } from '@/components/transactions/transactions-header';
import { TransactionsTabSwitcher } from '@/components/transactions/transactions-tab-switcher';
import type { MonthSection, Transaction, TransactionsState } from '@/components/transactions/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTransactions, mapTransactionRecordToUI } from '@/store/slices/transactionSlice';

/** Flattened row for FlatList: section header or transaction card */
type TransactionListRow =
  | { type: 'section'; id: string; month: string; transactionCount: number }
  | { type: 'transaction'; id: string; transaction: Transaction };

export default function TransactionsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const token = useAppSelector((s) => s.user.token);
  const { items, status, error } = useAppSelector((s) => s.transactions);
  const listRef = useRef<FlatList<TransactionListRow>>(null);

  const [state, setState] = useState<TransactionsState>({
    selectedIds: [],
    searchQuery: '',
    activeTab: 'all',
    monthSections: [],
  });

  // Detail page state
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (token) {
      dispatch(fetchTransactions());
    }
  }, [token, dispatch]);

  const allTransactions = useMemo<Transaction[]>(() => {
    return items.map(mapTransactionRecordToUI);
  }, [items]);

  const filteredSections = useMemo<MonthSection[]>(() => {
    const query = state.searchQuery.trim().toLowerCase();

    const filtered = allTransactions.filter(tx => {
      if (!query) return true;

      const haystack = [
        tx.merchant,
        tx.category,
        tx.notes,
        tx.tag,
        tx.accountId,
        String(tx.amount),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });

    const byKey = new Map<string, Transaction[]>();

    for (const tx of filtered) {
      const key = `${tx.date.getFullYear()}-${tx.date.getMonth()}`;
      const bucket = byKey.get(key);
      if (bucket) {
        bucket.push(tx);
      } else {
        byKey.set(key, [tx]);
      }
    }

    const sections: MonthSection[] = [];

    for (const [, transactions] of byKey) {
      const first = transactions[0];
      const monthLabel = first.date.toLocaleDateString('en-IN', {
        month: 'long',
        year: 'numeric',
      });

      sections.push({
        month: monthLabel,
        transactionCount: transactions.length,
        transactions,
      });
    }

    sections.sort((a, b) => {
      const aTime = a.transactions[0]?.date.getTime() ?? 0;
      const bTime = b.transactions[0]?.date.getTime() ?? 0;
      return bTime - aTime;
    });

    return sections;
  }, [allTransactions, state.searchQuery]);

  // Flat ordered list of all transactions for prev/next navigation
  const allTransactionsList = useMemo<Transaction[]>(() => {
    const txs: Transaction[] = [];
    for (const section of filteredSections) {
      for (const tx of section.transactions) {
        txs.push(tx);
      }
    }
    return txs;
  }, [filteredSections]);

  const selectedIndex = useMemo(() =>
    selectedTransaction
      ? allTransactionsList.findIndex((t) => t.id === selectedTransaction.id)
      : -1,
    [allTransactionsList, selectedTransaction],
  );

  const handleOpenTransaction = useCallback((transaction: Transaction) => {
    setSelectedTransaction(transaction);
    slideAnim.setValue(1);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 68,
      friction: 12,
    }).start();
  }, [slideAnim]);

  const handleCloseDetail = useCallback(() => {
    Animated.spring(slideAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 68,
      friction: 12,
    }).start(() => setSelectedTransaction(null));
  }, [slideAnim]);

  const handlePrevTransaction = useCallback(() => {
    if (selectedIndex > 0) {
      setSelectedTransaction(allTransactionsList[selectedIndex - 1]);
    }
  }, [selectedIndex, allTransactionsList]);

  const handleNextTransaction = useCallback(() => {
    if (selectedIndex < allTransactionsList.length - 1) {
      setSelectedTransaction(allTransactionsList[selectedIndex + 1]);
    }
  }, [selectedIndex, allTransactionsList]);

  const flattenedList = useMemo<TransactionListRow[]>(() => {
    const rows: TransactionListRow[] = [];
    for (const section of filteredSections) {
      rows.push({
        type: 'section',
        id: `section-${section.month}`,
        month: section.month,
        transactionCount: section.transactionCount,
      });
      for (const tx of section.transactions) {
        rows.push({ type: 'transaction', id: tx.id, transaction: tx });
      }
    }
    return rows;
  }, [filteredSections]);

  const renderItem = useCallback(
    ({ item }: { item: TransactionListRow }) => {
      if (item.type === 'section') {
        return (
          <View style={styles.sectionRow}>
            <MonthSectionHeader
              month={item.month}
              transactionCount={item.transactionCount}
            />
          </View>
        );
      }
      return (
        <View style={styles.transactionRow}>
          <TransactionListItem
            transaction={item.transaction}
            onPress={handleOpenTransaction}
          />
        </View>
      );
    },
    [handleOpenTransaction],
  );

  const keyExtractor = useCallback((item: TransactionListRow) => item.id, []);

  function handleSearchChange(searchQuery: string) {
    setState(prev => ({ ...prev, searchQuery }));
  }

  function handleTabChange(activeTab: TransactionsState['activeTab']) {
    setState(prev => ({ ...prev, activeTab }));
  }

  function handleSelectPress() {}

  function handleAddPress() {}

  return (
    <ThemedView style={[styles.screen, { backgroundColor: theme.background }]}>
      {/* ── Fixed header section ── */}
      <View
        style={[
          styles.headerSection,
          {
            paddingTop: insets.top + Spacing.three,
            paddingLeft: insets.left + Spacing.three,
            paddingRight: insets.right + Spacing.three,
          },
        ]}
      >
        <TransactionsHeader
          onSelectPress={handleSelectPress}
          onAddPress={handleAddPress}
        />

        <TransactionSearchBar
          value={state.searchQuery}
          onChangeText={handleSearchChange}
          onFilterPress={() => undefined}
        />

        <TransactionsTabSwitcher
          activeTab={state.activeTab}
          onTabChange={handleTabChange}
        />
      </View>

      {/* ── Status states ── */}
      {status === 'loading' && items.length === 0 && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.accentBlue} />
          <ThemedText themeColor="textMuted" style={styles.loadingText}>
            Loading transactions…
          </ThemedText>
        </View>
      )}

      {status === 'failed' && error && items.length === 0 && (
        <ThemedText themeColor="accentRed" style={styles.errorText}>
          {error}
        </ThemedText>
      )}

      {flattenedList.length === 0 && !(status === 'loading' && items.length === 0) && (
        <ThemedText themeColor="textMuted" style={styles.emptyState}>
          No transactions found.
        </ThemedText>
      )}

      {/* ── Scrollable list — FlatList fills all remaining space ── */}
      {flattenedList.length > 0 && (
        <FlatList
          ref={listRef}
          data={flattenedList}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          decelerationRate="normal"
          scrollEventThrottle={16}
          contentContainerStyle={[
            styles.listContent,
            {
              paddingLeft: insets.left + Spacing.three,
              paddingRight: insets.right + Spacing.three,
              paddingBottom: insets.bottom + BottomTabInset + Spacing.three,
            },
          ]}
        />
      )}

      {/* ── Full-screen transaction detail overlay ── */}
      {selectedTransaction && (
        <Animated.View
          style={[
            styles.detailOverlay,
            { backgroundColor: theme.background },
            {
              transform: [
                {
                  translateX: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 400],
                  }),
                },
              ],
            },
          ]}
        >
          {/* Header */}
          <View
            style={[
              styles.detailHeader,
              {
                paddingTop: insets.top + Spacing.two,
                paddingLeft: insets.left + Spacing.three,
                paddingRight: insets.right + Spacing.three,
                borderBottomColor: theme.border,
              },
            ]}
          >
            <Pressable
              onPress={handleCloseDetail}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
            >
              <Feather name="chevron-left" size={24} color={theme.text} />
            </Pressable>

            <ThemedText style={styles.detailTitle}>Transaction</ThemedText>

            {/* Prev / Next navigation */}
            <View style={styles.navButtons}>
              <Pressable
                onPress={handlePrevTransaction}
                disabled={selectedIndex <= 0}
                accessibilityRole="button"
                accessibilityLabel="Previous transaction"
                style={({ pressed }) => [
                  styles.navButton,
                  { borderColor: theme.border, backgroundColor: theme.backgroundElement },
                  pressed && styles.pressed,
                  selectedIndex <= 0 && styles.navButtonDisabled,
                ]}
              >
                <Feather
                  name="chevron-left"
                  size={18}
                  color={selectedIndex <= 0 ? theme.textMuted : theme.text}
                />
              </Pressable>
              <Pressable
                onPress={handleNextTransaction}
                disabled={selectedIndex >= allTransactionsList.length - 1}
                accessibilityRole="button"
                accessibilityLabel="Next transaction"
                style={({ pressed }) => [
                  styles.navButton,
                  { borderColor: theme.border, backgroundColor: theme.backgroundElement },
                  pressed && styles.pressed,
                  selectedIndex >= allTransactionsList.length - 1 && styles.navButtonDisabled,
                ]}
              >
                <Feather
                  name="chevron-right"
                  size={18}
                  color={selectedIndex >= allTransactionsList.length - 1 ? theme.textMuted : theme.text}
                />
              </Pressable>
            </View>
          </View>

          {/* Scrollable content */}
          <Animated.ScrollView
            contentContainerStyle={[
              styles.detailScrollContent,
              {
                paddingLeft: insets.left + Spacing.three,
                paddingRight: insets.right + Spacing.three,
                paddingBottom: insets.bottom + Spacing.four,
              },
            ]}
            showsVerticalScrollIndicator={false}
          >
            <TransactionDetail transaction={selectedTransaction} />
          </Animated.ScrollView>
        </Animated.View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },

  headerSection: {
    gap: Spacing.two,
    paddingBottom: Spacing.two,
  },

  listContent: {
    gap: Spacing.two,
    paddingTop: Spacing.one,
  },

  sectionRow: {
    paddingTop: Spacing.two,
    paddingBottom: Spacing.one,
  },

  transactionRow: {
    marginBottom: Spacing.three,
  },

  emptyState: {
    marginTop: Spacing.three,
    textAlign: 'center',
    paddingHorizontal: Spacing.three,
  },
  loadingContainer: {
    marginTop: Spacing.three,
    alignItems: 'center',
    gap: Spacing.two,
  },
  loadingText: {
    fontSize: 14,
  },
  errorText: {
    marginTop: Spacing.two,
    textAlign: 'center',
    paddingHorizontal: Spacing.three,
  },

  pressed: {
    opacity: 0.7,
  },

  // Detail overlay
  detailOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  detailTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  navButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonDisabled: {
    opacity: 0.35,
  },
  detailScrollContent: {
    paddingTop: Spacing.three,
  },
});
