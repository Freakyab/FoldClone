import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';

import { ThemedText } from '@/components/themed-text';
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
    <View style={[styles.container, { borderBottomColor: theme.border }]}>
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
    </View>
  );
}

interface TabPillProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

function TabPill({ label, isActive, onPress }: TabPillProps) {
  const theme = useTheme();

  return (
    <TouchableRipple
      onPress={onPress}
      accessibilityState={{ selected: isActive }}
      borderless
      rippleColor={`${theme.text}14`}
      style={[
        styles.tab,
        isActive && [styles.activeTab, { borderBottomColor: theme.text }],
      ]}
    >
      <ThemedText
        style={[
          styles.tabLabel,
          isActive && { color: theme.text },
        ]}
        themeColor={isActive ? 'text' : 'textMuted'}
      >
        {label}
      </ThemedText>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tab: {
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
});

