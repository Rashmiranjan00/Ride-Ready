// Environment config — reads from .env via Expo's EXPO_PUBLIC_ convention
// Add EXPO_PUBLIC_WEATHER_API_KEY=your_key to .env

export const ENV = {
  weatherApiKey: process.env.EXPO_PUBLIC_WEATHER_API_KEY ?? '',
  weatherBaseUrl: 'https://api.openweathermap.org/data/2.5',
} as const;
