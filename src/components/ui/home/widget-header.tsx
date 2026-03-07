import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export interface WidgetHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

export function WidgetHeader({ title, subtitle, right }: WidgetHeaderProps) {
  return (
    <View style={styles.widgetHeaderRow}>
      <View style={styles.widgetHeaderText}>
        <ThemedText type="smallBold">{title}</ThemedText>
        {subtitle ? (
          <ThemedText type="small" themeColor="textSecondary">
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      {right ? <View style={styles.widgetHeaderRight}>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  widgetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  widgetHeaderText: {
    flex: 1,
    gap: Spacing.half,
  },
  widgetHeaderRight: {
    alignItems: 'flex-end',
  },
});

