import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Fuel } from 'lucide-react-native';
import { GlassCard } from '@shared/components/GlassCard';
import { Colors, Typography, Spacing } from '@shared/theme';

interface FuelCardProps {
  estimatedRangeKm: number;
  lastFuelAmountRs?: number;
  avgMileage: number;
  fuelPrice: number;
}

/**
 * FuelCard — shows estimated range based on last known fuel + avg mileage.
 * Features a circular SVG gauge matching the Stitch design.
 */
export const FuelCard: React.FC<FuelCardProps> = ({ estimatedRangeKm }) => {
  // Assuming ~200km is a full tank for visual gauge purposes
  const maxRange = 200;
  const levelPercent = Math.min(Math.max((estimatedRangeKm / maxRange) * 100, 0), 100);

  const rangeColor = Colors.secondaryFixed || Colors.secondaryContainer;

  // SVG Gauge calculations
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  // Make it a 3/4 circle (270 degrees)
  const strokeDasharray = `${circumference * 0.75} ${circumference}`;
  const strokeDashoffset = circumference * 0.75 * (1 - levelPercent / 100);

  return (
    <GlassCard style={styles.card}>
      <View style={styles.leftCol}>
        <View style={styles.iconWrapper}>
          <Fuel size={20} color={rangeColor} />
        </View>
        <Text style={styles.labelCaps}>EST. RANGE</Text>
        <View style={styles.metricRow}>
          <Text style={[styles.rangeValue, { color: rangeColor }]}>
            ~{estimatedRangeKm > 0 ? Math.round(estimatedRangeKm) : '0'}
          </Text>
          <Text style={styles.rangeUnit}>km</Text>
        </View>
      </View>

      <View style={styles.gaugeContainer}>
        <Svg width={112} height={112} viewBox="0 0 100 100" style={styles.svg}>
          {/* Background Track */}
          <Circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth={8}
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
          />
          {/* Active Track */}
          <Circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke={rangeColor}
            strokeWidth={8}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </Svg>
        <View style={styles.gaugeTextContainer}>
          <Text style={styles.gaugeLabel}>Level</Text>
          <Text style={styles.gaugePercent}>{Math.round(levelPercent)}%</Text>
        </View>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.xl,
  },
  leftCol: {
    flexDirection: 'column',
    gap: 8,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(121, 255, 91, 0.1)', // secondary-fixed/10
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  labelCaps: {
    ...Typography.labelCaps,
    color: Colors.onSurfaceVariant,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  rangeValue: {
    ...Typography.metricLarge,
    textShadowColor: 'rgba(121, 255, 91, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  rangeUnit: {
    ...Typography.bodyLg,
    color: Colors.onSurface,
  },
  gaugeContainer: {
    position: 'relative',
    width: 112,
    height: 112,
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    transform: [{ rotate: '135deg' }], // Rotate to start from bottom-left
  },
  gaugeTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 8,
  },
  gaugeLabel: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
  },
  gaugePercent: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
  },
});
