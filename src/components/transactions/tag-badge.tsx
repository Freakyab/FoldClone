import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type TagIconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface TagBadgeProps {
  label: string;
  icon?: TagIconName;
}

export function TagBadge({ label, icon }: TagBadgeProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundSelected,
          borderColor: theme.border,
        },
      ]}
    >
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={11}
          color={theme.text}
          style={styles.icon}
        />
      )}
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
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  icon: {
    marginRight: 3,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
});

