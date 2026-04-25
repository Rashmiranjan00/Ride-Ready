import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GlassCard } from '@shared/components/GlassCard';
import { Colors, Typography, Spacing, BorderRadius } from '@shared/theme';
import { CHECKLIST_ITEMS } from '@shared/constants';

type ChecklistState = Record<string, boolean>;

const STORAGE_KEY = 'rideready_checklist';
const TODAY_KEY = 'rideready_checklist_date';

function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Checklist — 4 pre-ride items with a custom toggle switch matching the Stitch design.
 */
export const Checklist: React.FC = () => {
  const [checked, setChecked] = useState<ChecklistState>({});

  useEffect(() => {
    loadState();
  }, []);

  async function loadState() {
    try {
      const savedDate = await AsyncStorage.getItem(TODAY_KEY);
      const today = getTodayKey();
      if (savedDate !== today) {
        await AsyncStorage.setItem(TODAY_KEY, today);
        await AsyncStorage.removeItem(STORAGE_KEY);
        setChecked({});
        return;
      }
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) setChecked(JSON.parse(raw));
    } catch {}
  }

  async function toggle(id: string) {
    const next = { ...checked, [id]: !checked[id] };
    setChecked(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    Haptics.impactAsync(
      next[id] ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Rigid
    );
  }

  return (
    <GlassCard style={styles.card}>
      <Text style={styles.labelCaps}>PRE-RIDE CHECKS</Text>

      <View style={styles.items}>
        {CHECKLIST_ITEMS.map((item) => (
          <ChecklistItem
            key={item.id}
            label={item.label}
            isChecked={!!checked[item.id]}
            onToggle={() => toggle(item.id)}
          />
        ))}
      </View>
    </GlassCard>
  );
};

const ChecklistItem: React.FC<{ label: string; isChecked: boolean; onToggle: () => void }> = ({
  label,
  isChecked,
  onToggle,
}) => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onToggle} style={styles.item}>
      <Text style={[styles.itemLabel, isChecked && styles.itemLabelChecked]}>{label}</Text>
      <View style={[styles.toggleTrack, isChecked && styles.toggleTrackChecked]}>
        <View style={[styles.toggleThumb, isChecked && styles.toggleThumbChecked]} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: Spacing.md,
  },
  labelCaps: {
    ...Typography.labelCaps,
    color: Colors.onSurfaceVariant,
    marginBottom: Spacing.xs,
  },
  items: {
    flexDirection: 'column',
    gap: Spacing.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    backgroundColor: 'rgba(255,255,255,0.02)', // surface-container/50 roughly
  },
  itemLabel: {
    ...Typography.bodyLg,
    color: Colors.onSurface,
    fontSize: 16,
  },
  itemLabelChecked: {
    color: Colors.primaryContainer,
  },
  toggleTrack: {
    width: 48,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  toggleTrackChecked: {
    backgroundColor: 'rgba(0, 240, 255, 0.2)', // primary-container/20
    borderColor: 'rgba(0, 240, 255, 0.4)',
  },
  toggleThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.onSurfaceVariant,
  },
  toggleThumbChecked: {
    backgroundColor: Colors.primaryContainer,
    transform: [{ translateX: 24 }],
    shadowColor: Colors.primaryContainer,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
});
