import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';

import { AppIcon, type AppIconName } from './ui/app-icon';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={styles.slot} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/" asChild>
            <TabButton icon="grid-2x2" label="Dashboard" />
          </TabTrigger>
          <TabTrigger name="transactions" href="/transactions" asChild>
            <TabButton icon="arrow-left-right" label="Transactions" />
          </TabTrigger>
          <TabTrigger name="profile" href="/profile" asChild>
            <TabButton icon="user" label="Profile" />
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

interface TabButtonProps extends TabTriggerSlotProps {
  label: string;
  icon: AppIconName;
}

export function TabButton({ isFocused, label, icon, ...props }: TabButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      {...props}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}>
      <ThemedView
        style={[
          styles.tabButtonView,
          {
            backgroundColor: isFocused ? theme.backgroundSelected : 'transparent',
            borderColor: isFocused ? theme.textMuted : 'transparent',
          },
        ]}>
        <AppIcon name={icon} size={16} color={isFocused ? theme.text : theme.textMuted} />
        <ThemedText type="smallBold" themeColor={isFocused ? 'text' : 'textMuted'}>
          {label}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  const theme = useTheme();

  return (
    <View {...props} style={styles.tabListContainer}>
      <ThemedView
        style={[
          styles.innerContainer,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}>
        <ThemedView
          style={[
            styles.innerGlow,
            {
              backgroundColor: theme.surfaceElevated,
              borderColor: theme.divider,
            },
          ]}>
          {props.children}
        </ThemedView>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  slot: {
    height: '100%',
  },
  tabListContainer: {
    position: 'absolute',
    width: '100%',
    bottom: Spacing.four,
    paddingHorizontal: Spacing.four,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    padding: Spacing.one,
    borderWidth: 1,
    borderRadius: Radius.full,
    maxWidth: MaxContentWidth,
    width: '100%',
  },
  innerGlow: {
    borderWidth: 1,
    borderRadius: Radius.full,
    padding: Spacing.one,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.one,
  },
  pressed: {
    opacity: 0.88,
  },
  pressable: {
    flex: 1,
  },
  tabButtonView: {
    minHeight: 44,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.full,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
});
