import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AppIcon } from '@/components/ui/app-icon';
import { AppIconButton } from '@/components/ui/app-icon-button';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface HomeHeaderProps {
  username: string;
  unreadCount: number;
  onPressProfile: () => void;
  onNotificationsPress: () => void;
  onCustomizePress: () => void;
}

export function HomeHeader({
  username,
  unreadCount,
  onPressProfile,
  onNotificationsPress,
  onCustomizePress,
}: HomeHeaderProps) {
  const theme = useTheme();

  return (
    <View style={styles.headerRow}>
      <Pressable onPress={onPressProfile} style={({ pressed }) => pressed && styles.pressed}>
        <View style={[styles.avatar, { backgroundColor: theme.avatarBackground }]} />
      </Pressable>

      <View style={styles.headerTextCol}>
        <ThemedText type="smallBold">{username}</ThemedText>
        <Pressable onPress={onNotificationsPress} style={({ pressed }) => pressed && styles.pressed}>
          <View style={styles.updatesRow}>
            <ThemedText type="small" themeColor="textMuted">
              {unreadCount}+ unread updates
            </ThemedText>
            <AppIcon name="chevron-right" size={14} color={theme.textMuted} />
          </View>
        </Pressable>
      </View>

      <View style={styles.headerActions}>
        <AppIconButton
          onPress={onNotificationsPress}
          accessibilityLabel="Notifications"
          iconName="bell"
          iconColor={theme.text}
          iconSize={18}
          style={styles.iconButton}
        />
        <AppIconButton
          onPress={onCustomizePress}
          accessibilityLabel="Customize widgets"
          iconName="sliders-horizontal"
          iconColor={theme.text}
          iconSize={18}
          style={styles.iconButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  headerTextCol: {
    flex: 1,
    gap: Spacing.half,
  },
  updatesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.one,
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
  },
  iconButton: {
    minWidth: 40,
    minHeight: 40,
  },
});

