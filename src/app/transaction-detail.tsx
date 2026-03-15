import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppIcon } from '@/components/ui/app-icon';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TransactionDetail } from '@/components/transactions/transaction-detail';
import { mapTransactionRecordToUI, updateTransactionTags } from '@/store/slices/transactionSlice';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const items = useAppSelector((s) => s.transactions.items);

  const transaction = useMemo(() => {
    const record = items.find((r) => r._id === id);
    if (!record) return null;
    return mapTransactionRecordToUI(record);
  }, [items, id]);

  const handleTagsChange = (tagKeys: string[]) => {
    if (!id) return;
    return dispatch(updateTransactionTags({ id, tagKeys })).unwrap().then(() => {});
  };

  return (
    <ThemedView style={[styles.screen, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + Spacing.two,
            paddingLeft: insets.left + Spacing.three,
            paddingRight: insets.right + Spacing.three,
            borderBottomColor: theme.border,
          },
        ]}
      >
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        >
          <AppIcon name="chevron-left" size={24} color={theme.text} />
        </Pressable>

        <ThemedText style={styles.headerTitle}>Transaction</ThemedText>

        {/* Spacer to center title */}
        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      {transaction ? (
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingLeft: insets.left + Spacing.three,
              paddingRight: insets.right + Spacing.three,
              paddingBottom: insets.bottom + Spacing.four,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <TransactionDetail transaction={transaction} onTagsChange={handleTagsChange} />
        </ScrollView>
      ) : (
        <View style={styles.notFound}>
          <ThemedText themeColor="textMuted">Transaction not found.</ThemedText>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
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
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  headerRight: {
    width: 36,
  },
  scrollContent: {
    paddingTop: Spacing.three,
    gap: Spacing.two,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
});
