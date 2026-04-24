import React from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard } from '@shared/components/GlassCard';
import { useSettingsStore } from '@features/settings/store/settingsStore';
import { Colors, Typography, Spacing } from '@shared/theme';

export default function SettingsScreen() {
  const { prefs, updatePrefs } = useSettingsStore();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>SETTINGS</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <GlassCard style={styles.section}>
          <Text style={styles.sectionTitle}>BIKE SETUP</Text>
          <SettingRow
            label="Avg. Mileage"
            value={`${prefs.avgMileage} km/L`}
            onInc={() => updatePrefs({ avgMileage: prefs.avgMileage + 1 })}
            onDec={() => updatePrefs({ avgMileage: Math.max(1, prefs.avgMileage - 1) })}
          />
          <View style={styles.divider} />
          <SettingRow
            label="Fuel Price"
            value={`₹${prefs.fuelPrice}/L`}
            onInc={() => updatePrefs({ fuelPrice: prefs.fuelPrice + 1 })}
            onDec={() => updatePrefs({ fuelPrice: Math.max(1, prefs.fuelPrice - 1) })}
          />
        </GlassCard>

        <GlassCard style={styles.section}>
          <Text style={styles.sectionTitle}>PREFERENCES</Text>
          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchLabel}>Distance Unit</Text>
              <Text style={styles.switchSub}>
                Currently: {prefs.distanceUnit === 'km' ? 'Kilometres' : 'Miles'}
              </Text>
            </View>
            <Switch
              value={prefs.distanceUnit === 'mi'}
              onValueChange={(v) => updatePrefs({ distanceUnit: v ? 'mi' : 'km' })}
              trackColor={{ false: Colors.outlineVariant, true: Colors.primaryContainer }}
              thumbColor={Colors.onSurface}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.switchLabel}>Always Start Tracking</Text>
              <Text style={styles.switchSub}>Skip confirmation when opening Maps</Text>
            </View>
            <Switch
              value={prefs.alwaysStartTracking}
              onValueChange={(v) => updatePrefs({ alwaysStartTracking: v })}
              trackColor={{ false: Colors.outlineVariant, true: Colors.primaryContainer }}
              thumbColor={Colors.onSurface}
            />
          </View>
        </GlassCard>

        <Text style={styles.version}>RideReady v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const SettingRow: React.FC<{
  label: string;
  value: string;
  onInc: () => void;
  onDec: () => void;
}> = ({ label, value, onInc, onDec }) => (
  <View style={styles.settingRow}>
    <Text style={styles.settingLabel}>{label}</Text>
    <View style={styles.stepper}>
      <TouchableOpacity style={styles.stepBtn} onPress={onDec}>
        <Text style={styles.stepBtnText}>−</Text>
      </TouchableOpacity>
      <Text style={styles.settingValue}>{value}</Text>
      <TouchableOpacity style={styles.stepBtn} onPress={onInc}>
        <Text style={styles.stepBtnText}>+</Text>
      </TouchableOpacity>
    </View>
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
  section: { gap: Spacing.md },
  sectionTitle: {
    ...Typography.labelCaps,
    color: Colors.onSurfaceVariant,
    marginBottom: Spacing.xs,
  },
  divider: { height: 1, backgroundColor: Colors.outlineVariant, marginVertical: Spacing.xs },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  settingLabel: { ...Typography.bodyLg, color: Colors.onSurface, fontSize: 15 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  stepBtnText: {
    ...Typography.headlineMd,
    color: Colors.primaryContainer,
    fontSize: 20,
    lineHeight: 24,
  },
  settingValue: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
    fontSize: 15,
    minWidth: 80,
    textAlign: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  switchLabel: { ...Typography.bodyLg, color: Colors.onSurface, fontSize: 15 },
  switchSub: { ...Typography.labelSm, color: Colors.onSurfaceVariant, fontSize: 12, marginTop: 2 },
  version: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});
