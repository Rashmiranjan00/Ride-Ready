import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { PrimaryButton } from '@shared/components/PrimaryButton';
import { GlassCard } from '@shared/components/GlassCard';
import { Satellite, MapPin, Zap } from 'lucide-react-native';
import { useRideStore } from '@features/ride/store/rideStore';
import { useSettingsStore } from '@features/settings/store/settingsStore';
import { stopLocationTracking } from '@features/ride/services/locationService';
import { Colors, Typography, Spacing } from '@shared/theme';

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0)
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function RideActiveScreen() {
  const { session, status, endRide } = useRideStore();
  const { prefs } = useSettingsStore();
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (status !== 'active' || !session) {
      router.replace('/(tabs)');
      return;
    }
    timerRef.current = setInterval(() => {
      setElapsed(Date.now() - session.startTime);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status, session]);

  async function handleEndRide() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    stopLocationTracking();
    endRide(prefs.avgMileage, prefs.fuelPrice);
    router.replace('/(tabs)/summary');
  }

  const distanceKm = session?.currentDistance ?? 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>RIDEREADY</Text>
        <View style={styles.livePill}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      {/* Status icons */}
      <View style={styles.statusRow}>
        <Satellite size={16} color={Colors.onSurface} />
        <MapPin size={16} color={Colors.onSurface} opacity={0.4} />
        <Zap size={16} color={Colors.primaryContainer} />
      </View>

      <View style={styles.cockpit}>
        {/* Time elapsed — hero metric */}
        <GlassCard style={[styles.heroCard, { width: '100%', overflow: 'hidden' }]} glowAccent>
          <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]} pointerEvents="none">
            <View style={styles.ambientGlow} />
          </View>
          <Text style={styles.metricLabel}>TIME ELAPSED</Text>
          <Text style={styles.heroValue}>{formatDuration(elapsed)}</Text>
        </GlassCard>

        {/* Distance */}
        <GlassCard style={styles.distanceCard}>
          <Text style={styles.metricLabel}>DISTANCE</Text>
          <View style={styles.distanceRow}>
            <Text style={styles.metricValue}>{distanceKm.toFixed(1)}</Text>
            <Text style={styles.metricUnit}>{prefs.distanceUnit.toUpperCase()}</Text>
          </View>
        </GlassCard>
      </View>

      {/* End Ride */}
      <View style={styles.actionArea}>
        <PrimaryButton
          label="End Ride"
          onPress={handleEndRide}
          variant="danger"
          style={styles.endBtn}
        />
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.errorContainer + '33',
    borderWidth: 1,
    borderColor: Colors.error + '66',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 99,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.error,
  },
  liveText: {
    ...Typography.labelCaps,
    color: Colors.error,
    fontSize: 10,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: Spacing.md,
  },
  cockpit: {
    flex: 1,
    padding: Spacing.xl,
    gap: Spacing.cardGap,
    justifyContent: 'center',
  },
  heroCard: {
    alignItems: 'center',
    paddingVertical: 80, // Increased to fit the larger background circle
  },
  metricLabel: {
    ...Typography.labelCaps,
    color: Colors.onSurfaceVariant,
    marginBottom: Spacing.sm,
  },
  heroValue: {
    ...Typography.displayHero,
    color: Colors.primaryContainer,
    textShadowColor: Colors.primaryContainer,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    paddingHorizontal: 20, // Prevents horizontal clipping of shadow
    paddingVertical: 10,   // Prevents vertical clipping of shadow
  },
  distanceCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
  },
  metricValue: {
    ...Typography.metricLarge,
    color: Colors.onSurface,
  },
  metricUnit: {
    ...Typography.headlineMd,
    color: Colors.onSurfaceVariant,
  },
  actionArea: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  endBtn: {
    width: '100%',
    height: 80,
  },
  ambientGlow: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: Colors.primaryContainer,
    opacity: 0.1,
  },
});
