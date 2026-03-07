import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
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
          <ThemedText type="small" themeColor="textMuted">
            {unreadCount}+ unread updates →
          </ThemedText>
        </Pressable>
      </View>

      <View style={styles.headerActions}>
        <Pressable
          onPress={onNotificationsPress}
          accessibilityRole="button"
          accessibilityLabel="Notifications"
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
          <MaterialCommunityIcons name="bell-outline" size={18} color={theme.text} />
        </Pressable>
        <Pressable
          onPress={onCustomizePress}
          accessibilityRole="button"
          accessibilityLabel="Customize widgets"
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
          <MaterialCommunityIcons name="tune-variant" size={18} color={theme.text} />
        </Pressable>
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
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.one,
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 999,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

