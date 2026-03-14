import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

interface TagIconProps {
  size?: number;
  color?: string;
}

interface TagBadgeProps {
  label: string;
  Icon?: React.ComponentType<TagIconProps>;
}

export function TagBadge({ label, Icon }: TagBadgeProps) {
  return (
    <View
      style={[
        styles.container,
      ]}
    >
      {Icon ? <Icon size={11} color="#FFFFFF" /> : null}
      <ThemedText style={styles.text}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#111111',
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    color: '#FFFFFF',
  },
});

