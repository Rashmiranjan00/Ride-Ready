import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Satellite, Bluetooth, Battery, BatteryLow, BatteryMedium } from 'lucide-react-native';
import { Colors } from '@shared/theme';

interface StatusStripProps {
  gpsActive?: boolean;
  batteryLevel?: number; // 0–100
}

/**
 * StatusStrip — minimal icon-only cockpit status bar.
 * GPS / Bluetooth / Battery — no text, icons only.
 */
export const StatusStrip: React.FC<StatusStripProps> = ({
  gpsActive = false,
  batteryLevel = 100,
}) => {
  const BatteryIcon = batteryLevel > 60 ? Battery : batteryLevel > 20 ? BatteryMedium : BatteryLow;

  const batteryColor = batteryLevel > 20 ? Colors.onSurfaceVariant : Colors.error;

  return (
    <View style={styles.container}>
      <Satellite
        size={16}
        color={gpsActive ? Colors.primaryContainer : Colors.onSurfaceVariant}
        opacity={gpsActive ? 1 : 0.4}
      />
      <Bluetooth size={16} color={Colors.onSurfaceVariant} opacity={0.4} />
      <BatteryIcon size={16} color={batteryColor} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
});
