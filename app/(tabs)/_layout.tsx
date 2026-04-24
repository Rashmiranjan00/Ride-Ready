import { Tabs } from 'expo-router';
import { Zap, Navigation, BarChart3, Fuel, Settings } from 'lucide-react-native';
import { Colors } from '@shared/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surfaceContainerLow,
          borderTopColor: 'rgba(255,255,255,0.08)',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: Colors.primaryContainer,
        tabBarInactiveTintColor: Colors.onSurfaceVariant,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          letterSpacing: 0.5,
          textTransform: 'uppercase',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => (
            <Zap size={20} color={color} opacity={color === Colors.primaryContainer ? 1 : 0.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="ride"
        options={{
          title: 'Ride',
          tabBarIcon: ({ color }) => (
            <Navigation
              size={20}
              color={color}
              opacity={color === Colors.primaryContainer ? 1 : 0.5}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="summary"
        options={{
          title: 'Summary',
          tabBarIcon: ({ color }) => (
            <BarChart3
              size={20}
              color={color}
              opacity={color === Colors.primaryContainer ? 1 : 0.5}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="fuel"
        options={{
          title: 'Fuel',
          tabBarIcon: ({ color }) => (
            <Fuel size={20} color={color} opacity={color === Colors.primaryContainer ? 1 : 0.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <Settings
              size={20}
              color={color}
              opacity={color === Colors.primaryContainer ? 1 : 0.5}
            />
          ),
        }}
      />
    </Tabs>
  );
}
