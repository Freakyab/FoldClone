import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

interface AppSectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function AppSectionHeader({ title, subtitle, action }: AppSectionHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.copyBlock}>
        <ThemedText type="bodyStrong">{title}</ThemedText>
        {subtitle ? (
          <ThemedText type="small" themeColor="textMuted">
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  copyBlock: {
    flex: 1,
    gap: Spacing.one,
  },
});
