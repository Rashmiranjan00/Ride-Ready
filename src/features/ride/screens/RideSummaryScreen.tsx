import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Bike } from 'lucide-react-native';
import { GlassCard } from '@shared/components/GlassCard';
import { PrimaryButton } from '@shared/components/PrimaryButton';
import { useRideStore } from '@features/ride/store/rideStore';
import { useSettingsStore } from '@features/settings/store/settingsStore';
import { Colors, Typography, Spacing } from '@shared/theme';

function formatDuration(ms: number): string {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m ${s % 60}s`;
}

export default function RideSummaryScreen() {
  const { lastRide } = useRideStore();
  const { prefs } = useSettingsStore();

  if (!lastRide) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Bike
            size={64}
            color={Colors.onSurfaceVariant}
            strokeWidth={1}
            style={{ marginBottom: Spacing.md }}
          />
          <Text style={styles.emptyTitle}>No ride yet</Text>
          <Text style={styles.emptySubtitle}>Start a ride from the Dashboard.</Text>
          <PrimaryButton
            label="Go to Dashboard"
            onPress={() => router.push('/(tabs)')}
            style={{ marginTop: 24 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const displayDist =
    prefs.distanceUnit === 'km'
      ? `${lastRide.distance.toFixed(1)} km`
      : `${(lastRide.distance * 0.621371).toFixed(1)} mi`;

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>TRIP SUMMARY</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <GlassCard style={styles.heroCard} glowAccent>
          <Text style={styles.metricLabel}>DISTANCE COVERED</Text>
          <Text style={styles.heroValue}>{displayDist}</Text>
          <Text style={styles.durationText}>{formatDuration(lastRide.duration)}</Text>
        </GlassCard>

        <GlassCard style={styles.breakdownCard}>
          <Text style={styles.sectionTitle}>COST BREAKDOWN</Text>
          <MetricRow
            label="Fuel Used"
            value={`${lastRide.estimatedFuel.toFixed(2)} L`}
            highlight={false}
          />
          <View style={styles.divider} />
          <MetricRow label="Total Cost" value={`₹${lastRide.cost.toFixed(2)}`} highlight />
          <MetricRow
            label="Cost per km"
            value={`₹${lastRide.costPerKm.toFixed(2)}/km`}
            highlight={false}
          />
        </GlassCard>

        <PrimaryButton
          label="Back to Dashboard"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.replace('/(tabs)');
          }}
        />
        <PrimaryButton label="Add Fuel" onPress={() => router.push('/fuel')} variant="ghost" />
      </ScrollView>
    </SafeAreaView>
  );
}

const MetricRow: React.FC<{ label: string; value: string; highlight: boolean }> = ({
  label,
  value,
  highlight,
}) => (
  <View style={styles.metricRow}>
    <Text style={styles.metricRowLabel}>{label}</Text>
    <Text style={[styles.metricRowValue, highlight && styles.highlightValue]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  appTitle: {
    ...Typography.headlineMd,
    color: Colors.primaryContainer,
    letterSpacing: 4,
    fontWeight: '700',
  },
  content: { padding: Spacing.xl, gap: Spacing.cardGap, paddingBottom: 60 },
  heroCard: { alignItems: 'center', paddingVertical: Spacing.xxxl, gap: Spacing.sm },
  metricLabel: { ...Typography.labelCaps, color: Colors.onSurfaceVariant },
  heroValue: { 
    ...Typography.metricLarge, 
    color: Colors.primaryContainer, 
    fontSize: 56,
    lineHeight: 64,
  },
  durationText: { ...Typography.bodyLg, color: Colors.onSurfaceVariant, fontSize: 16 },
  breakdownCard: { gap: Spacing.md },
  sectionTitle: {
    ...Typography.labelCaps,
    color: Colors.onSurfaceVariant,
    marginBottom: Spacing.xs,
  },
  divider: { height: 1, backgroundColor: Colors.outlineVariant, marginVertical: Spacing.xs },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  metricRowLabel: { ...Typography.bodyLg, color: Colors.onSurfaceVariant, fontSize: 15 },
  metricRowValue: { ...Typography.headlineMd, color: Colors.onSurface, fontSize: 18 },
  highlightValue: { color: Colors.primaryContainer },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  emptyTitle: { ...Typography.headlineMd, color: Colors.onSurface },
  emptySubtitle: {
    ...Typography.bodyLg,
    color: Colors.onSurfaceVariant,
    fontSize: 15,
    textAlign: 'center',
  },
});
