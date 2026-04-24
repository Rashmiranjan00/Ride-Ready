import React from 'react';
import { View, ViewStyle, StyleSheet, StyleProp } from 'react-native';
import { Colors, BorderRadius, Spacing } from '@shared/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Adds a neon-cyan inner-top glow strip for emphasis */
  glowAccent?: boolean;
}

/**
 * GlassCard — primary structural unit across all RideReady screens.
 *
 * Implements the Stitch design system's glassmorphism pattern:
 * - Dark semi-transparent fill
 * - Rim-light 1px border on top + left edges (simulates glass instrument panel)
 * - Subtle inner gradient glow (optional, for primary metric cards)
 */
export const GlassCard: React.FC<GlassCardProps> = ({ children, style, glowAccent = false }) => {
  return <View style={[styles.card, glowAccent && styles.glowCard, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(19, 19, 19, 0.7)',
    borderRadius: BorderRadius.lg,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    borderLeftColor: 'rgba(255, 255, 255, 0.1)',
    // Right and bottom are separate to avoid full border override
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.04)',
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
    padding: Spacing.lg,
    overflow: 'hidden',
  },
  glowCard: {
    // Neon-cyan glow accent — use for primary metric cards
    shadowColor: Colors.primaryContainer,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
});
