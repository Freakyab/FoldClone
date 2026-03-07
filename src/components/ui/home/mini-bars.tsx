import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

import { clamp } from './clamp';

export interface MiniBarsProps {
  values: number[];
  height?: number;
  color?: string;
}

export function MiniBars({ values, height = 28, color }: MiniBarsProps) {
  const theme = useTheme();
  const max = Math.max(...values, 1);
  const barColor = color || theme.accentGreen;

  return (
    <View style={[styles.miniBars, { height }]}>
      {values.map((v, idx) => {
        const h = clamp((v / max) * height, 2, height);
        return (
          <View
            key={`${idx}-${v}`}
            style={[styles.miniBar, { height: h, backgroundColor: barColor, opacity: 0.9 - idx * 0.02 }]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  miniBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  miniBar: {
    width: 3,
    borderRadius: 2,
  },
});

