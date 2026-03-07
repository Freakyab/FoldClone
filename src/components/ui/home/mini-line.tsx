import React from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

import { clamp } from './clamp';

export interface MiniLineProps {
  values: number[];
  height?: number;
  strokeWidth?: number;
}

function computePoints(values: number[], width: number, height: number, strokeWidth: number) {
  const safeWidth = Math.max(width, 1);
  const safeHeight = Math.max(height, 1);

  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = Math.max(max - min, 1);

  const innerWidth = Math.max(safeWidth - strokeWidth, 1);
  const innerHeight = Math.max(safeHeight - strokeWidth, 1);
  const stepX = values.length > 1 ? innerWidth / (values.length - 1) : 0;

  return values.map((v, idx) => {
    const norm = clamp((v - min) / range, 0, 1);
    const x = strokeWidth / 2 + idx * stepX;
    const y = strokeWidth / 2 + (1 - norm) * innerHeight;
    return { x, y };
  });
}

export function MiniLine({ values, height = 120, strokeWidth = 2 }: MiniLineProps) {
  const theme = useTheme();
  const [width, setWidth] = React.useState(0);

  const onLayout = React.useCallback((event: LayoutChangeEvent) => {
    const nextWidth = Math.round(event.nativeEvent.layout.width);
    setWidth(nextWidth);
  }, []);

  const points = React.useMemo(() => {
    if (width <= 0) return [];
    if (values.length < 2) return [];
    return computePoints(values, width, height, strokeWidth);
  }, [height, strokeWidth, values, width]);

  return (
    <View onLayout={onLayout} style={[styles.container, { height }]}>
      {points.length >= 2
        ? points.slice(0, -1).map((p1, idx) => {
            const p2 = points[idx + 1];
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
            const cx = (p1.x + p2.x) / 2;
            const cy = (p1.y + p2.y) / 2;

            return (
              <React.Fragment key={`${idx}-${p1.x}-${p1.y}`}>
                <View
                  style={[
                    styles.segmentGlow,
                    {
                      width: length,
                      height: strokeWidth + 6,
                      left: cx - length / 2,
                      top: cy - (strokeWidth + 6) / 2,
                      backgroundColor: theme.accentGreen,
                      transform: [{ rotateZ: `${angle}deg` }],
                    },
                  ]}
                />
                <View
                  style={[
                    styles.segment,
                    {
                      width: length,
                      height: strokeWidth,
                      left: cx - length / 2,
                      top: cy - strokeWidth / 2,
                      backgroundColor: theme.accentGreen,
                      transform: [{ rotateZ: `${angle}deg` }],
                    },
                  ]}
                />
              </React.Fragment>
            );
          })
        : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  segmentGlow: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.12,
  },
  segment: {
    position: 'absolute',
    borderRadius: 999,
  },
});

