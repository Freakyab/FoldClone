import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppSectionHeader } from '@/components/ui/app-section-header';
import { Spacing } from '@/constants/theme';

export interface WidgetHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

export function WidgetHeader({ title, subtitle, right }: WidgetHeaderProps) {
  return (
    <View style={styles.widgetHeaderRow}>
      <AppSectionHeader
        title={title}
        subtitle={subtitle}
        action={right ? <View style={styles.widgetHeaderRight}>{right}</View> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  widgetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  widgetHeaderRight: {
    alignItems: 'flex-end',
  },
});

