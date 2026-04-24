import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import {
  Sun,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  Snowflake,
  CloudFog,
  Thermometer,
} from 'lucide-react-native';
import { GlassCard } from '@shared/components/GlassCard';
import { Colors, Typography, Spacing } from '@shared/theme';
import { WeatherData, WeatherCondition } from '@features/weather/types';

interface WeatherCardProps {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
}

const CONDITION_META: Record<
  WeatherCondition,
  { Icon: React.ElementType; label: string; rideable: boolean; rideLabel: string; color: string }
> = {
  clear: {
    Icon: Sun,
    label: 'Clear',
    rideable: true,
    rideLabel: 'Perfect riding conditions',
    color: Colors.primaryContainer,
  },
  clouds: {
    Icon: Cloud,
    label: 'Cloudy',
    rideable: true,
    rideLabel: 'Good conditions',
    color: Colors.onSurfaceVariant,
  },
  rain: {
    Icon: CloudRain,
    label: 'Rain',
    rideable: false,
    rideLabel: 'Wet roads — ride carefully',
    color: '#4A90E2',
  },
  drizzle: {
    Icon: CloudDrizzle,
    label: 'Drizzle',
    rideable: false,
    rideLabel: 'Light rain — be cautious',
    color: '#4A90E2',
  },
  thunderstorm: {
    Icon: CloudLightning,
    label: 'Storm',
    rideable: false,
    rideLabel: 'Unsafe — avoid riding',
    color: '#F5A623',
  },
  snow: {
    Icon: Snowflake,
    label: 'Snow',
    rideable: false,
    rideLabel: 'Unsafe — avoid riding',
    color: '#FFFFFF',
  },
  mist: {
    Icon: CloudFog,
    label: 'Foggy',
    rideable: false,
    rideLabel: 'Low visibility — be careful',
    color: Colors.onSurfaceVariant,
  },
  unknown: {
    Icon: Thermometer,
    label: 'Unknown',
    rideable: true,
    rideLabel: 'Check conditions',
    color: Colors.onSurfaceVariant,
  },
};

export const WeatherCard: React.FC<WeatherCardProps> = ({ data, loading, error }) => {
  if (loading) {
    return (
      <GlassCard style={styles.card}>
        <ActivityIndicator color={Colors.primaryContainer} size="small" />
        <Text style={styles.loadingText}>Fetching conditions…</Text>
      </GlassCard>
    );
  }

  if (!data) {
    return (
      <GlassCard style={styles.card}>
        <Text style={styles.errorText}>
          {error ? '⚠ Weather unavailable — check connection' : 'No data'}
        </Text>
      </GlassCard>
    );
  }

  const meta = CONDITION_META[data.condition];
  const WeatherIcon = meta.Icon;

  return (
    <GlassCard style={styles.card} glowAccent={meta.rideable}>
      {/* Header row */}
      <View style={styles.header}>
        <View>
          <Text style={styles.labelCaps}>CONDITIONS</Text>
          <Text style={styles.cityName}>{data.cityName}</Text>
        </View>
        <WeatherIcon size={48} color={meta.color} />
      </View>

      {/* Temp + ride label */}
      <View style={styles.tempRow}>
        <Text style={styles.temp}>{data.temp}°</Text>
        <View style={styles.rideLabel}>
          <View
            style={[
              styles.rideIndicator,
              {
                backgroundColor: meta.rideable ? Colors.secondaryContainer : Colors.errorContainer,
              },
            ]}
          />
          <Text style={styles.rideText}>{meta.rideLabel}</Text>
        </View>
      </View>

      {/* Detail row */}
      <View style={styles.detailRow}>
        <DetailChip label="FEELS" value={`${data.feelsLike}°`} />
        <DetailChip label="HUMIDITY" value={`${data.humidity}%`} />
        <DetailChip label="WIND" value={`${Math.round(data.windSpeed * 3.6)} km/h`} />
      </View>
    </GlassCard>
  );
};

const DetailChip: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.chip}>
    <Text style={styles.chipLabel}>{label}</Text>
    <Text style={styles.chipValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    gap: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  labelCaps: {
    ...Typography.labelCaps,
    color: Colors.onSurfaceVariant,
    marginBottom: 2,
  },
  cityName: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
    fontSize: 16,
    lineHeight: 20,
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  temp: {
    ...Typography.metricLarge,
    color: Colors.onSurface,
  },
  rideLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  rideIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  rideText: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    maxWidth: 140,
    flexShrink: 1,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  chip: {
    alignItems: 'center',
    gap: 2,
  },
  chipLabel: {
    ...Typography.labelCaps,
    color: Colors.onSurfaceVariant,
    fontSize: 10,
  },
  chipValue: {
    ...Typography.labelSm,
    color: Colors.onSurface,
    fontSize: 13,
  },
  loadingText: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  errorText: {
    ...Typography.labelSm,
    color: Colors.error,
    textAlign: 'center',
  },
});
