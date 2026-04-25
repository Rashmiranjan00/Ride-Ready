import { Tabs } from 'expo-router';
import { Gauge, LineChart, Settings } from 'lucide-react-native';
import { Colors } from '@shared/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(10, 10, 10, 0.9)', // #0A0A0A at 90%
          borderTopColor: 'rgba(255,255,255,0.1)',
          borderTopWidth: 1,
          height: 80,
          paddingTop: 8,
          paddingBottom: 24, // to accommodate the bottom safe area somewhat while matching the h-20 pb-4
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.5,
          shadowRadius: 20,
        },
        tabBarItemStyle: {
          borderRadius: 12,
          marginHorizontal: 16,
          marginVertical: 4,
          paddingTop: 4,
        },
        tabBarActiveBackgroundColor: 'transparent',
        tabBarActiveTintColor: Colors.primaryContainer,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.4)', // white/40
        tabBarLabelStyle: {
          fontFamily: 'SpaceGrotesk_500Medium',
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: 1.5, // tracking-widest
          paddingBottom: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <Gauge size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="summary"
        options={{
          title: 'Summary',
          tabBarIcon: ({ color }) => <LineChart size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
