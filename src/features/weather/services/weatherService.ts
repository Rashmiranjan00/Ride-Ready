import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { ENV } from '@config/env';
import { logger } from '@services/logger';
import { WEATHER_CACHE_TTL_MS } from '@shared/constants';
import { WeatherCondition, WeatherData } from '../types';

const CACHE_KEY = 'rideready_weather_cache';

function mapCondition(main: string): WeatherCondition {
  const map: Record<string, WeatherCondition> = {
    Clear: 'clear',
    Clouds: 'clouds',
    Rain: 'rain',
    Drizzle: 'drizzle',
    Thunderstorm: 'thunderstorm',
    Snow: 'snow',
    Mist: 'mist',
    Smoke: 'mist',
    Haze: 'mist',
    Fog: 'mist',
  };
  return map[main] ?? 'unknown';
}

async function getCachedWeather(): Promise<WeatherData | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cached: WeatherData = JSON.parse(raw);
    const age = Date.now() - cached.fetchedAt;
    if (age < WEATHER_CACHE_TTL_MS) return cached;
    return null; // stale
  } catch {
    return null;
  }
}

async function cacheWeather(data: WeatherData): Promise<void> {
  try {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (e) {
    logger.warn('Failed to cache weather', e);
  }
}

export async function fetchWeather(): Promise<WeatherData> {
  // 1. Try cache first
  const cached = await getCachedWeather();
  if (cached) {
    logger.info('Weather served from cache');
    return cached;
  }

  // 2. Get current location
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Location permission denied');
  }

  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  const { latitude, longitude } = location.coords;

  // 3. Fetch from OpenWeatherMap
  const url = `${ENV.weatherBaseUrl}/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${ENV.weatherApiKey}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }

  const json = await response.json();

  const data: WeatherData = {
    temp: Math.round(json.main.temp),
    feelsLike: Math.round(json.main.feels_like),
    condition: mapCondition(json.weather[0].main),
    description: json.weather[0].description,
    humidity: json.main.humidity,
    windSpeed: json.wind.speed,
    visibility: json.visibility ?? 10000,
    cityName: json.name,
    fetchedAt: Date.now(),
  };

  await cacheWeather(data);
  logger.info('Weather fetched from API', { city: data.cityName, temp: data.temp });

  return data;
}

/** Returns last cached weather regardless of TTL (offline fallback) */
export async function getLastKnownWeather(): Promise<WeatherData | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
