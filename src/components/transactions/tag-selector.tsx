import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import {
  TAG_CATEGORIES,
  MOST_USED_TAG_IDS,
  findTagSubItem,
} from './tag-data';
import type { TagCategory, TagSubItem } from './tag-data';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface TagSelectorProps {
  visible: boolean;
  currentTagId?: string;
  onSelect: (tagId: string, label: string) => void;
  onClose: () => void;
  transactionAmount?: number;
  transactionMerchant?: string;
  transactionDate?: Date;
}

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────

export function TagSelector({
  visible,
  currentTagId,
  onSelect,
  onClose,
  transactionAmount,
  transactionMerchant,
  transactionDate,
}: TagSelectorProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<TextInput>(null);

  const mostUsedItems = useMemo<TagSubItem[]>(() => {
    return MOST_USED_TAG_IDS.map(id => findTagSubItem(id)).filter(Boolean) as TagSubItem[];
  }, []);

  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return TAG_CATEGORIES;

    return TAG_CATEGORIES.map(cat => {
      const catMatches = cat.label.toLowerCase().includes(q);
      const matchingSubItems = cat.subItems.filter(s =>
        s.label.toLowerCase().includes(q)
      );
      if (!catMatches && matchingSubItems.length === 0) return null;
      return { ...cat, subItems: catMatches ? cat.subItems : matchingSubItems };
    }).filter(Boolean) as TagCategory[];
  }, [searchQuery]);

  const handleSubItemPress = useCallback((item: TagSubItem) => {
    onSelect(item.id, item.label);
    onClose();
    setSearchQuery('');
  }, [onSelect, onClose]);

  const handleClose = useCallback(() => {
    Keyboard.dismiss();
    onClose();
    setSearchQuery('');
  }, [onClose]);

  const formatAmount = (amount: number) => {
    try {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(Math.abs(amount));
    } catch {
      return `₹${Math.abs(amount)}`;
    }
  };

  const dateLabel = transactionDate?.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.backdrop} onPress={handleClose} />

        <View
          style={[
            styles.sheet,
            {
              backgroundColor: theme.background,
              paddingBottom: insets.bottom + Spacing.three,
            },
          ]}
        >
          {/* ── Handle bar ── */}
          <View style={styles.handleBarContainer}>
            <View style={[styles.handleBar, { backgroundColor: theme.border }]} />
          </View>

          {/* ── Header ── */}
          <View style={styles.header}>
            <Pressable
              onPress={handleClose}
              hitSlop={12}
              style={({ pressed }) => [styles.headerBtn, pressed && styles.pressed]}
            >
              <Feather name="x" size={20} color={theme.text} />
            </Pressable>

            <ThemedText style={styles.headerTitle}>Tag transaction</ThemedText>

            <Pressable
              hitSlop={12}
              style={({ pressed }) => [styles.headerBtn, pressed && styles.pressed]}
            >
              <Feather name="check" size={20} color={theme.accentGreen} />
            </Pressable>
          </View>

          {/* ── Transaction preview card ── */}
          {(transactionMerchant || transactionAmount !== undefined) && (
            <View
              style={[
                styles.previewCard,
                { backgroundColor: theme.backgroundElement, borderColor: theme.border },
              ]}
            >
              <View style={styles.previewRow}>
                <View style={styles.previewMerchantRow}>
                  <Feather name="edit-3" size={13} color={theme.accentBlue} />
                  <ThemedText style={styles.previewMerchant}>
                    {transactionMerchant ?? 'Transaction'}
                  </ThemedText>
                </View>
                {dateLabel && (
                  <ThemedText type="small" themeColor="textMuted">
                    {dateLabel}
                  </ThemedText>
                )}
              </View>

              <View style={styles.previewAmountRow}>
                {transactionAmount !== undefined && (
                  <ThemedText style={styles.previewAmount}>
                    {transactionAmount < 0 ? '- ' : '+ '}
                    {formatAmount(transactionAmount)}
                  </ThemedText>
                )}

                {currentTagId && (() => {
                  const item = findTagSubItem(currentTagId);
                  if (!item) return null;
                  const { Icon } = item;
                  return (
                    <View
                      style={[
                        styles.currentTagBadge,
                        { backgroundColor: theme.background, borderColor: theme.border },
                      ]}
                    >
                      <Icon size={12} color={theme.text} />
                      <ThemedText style={styles.currentTagLabel}>
                        {item.label.toUpperCase()}
                      </ThemedText>
                    </View>
                  );
                })()}
              </View>
            </View>
          )}

          {/* ── Search ── */}
          <View
            style={[
              styles.searchBar,
              { backgroundColor: theme.backgroundElement, borderColor: theme.border },
            ]}
          >
            <Feather name="search" size={16} color={theme.textMuted} />
            <TextInput
              ref={searchRef}
              style={[styles.searchInput, { color: theme.text }]}
              placeholder={`Search "${filteredCategories[0]?.label ?? 'Tags'}"`}
              placeholderTextColor={theme.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
                <Feather name="x-circle" size={15} color={theme.textMuted} />
              </Pressable>
            )}
          </View>

          {/* ── Scrollable body ── */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            {/* Most used chips - only when not searching */}
            {!searchQuery && (
              <View style={styles.section}>
                <ThemedText style={styles.sectionTitle}>Most used</ThemedText>
                <View style={styles.chipRow}>
                  {mostUsedItems.map(item => {
                    const isActive = item.id === currentTagId;
                    return (
                      <Pressable
                        key={item.id}
                        onPress={() => handleSubItemPress(item)}
                        style={({ pressed }) => [
                          styles.chip,
                          {
                            backgroundColor: isActive
                              ? theme.backgroundSelected
                              : theme.backgroundElement,
                            borderColor: isActive ? theme.textMuted : theme.border,
                          },
                          pressed && styles.pressed,
                        ]}
                      >
                        <item.Icon size={14} color={isActive ? theme.text : theme.textMuted} />
                        <ThemedText
                          style={[
                            styles.chipLabel,
                            { color: isActive ? theme.text : theme.textMuted },
                          ]}
                        >
                          {item.label.toUpperCase()}
                        </ThemedText>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Category list */}
            {filteredCategories.map(cat => {
              const isCatSelected = cat.subItems.some(s => s.id === currentTagId);

              return (
                <CategoryRow
                  key={cat.id}
                  category={cat}
                  isSelected={isCatSelected}
                  currentTagId={currentTagId}
                  onSubItemPress={handleSubItemPress}
                />
              );
            })}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─────────────────────────────────────────────
// Category row
// ─────────────────────────────────────────────

interface CategoryRowProps {
  category: TagCategory;
  isSelected: boolean;
  currentTagId?: string;
  onSubItemPress: (item: TagSubItem) => void;
}

function CategoryRow({
  category,
  isSelected,
  currentTagId,
  onSubItemPress,
}: CategoryRowProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.categoryCard,
        {
          backgroundColor: theme.backgroundElement,
          borderColor: isSelected ? theme.textMuted : theme.border,
        },
      ]}
    >
      {/* Header row — radio + title + description */}
      <View style={styles.categoryHeader}>
        {/* Radio */}
        <View
          style={[
            styles.radio,
            {
              borderColor: isSelected ? theme.text : theme.textMuted,
              backgroundColor: isSelected ? theme.text : 'transparent',
            },
          ]}
        >
          {isSelected && (
            <View style={[styles.radioDot, { backgroundColor: theme.background }]} />
          )}
        </View>

        {/* Labels */}
        <View style={styles.categoryLabelBlock}>
          <ThemedText style={styles.categoryTitle}>{category.label}</ThemedText>
          <ThemedText type="small" themeColor="textMuted" style={styles.categoryDescription}>
            {category.description}
          </ThemedText>
        </View>
      </View>

      {/* Sub-items icon grid — always visible */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.subItemsScroll}
      >
        {category.subItems.map(item => {
          const isActive = item.id === currentTagId;
          const { Icon: SubIcon } = item;

          return (
            <Pressable
              key={item.id}
              onPress={() => onSubItemPress(item)}
              style={({ pressed }) => [styles.subItem, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel={item.label}
            >
              <View
                style={[
                  styles.subIconCircle,
                  {
                    backgroundColor: isActive
                      ? theme.backgroundSelected
                      : theme.background,
                    borderColor: isActive ? theme.textMuted : theme.border,
                  },
                ]}
              >
                <SubIcon size={22} color={isActive ? theme.text : theme.textMuted} />
              </View>
              <ThemedText
                style={[
                  styles.subItemLabel,
                  { color: isActive ? theme.text : theme.textMuted },
                ]}
                numberOfLines={2}
              >
                {item.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '92%',
    overflow: 'hidden',
  },

  handleBarContainer: {
    alignItems: 'center',
    paddingTop: Spacing.two,
    paddingBottom: Spacing.one,
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerBtn: {
    padding: Spacing.one,
  },

  // Preview card
  previewCard: {
    marginHorizontal: Spacing.three,
    marginBottom: Spacing.two,
    borderRadius: 14,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewMerchantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  previewMerchant: {
    fontSize: 14,
    fontWeight: '500',
  },
  previewAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  previewAmount: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  currentTagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  currentTagLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.three,
    marginBottom: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 12,
    borderWidth: 1,
    gap: Spacing.two,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },

  // Scroll area
  scrollContent: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.four,
    gap: Spacing.two,
  },

  // Section
  section: {
    gap: Spacing.two,
    marginBottom: Spacing.one,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.two + 2,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
  },

  // Category card
  categoryCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    gap: Spacing.two,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  categoryLabelBlock: {
    flex: 1,
    gap: 2,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  categoryDescription: {
    fontSize: 12,
    lineHeight: 16,
  },

  // Sub-items
  subItemsScroll: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
    gap: Spacing.three,
  },
  subItem: {
    alignItems: 'center',
    width: 60,
    gap: Spacing.one,
  },
  subIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subItemLabel: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 14,
  },

  pressed: {
    opacity: 0.65,
  },
});
