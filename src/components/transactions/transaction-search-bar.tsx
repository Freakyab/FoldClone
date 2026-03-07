import React from 'react';
import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

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
      <ThemedView
        type="backgroundElement"
        style={[styles.inputContainer, { borderColor: theme.border }]}
      >
        <Feather
          name="search"
          size={18}
          color={theme.textMuted}
          style={styles.leftIcon}
        />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.textMuted}
          style={[styles.input, { color: theme.text }]}
        />
      </ThemedView>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Filter transactions"
        onPress={onFilterPress}
        style={({ pressed }) => [
          styles.filterButton,
          {
            borderColor: hasActiveFilter ? theme.accentBlue : theme.border,
            backgroundColor: hasActiveFilter ? `${theme.accentBlue}22` : theme.backgroundElement,
          },
          pressed && styles.pressed,
        ]}
      >
        <Feather
          name="sliders"
          size={18}
          color={hasActiveFilter ? theme.accentBlue : theme.text}
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
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
  leftIcon: {
    marginRight: Spacing.one,
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.7,
  },
});

