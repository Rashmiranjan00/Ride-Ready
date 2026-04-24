import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
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
 * Checklist — 4 pre-ride items with tap-to-toggle.
 * State resets daily (each new day starts fresh).
 * Provides haptic feedback on toggle.
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
        // New day — reset checklist
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

  const allChecked = CHECKLIST_ITEMS.every((item) => checked[item.id]);

  return (
    <GlassCard style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.labelCaps}>PRE-RIDE CHECKLIST</Text>
        {allChecked && <Text style={styles.allGood}>✓ ALL CLEAR</Text>}
      </View>

      <View style={styles.items}>
        {CHECKLIST_ITEMS.map((item) => {
          const isChecked = !!checked[item.id];
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              onPress={() => toggle(item.id)}
              style={[styles.item, isChecked && styles.itemChecked]}>
              <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                {isChecked && <Check size={14} color={Colors.onSecondary} strokeWidth={3} />}
              </View>
              <Text style={[styles.itemLabel, isChecked && styles.itemLabelChecked]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </GlassCard>
  );
};

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
  allGood: {
    ...Typography.labelCaps,
    color: Colors.secondaryContainer,
    fontSize: 10,
  },
  items: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    backgroundColor: 'rgba(255,255,255,0.02)',
    minHeight: Spacing.xxxl,
  },
  itemChecked: {
    borderColor: Colors.secondaryContainer,
    backgroundColor: Colors.secondaryContainer + '18',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.secondaryContainer,
    borderColor: Colors.secondaryContainer,
  },
  checkmark: {
    color: Colors.onSecondary,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 14,
  },
  itemLabel: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    fontSize: 13,
    fontWeight: '500',
  },
  itemLabelChecked: {
    color: Colors.secondaryContainer,
  },
});
