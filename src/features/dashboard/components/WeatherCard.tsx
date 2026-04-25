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
      {/* Header section (Conditions + Icon) */}
      <View style={styles.header}>
        <View style={styles.headerTextCol}>
          <Text style={styles.labelCaps}>CONDITIONS</Text>
          <View style={styles.tempRow}>
            <Text style={styles.temp}>{data.temp}°</Text>
            <Text style={styles.tempUnit}>C</Text>
          </View>
          <Text style={styles.rideText}>{meta.rideLabel}</Text>
        </View>
        <WeatherIcon size={48} color={meta.color} />
      </View>

      {/* Hourly Forecast Mock Row */}
      <View style={styles.forecastRow}>
        {[
          { time: 'Now', temp: data.temp, icon: meta.Icon },
          { time: '1 hr', temp: data.temp + 1, icon: meta.Icon },
          { time: '2 hr', temp: data.temp + 1, icon: Cloud },
          { time: '3 hr', temp: data.temp - 1, icon: Cloud },
        ].map((item, i) => (
          <View key={i} style={styles.forecastItem}>
            <Text style={styles.forecastTime}>{item.time}</Text>
            <item.icon size={20} color={meta.color} />
            <Text style={styles.forecastTemp}>{item.temp}°</Text>
          </View>
        ))}
      </View>

      {/* Detail row (Feels, Humidity, Wind) */}
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
  headerTextCol: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  labelCaps: {
    ...Typography.labelCaps,
    color: Colors.onSurfaceVariant,
    marginBottom: 8,
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    marginBottom: 4,
  },
  temp: {
    ...Typography.metricLarge,
    color: Colors.primaryContainer,
    lineHeight: 52, // adjust for visual alignment
  },
  tempUnit: {
    ...Typography.bodyLg,
    color: Colors.onSurface,
    paddingBottom: 6,
  },
  rideText: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
  },
  forecastRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: Spacing.md,
  },
  forecastItem: {
    alignItems: 'center',
    gap: 6,
  },
  forecastTime: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
  },
  forecastTemp: {
    ...Typography.labelSm,
    color: Colors.onSurface,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: Spacing.md,
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
