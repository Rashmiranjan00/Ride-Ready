import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Fuel, DollarSign, Ruler, Check, Banknote, Navigation, Clock } from 'lucide-react-native';
import { GlassCard } from '@shared/components/GlassCard';
import { PrimaryButton } from '@shared/components/PrimaryButton';
import { useSettingsStore } from '@features/settings/store/settingsStore';
import { Colors, Typography, Spacing, BorderRadius } from '@shared/theme';

export default function SettingsScreen() {
  const { prefs, updatePrefs } = useSettingsStore();
  const [localAvgMileage, setLocalAvgMileage] = useState(prefs.avgMileage.toString());
  const [localFuelPrice, setLocalFuelPrice] = useState(prefs.fuelPrice.toString());
  const [localBaseFare, setLocalBaseFare] = useState(prefs.baseFare.toString());
  const [localCostPerKm, setLocalCostPerKm] = useState(prefs.costPerKm.toString());
  const [localCostPerMin, setLocalCostPerMin] = useState(prefs.costPerMin.toString());

  const handleSave = () => {
    updatePrefs({
      avgMileage: parseFloat(localAvgMileage) || prefs.avgMileage,
      fuelPrice: parseFloat(localFuelPrice) || prefs.fuelPrice,
      baseFare: parseFloat(localBaseFare) || 0,
      costPerKm: parseFloat(localCostPerKm) || 0,
      costPerMin: parseFloat(localCostPerMin) || 0,
    });
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>RIDEREADY</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Preferences</Text>
          <Text style={styles.pageSubtitle}>
            Configure your telemetry and trip calculation metrics.
          </Text>
        </View>

        {/* Mileage Card */}
        <GlassCard style={styles.settingCard}>
          <View style={styles.cardHeader}>
            <View style={styles.iconWrapper}>
              <Fuel size={24} color={Colors.primaryContainer} />
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.settingTitle}>Set Average Mileage</Text>
              <Text style={styles.settingDesc}>Used for trip range estimates.</Text>
            </View>
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              keyboardType="decimal-pad"
              value={localAvgMileage}
              onChangeText={setLocalAvgMileage}
            />
            <Text style={styles.unitText}>{prefs.distanceUnit === 'km' ? 'km/L' : 'MPG'}</Text>
          </View>
        </GlassCard>

        {/* Fuel Price Card */}
        <GlassCard style={styles.settingCard}>
          <View style={styles.cardHeader}>
            <View style={styles.iconWrapper}>
              <DollarSign size={24} color={Colors.primaryContainer} />
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.settingTitle}>Set Fuel Price</Text>
              <Text style={styles.settingDesc}>Calculate trip costs accurately.</Text>
            </View>
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.currencySymbol}>{prefs.currency === 'USD' ? '$' : '₹'}</Text>
            <TextInput
              style={[styles.input, { paddingLeft: 24 }]}
              keyboardType="decimal-pad"
              value={localFuelPrice}
              onChangeText={setLocalFuelPrice}
            />
          </View>
        </GlassCard>

        {/* Intelligence Settings Header */}
        <View style={{ marginTop: Spacing.md, marginBottom: Spacing.sm }}>
          <Text style={styles.pageTitle}>Intelligence Settings</Text>
          <Text style={styles.pageSubtitle}>
            Configure base fare and rates for real-time cost intelligence.
          </Text>
        </View>

        {/* Base Fare Card */}
        <GlassCard style={styles.settingCard}>
          <View style={styles.cardHeader}>
            <View style={styles.iconWrapper}>
              <DollarSign size={24} color={Colors.primaryContainer} />
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.settingTitle}>Base Fare</Text>
              <Text style={styles.settingDesc}>Starting cost before distance/time.</Text>
            </View>
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.currencySymbol}>{prefs.currency === 'USD' ? '$' : '₹'}</Text>
            <TextInput
              style={[styles.input, { paddingLeft: 24 }]}
              keyboardType="decimal-pad"
              value={localBaseFare}
              onChangeText={setLocalBaseFare}
            />
          </View>
        </GlassCard>

        {/* Cost Per Km Card */}
        <GlassCard style={styles.settingCard}>
          <View style={styles.cardHeader}>
            <View style={styles.iconWrapper}>
              <Navigation size={24} color={Colors.primaryContainer} />
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.settingTitle}>Cost per Unit Distance</Text>
              <Text style={styles.settingDesc}>
                Charge per {prefs.distanceUnit === 'km' ? 'kilometer' : 'mile'}.
              </Text>
            </View>
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.currencySymbol}>{prefs.currency === 'USD' ? '$' : '₹'}</Text>
            <TextInput
              style={[styles.input, { paddingLeft: 24 }]}
              keyboardType="decimal-pad"
              value={localCostPerKm}
              onChangeText={setLocalCostPerKm}
            />
          </View>
        </GlassCard>

        {/* Cost Per Minute Card */}
        <GlassCard style={styles.settingCard}>
          <View style={styles.cardHeader}>
            <View style={styles.iconWrapper}>
              <Clock size={24} color={Colors.primaryContainer} />
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.settingTitle}>Cost per Minute</Text>
              <Text style={styles.settingDesc}>Charge for elapsed ride time.</Text>
            </View>
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.currencySymbol}>{prefs.currency === 'USD' ? '$' : '₹'}</Text>
            <TextInput
              style={[styles.input, { paddingLeft: 24 }]}
              keyboardType="decimal-pad"
              value={localCostPerMin}
              onChangeText={setLocalCostPerMin}
            />
          </View>
        </GlassCard>

        {/* Currency Card */}
        <GlassCard style={styles.settingCard}>
          <View style={styles.cardHeader}>
            <View style={styles.iconWrapper}>
              <Banknote size={24} color={Colors.primaryContainer} />
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.settingTitle}>Currency</Text>
              <Text style={styles.settingDesc}>Select your preferred currency.</Text>
            </View>
          </View>
          <View style={styles.segmentedControl}>
            <TouchableOpacity
              style={[styles.segmentBtn, prefs.currency === 'INR' && styles.segmentBtnActive]}
              onPress={() => updatePrefs({ currency: 'INR' })}>
              <Text
                style={[styles.segmentText, prefs.currency === 'INR' && styles.segmentTextActive]}>
                INR (₹)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.segmentBtn, prefs.currency === 'USD' && styles.segmentBtnActive]}
              onPress={() => updatePrefs({ currency: 'USD' })}>
              <Text
                style={[styles.segmentText, prefs.currency === 'USD' && styles.segmentTextActive]}>
                USD ($)
              </Text>
            </TouchableOpacity>
          </View>
        </GlassCard>

        {/* Units Card */}
        <GlassCard style={styles.settingCard}>
          <View style={styles.cardHeader}>
            <View style={styles.iconWrapper}>
              <Ruler size={24} color={Colors.primaryContainer} />
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.settingTitle}>Units</Text>
              <Text style={styles.settingDesc}>Select your preferred measurement system.</Text>
            </View>
          </View>
          <View style={styles.segmentedControl}>
            <TouchableOpacity
              style={[styles.segmentBtn, prefs.distanceUnit === 'km' && styles.segmentBtnActive]}
              onPress={() => updatePrefs({ distanceUnit: 'km' })}>
              <Text
                style={[
                  styles.segmentText,
                  prefs.distanceUnit === 'km' && styles.segmentTextActive,
                ]}>
                km/L
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.segmentBtn, prefs.distanceUnit === 'mi' && styles.segmentBtnActive]}
              onPress={() => updatePrefs({ distanceUnit: 'mi' })}>
              <Text
                style={[
                  styles.segmentText,
                  prefs.distanceUnit === 'mi' && styles.segmentTextActive,
                ]}>
                MPG
              </Text>
            </TouchableOpacity>
          </View>
        </GlassCard>

        <View style={styles.saveAction}>
          <PrimaryButton
            icon={<Check size={20} color={Colors.onPrimaryContainer} />}
            label="Save Preferences"
            onPress={handleSave}
            style={styles.saveBtn}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
  content: { padding: Spacing.xl, gap: Spacing.cardGap, paddingBottom: 100 },
  pageHeader: {
    marginBottom: Spacing.md,
  },
  pageTitle: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
    marginBottom: 4,
  },
  pageSubtitle: {
    ...Typography.bodyLg,
    color: Colors.onSurfaceVariant,
  },
  settingCard: {
    flexDirection: 'column',
    gap: Spacing.md,
    padding: Spacing.xl,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrapper: {
    flex: 1,
  },
  settingTitle: {
    ...Typography.bodyLg,
    color: Colors.onSurface,
    fontWeight: '500',
  },
  settingDesc: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    marginTop: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    position: 'relative',
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: Colors.surfaceContainerHigh,
    borderTopLeftRadius: BorderRadius.sm,
    borderTopRightRadius: BorderRadius.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
    paddingHorizontal: Spacing.md,
    fontFamily: Typography.metricLarge.fontFamily,
    fontWeight: '600',
    fontSize: 24,
    lineHeight: 28,
    color: Colors.primaryContainer,
    textAlign: 'right',
  },
  unitText: {
    ...Typography.labelCaps,
    color: Colors.onSurfaceVariant,
    width: 48,
  },
  currencySymbol: {
    position: 'absolute',
    left: Spacing.md,
    fontFamily: Typography.metricLarge.fontFamily,
    fontWeight: '600',
    fontSize: 24,
    lineHeight: 28,
    color: Colors.onSurfaceVariant,
    zIndex: 1,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: BorderRadius.lg,
    padding: 4,
    height: 48,
  },
  segmentBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.sm,
  },
  segmentBtnActive: {
    backgroundColor: 'rgba(0, 240, 255, 0.2)', // primaryContainer/20
  },
  segmentText: {
    ...Typography.labelCaps,
    color: Colors.onSurfaceVariant,
  },
  segmentTextActive: {
    color: Colors.primaryContainer,
  },
  saveAction: {
    marginTop: Spacing.lg,
  },
  saveBtn: {
    height: 56,
  },
});
