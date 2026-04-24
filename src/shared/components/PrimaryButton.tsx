import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
  ActivityIndicator,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@shared/theme';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  /** 'primary' = neon cyan | 'danger' = red glow | 'ghost' = outline only */
  variant?: 'primary' | 'danger' | 'ghost';
  style?: StyleProp<ViewStyle>;
}

/**
 * PrimaryButton — large, tactile button.
 * Min-height 56px to accommodate gloved taps.
 * Features inner glow and active scale-down animation via opacity feedback.
 */
export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  style,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'danger' && styles.danger,
        variant === 'ghost' && styles.ghost,
        (disabled || loading) && styles.disabled,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? Colors.onPrimary : Colors.error}
          size="small"
        />
      ) : (
        <Text
          style={[
            styles.label,
            variant === 'ghost' && styles.ghostLabel,
            variant === 'danger' && styles.dangerLabel,
          ]}>
          {label.toUpperCase()}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    minHeight: 56,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  primary: {
    backgroundColor: Colors.primaryContainer,
    shadowColor: Colors.primaryContainer,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  danger: {
    backgroundColor: 'rgba(147, 0, 10, 0.2)',
    borderWidth: 2,
    borderColor: Colors.error,
    shadowColor: Colors.errorContainer,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    ...Typography.headlineMd,
    color: Colors.onPrimary,
    letterSpacing: 2,
  },
  ghostLabel: {
    color: Colors.onSurface,
  },
  dangerLabel: {
    color: Colors.error,
  },
});
