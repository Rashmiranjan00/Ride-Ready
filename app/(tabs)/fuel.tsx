import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { GlassCard } from '@shared/components/GlassCard';
import { PrimaryButton } from '@shared/components/PrimaryButton';
import { useFuelStore } from '@features/fuel/store/fuelStore';
import { Colors, Typography, Spacing } from '@shared/theme';

export default function AddFuelScreen() {
  const { addLog } = useFuelStore();
  const [amount, setAmount] = useState('');
  const [liters, setLiters] = useState('');

  function handleSave() {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) return;
    addLog({
      id: `fuel_${Date.now()}`,
      date: Date.now(),
      amount: amountNum,
      liters: liters ? parseFloat(liters) : undefined,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>ADD FUEL</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <GlassCard style={styles.card}>
          <Text style={styles.label}>AMOUNT PAID (₹)</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholder="e.g. 500"
            placeholderTextColor={Colors.outlineVariant}
          />
          <View style={styles.divider} />
          <Text style={styles.label}>LITRES FILLED (optional)</Text>
          <TextInput
            style={styles.input}
            value={liters}
            onChangeText={setLiters}
            keyboardType="decimal-pad"
            placeholder="e.g. 4.5"
            placeholderTextColor={Colors.outlineVariant}
          />
        </GlassCard>
        <PrimaryButton label="Save Fuel Log" onPress={handleSave} />
        <PrimaryButton label="Cancel" onPress={() => router.back()} variant="ghost" />
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
  content: { padding: Spacing.xl, gap: Spacing.cardGap, paddingBottom: 60 },
  card: { gap: Spacing.md },
  label: { ...Typography.labelCaps, color: Colors.onSurfaceVariant },
  input: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
    paddingVertical: Spacing.md,
    fontSize: 28,
  },
  divider: { height: 1, backgroundColor: Colors.outlineVariant, marginVertical: Spacing.sm },
});
