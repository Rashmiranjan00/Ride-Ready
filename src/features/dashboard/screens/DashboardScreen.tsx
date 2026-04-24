import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Settings } from 'lucide-react-native';
import { WeatherCard } from '../components/WeatherCard';
import { FuelCard } from '../components/FuelCard';
import { Checklist } from '../components/Checklist';
import { PrimaryButton } from '@shared/components/PrimaryButton';
import { StatusStrip } from '@shared/components/StatusStrip';
import { useWeather } from '@features/weather/hooks/useWeather';
import { useFuelStore } from '@features/fuel/store/fuelStore';
import { useSettingsStore } from '@features/settings/store/settingsStore';
import { useRideStore } from '@features/ride/store/rideStore';
import { startLocationTracking } from '@features/ride/services/locationService';
import { Colors, Typography, Spacing } from '@shared/theme';

export default function DashboardScreen() {
  const { data: weather, loading: weatherLoading, error: weatherError } = useWeather();
  const { prefs } = useSettingsStore();
  const fuelStore = useFuelStore();
  const { startRide, status: rideStatus } = useRideStore();
  const [showStartModal, setShowStartModal] = useState(false);

  const estimatedRange = fuelStore.estimatedRange(prefs.fuelPrice, prefs.avgMileage);
  const latestLog = fuelStore.latestLog();
  const isRideActive = rideStatus === 'active';

  async function handleStartRide() {
    if (prefs.alwaysStartTracking) {
      await initiateRide(true);
    } else {
      setShowStartModal(true);
    }
  }

  async function initiateRide(withTracking: boolean) {
    setShowStartModal(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    if (withTracking) {
      startRide();
      await startLocationTracking();
    }
    Linking.openURL('https://www.google.com/maps/dir/?api=1');
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>RIDEREADY</Text>
        <TouchableOpacity
          style={styles.settingsBtn}
          onPress={() => router.push('/(tabs)/settings')}>
          <Settings size={20} color={Colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>

      <StatusStrip gpsActive={isRideActive} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Active ride banner */}
        {isRideActive && (
          <TouchableOpacity style={styles.activeBanner} onPress={() => router.push('/(tabs)/ride')}>
            <View style={styles.activeDot} />
            <Text style={styles.activeBannerText}>Ride in progress — tap to view</Text>
          </TouchableOpacity>
        )}

        <WeatherCard data={weather} loading={weatherLoading} error={weatherError} />
        <FuelCard
          estimatedRangeKm={estimatedRange}
          lastFuelAmountRs={latestLog?.amount}
          avgMileage={prefs.avgMileage}
          fuelPrice={prefs.fuelPrice}
        />
        <Checklist />

        <View style={styles.ctaRow}>
          <PrimaryButton
            label={isRideActive ? 'Continue Ride' : 'Start Ride'}
            onPress={isRideActive ? () => router.push('/(tabs)/ride') : handleStartRide}
            style={styles.cta}
          />
        </View>
      </ScrollView>

      {/* Start Ride Modal */}
      <Modal
        visible={showStartModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowStartModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Start Ride</Text>
            <Text style={styles.modalSubtitle}>
              Open Google Maps for navigation. Do you want to track this ride?
            </Text>
            <PrimaryButton
              label="Start Ride + Track"
              onPress={() => initiateRide(true)}
              style={styles.modalBtn}
            />
            <PrimaryButton
              label="Open Maps Only"
              onPress={() => initiateRide(false)}
              variant="ghost"
              style={styles.modalBtn}
            />
            <TouchableOpacity onPress={() => setShowStartModal(false)} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  settingsBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  content: {
    padding: Spacing.xl,
    gap: Spacing.cardGap,
    paddingBottom: Spacing.xxxl,
  },
  activeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primaryContainer + '18',
    borderWidth: 1,
    borderColor: Colors.primaryContainer + '44',
    borderRadius: 12,
    padding: Spacing.md,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primaryContainer,
  },
  activeBannerText: {
    ...Typography.labelSm,
    color: Colors.primaryContainer,
    fontWeight: '600',
  },
  ctaRow: {
    marginTop: Spacing.lg,
  },
  cta: {
    width: '100%',
    height: 64,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.xl,
    gap: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.outlineVariant,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.sm,
  },
  modalTitle: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
    textAlign: 'center',
  },
  modalSubtitle: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  modalBtn: {
    width: '100%',
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  cancelText: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    fontSize: 14,
  },
});
