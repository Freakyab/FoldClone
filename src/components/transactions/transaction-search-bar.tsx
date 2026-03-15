import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { AppIcon } from '@/components/ui/app-icon';

interface TransactionSearchBarProps {
  value: string;
  onChangeText: (value: string) => void;
  onFilterPress: () => void;
  placeholder?: string;
  hasActiveFilter?: boolean;
}

export function TransactionSearchBar({
  value,
  onChangeText,
  onFilterPress,
  placeholder = 'Search transactions',
  hasActiveFilter = false,
}: TransactionSearchBarProps) {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      <View
        style={[
          styles.searchbar,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: theme.border,
          },
        ]}>
        <AppIcon name="search" size={16} color={theme.textMuted} />
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          style={[styles.input, { color: theme.text }]}
          placeholderTextColor={theme.textMuted}
          returnKeyType="search"
        />
      </View>

      <Pressable
        onPress={onFilterPress}
        accessibilityLabel="Filter transactions"
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.filterButton,
          {
            backgroundColor: hasActiveFilter ? `${theme.accentBlue}20` : theme.backgroundElement,
            borderColor: hasActiveFilter ? theme.accentBlue : theme.border,
          },
          pressed && styles.pressed,
        ]}
      >
        <AppIcon
          name="sliders-horizontal"
          size={18}
          color={hasActiveFilter ? theme.accentBlue : theme.textMuted}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  searchbar: {
    flex: 1,
    borderRadius: 999,
    borderWidth: 1,
    minHeight: 40,
    paddingHorizontal: Spacing.two,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  input: {
    flex: 1,
    fontSize: 14,
    minHeight: 0,
    paddingVertical: 0,
  },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
});

