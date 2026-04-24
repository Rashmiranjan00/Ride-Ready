import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
 * Green glow when range > 50km, yellow warning < 20km.
 */
export const FuelCard: React.FC<FuelCardProps> = ({
  estimatedRangeKm,
  lastFuelAmountRs,
  avgMileage,
  fuelPrice,
}) => {
  const rangeColor =
    estimatedRangeKm > 50
      ? Colors.secondaryContainer
      : estimatedRangeKm > 20
        ? '#FFC107'
        : Colors.error;

  const rangeLabel =
    estimatedRangeKm > 50 ? 'Good to go' : estimatedRangeKm > 20 ? 'Getting low' : 'Refuel soon';

  return (
    <GlassCard style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.labelCaps}>FUEL / RANGE</Text>
        <View style={[styles.statusPill, { backgroundColor: rangeColor + '22' }]}>
          <View style={[styles.dot, { backgroundColor: rangeColor }]} />
          <Text style={[styles.statusText, { color: rangeColor }]}>{rangeLabel}</Text>
        </View>
      </View>

      <View style={styles.metricRow}>
        <View>
          <Text style={[styles.rangeValue, { color: rangeColor }]}>
            {estimatedRangeKm > 0 ? `${Math.round(estimatedRangeKm)}` : '—'}
          </Text>
          <Text style={styles.rangeUnit}>km est. range</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.details}>
          <DetailRow label="AVG MILEAGE" value={`${avgMileage} km/L`} />
          <DetailRow label="FUEL PRICE" value={`₹${fuelPrice}/L`} />
          {lastFuelAmountRs != null && (
            <DetailRow label="LAST FILL" value={`₹${lastFuelAmountRs}`} />
          )}
        </View>
      </View>
    </GlassCard>
  );
};

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    gap: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelCaps: {
    ...Typography.labelCaps,
    color: Colors.onSurfaceVariant,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 99,
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    ...Typography.labelSm,
    fontWeight: '600',
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  rangeValue: {
    ...Typography.metricLarge,
    lineHeight: 52,
  },
  rangeUnit: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 56,
    backgroundColor: Colors.outlineVariant,
  },
  details: {
    flex: 1,
    gap: Spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    ...Typography.labelCaps,
    color: Colors.onSurfaceVariant,
    fontSize: 10,
  },
  detailValue: {
    ...Typography.labelSm,
    color: Colors.onSurface,
    fontSize: 13,
  },
});
