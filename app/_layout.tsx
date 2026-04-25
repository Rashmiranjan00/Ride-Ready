import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import {
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
  useFonts as useSpaceGrotesk,
} from '@expo-google-fonts/space-grotesk';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
  useFonts as useInter,
} from '@expo-google-fonts/inter';
import { getDatabase } from '@storage/database';

// Keep the splash screen visible until fonts + DB are ready
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [spaceGroteskLoaded] = useSpaceGrotesk({
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
  });

  const [interLoaded] = useInter({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  const fontsLoaded = spaceGroteskLoaded && interLoaded;

  useEffect(() => {
    async function prepare() {
      if (!fontsLoaded) return;
      // Initialize SQLite
      try {
        await getDatabase();
      } catch (e) {
        console.warn('DB init error', e);
      }
      await SplashScreen.hideAsync();
    }
    prepare();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="ride" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="ride-summary" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="fuel" options={{ headerShown: false, presentation: 'modal' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
