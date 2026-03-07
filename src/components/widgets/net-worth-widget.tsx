import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Svg, { Polyline, Defs, LinearGradient, Stop, Path } from 'react-native-svg';

const C = {
  bg: '#0d0f14',
  surface: '#12151c',
  card: '#161a23',
  border: '#1e2330',
  accentGreen: '#00e676',
  text: '#ffffff',
  textSub: 'rgba(255,255,255,0.55)',
  textMuted: 'rgba(255,255,255,0.35)',
  negative: '#ff4d4d',
};

// ECG-like pattern matching the image: flat baseline, two medium spikes, one tall spike, declining tail
const RAW_POINTS = [
  18, 17, 18, 16, 19, 17, 18, 23, 17, 16, 18, 28, 17, 16, 18, 17,
  19, 17, 18, 22, 17, 16, 19, 38, 32, 18, 17, 16, 18, 17,
  16, 17, 18, 16, 14, 15, 14, 16, 15, 13, 14, 12, 13, 11, 12, 11, 12, 11,
];

function Sparkline({ width = 320, height = 80 }: { width?: number; height?: number }) {
  const padding = 2;
  const min = Math.min(...RAW_POINTS);
  const max = Math.max(...RAW_POINTS);
  const range = max - min || 1;

  const pts = RAW_POINTS.map((v, i) => {
    const x = padding + (i / (RAW_POINTS.length - 1)) * (width - padding * 2);
    const y = padding + ((max - v) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const lineCoords = pts.join(' ');
  const lastX = padding + (width - padding * 2);
  const firstX = padding;
  const bottom = height;
  const fillPath = `M${pts[0]} L${pts.join(' L')} L${lastX},${bottom} L${firstX},${bottom} Z`;

  return (
    <Svg width={width} height={height}>
      <Defs>
        <LinearGradient id="netlGlow" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={C.accentGreen} stopOpacity="0.28" />
          <Stop offset="100%" stopColor={C.accentGreen} stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Path d={fillPath} fill="url(#netlGlow)" />
      <Polyline
        points={lineCoords}
        fill="none"
        stroke={C.accentGreen}
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </Svg>
  );
}

function Metric({ label, value, negative }: { label: string; value: string; negative?: boolean }) {
  return (
    <View style={styles.metricCell}>
      <Text style={[styles.metricValue, negative && styles.negative]}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

export function NetWorthWidget() {
  return (
    <View style={styles.card}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerTitle}>ARYN</Text>
          <Text style={styles.headerSub}>Aryan Vijay Bhisikar</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.netWorthAmount}>₹26,659</Text>
          <Text style={styles.netWorthLabel}>Net worth</Text>
        </View>
      </View>

      {/* Full-width chart */}
      <View style={styles.chartContainer}>
        <Sparkline width={320} height={80} />
        <View style={styles.captionRow}>
          <View style={styles.captionLine} />
          <Text style={styles.chartCaption}>Last 180 days</Text>
          <View style={styles.captionLine} />
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Metrics */}
      <View style={styles.metricsRow}>
        <Metric label="THIS MONTH" value="-₹10,425" negative />
        <Metric label="THIS YEAR" value="-₹22,214" negative />
        <Metric label="BALANCE" value="₹4,246" />
        <Metric label="DEBT" value="₹587" />
      </View>

      {/* Drag handle */}
      <View style={styles.handleRow}>
        <View style={styles.handle} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: C.card,
    borderRadius: 20,
    paddingTop: 18,
    paddingBottom: 10,
    width: '100%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 24,
    elevation: 12,
  },

  // ── Header
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
    paddingHorizontal: 18,
  },
  headerTitle: {
    color: C.text,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  headerSub: {
    color: C.textSub,
    fontSize: 12,
    marginTop: 2,
    letterSpacing: 0.2,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  netWorthAmount: {
    color: C.text,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  netWorthLabel: {
    color: C.textMuted,
    fontSize: 11,
    marginTop: 2,
  },

  // ── Chart (edge-to-edge)
  chartContainer: {
    marginBottom: 2,
  },
  captionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 8,
    paddingHorizontal: 18,
  },
  captionLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: C.border,
  },
  chartCaption: {
    color: C.textMuted,
    fontSize: 10,
    letterSpacing: 0.4,
    marginHorizontal: 8,
  },

  // ── Divider
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: C.border,
    marginBottom: 14,
    marginHorizontal: 18,
  },

  // ── Metrics
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  metricCell: {
    alignItems: 'flex-start',
    flex: 1,
  },
  metricValue: {
    color: C.text,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  negative: {
    color: C.negative,
  },
  metricLabel: {
    color: C.textMuted,
    fontSize: 9,
    marginTop: 3,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },

  // ── Drag handle
  handleRow: {
    alignItems: 'center',
    marginTop: 12,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.border,
  },
});