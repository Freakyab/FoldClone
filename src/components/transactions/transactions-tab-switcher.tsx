import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type TransactionsTab = 'all' | 'groups';

interface TransactionsTabSwitcherProps {
  activeTab: TransactionsTab;
  onTabChange: (tab: TransactionsTab) => void;
}

export function TransactionsTabSwitcher({ activeTab, onTabChange }: TransactionsTabSwitcherProps) {
  const theme = useTheme();

  return (
    <ThemedView
      type="backgroundElement"
      style={[styles.container, { borderColor: theme.border }]}
    >
      <TabPill
        label="All"
        isActive={activeTab === 'all'}
        onPress={() => onTabChange('all')}
      />
      <TabPill
        label="Groups"
        isActive={activeTab === 'groups'}
        onPress={() => onTabChange('groups')}
      />
    </ThemedView>
  );
}

interface TabPillProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

function TabPill({ label, isActive, onPress }: TabPillProps) {
  const theme = useTheme();
  const activeBg = theme.background;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      style={({ pressed }) => [
        styles.tab,
        isActive && { backgroundColor: activeBg },
        pressed && styles.pressed,
      ]}
    >
      <ThemedText
        type="small"
        style={[
          styles.tabLabel,
          isActive && { color: theme.text },
        ]}
        themeColor={isActive ? 'text' : 'textMuted'}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 999,
    padding: 2,
    gap: 2,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    paddingVertical: Spacing.one,
  },
  tabLabel: {
    fontWeight: '500',
  },
  pressed: {
    opacity: 0.8,
  },
});

