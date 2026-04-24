export type WeatherCondition =
  | 'clear'
  | 'clouds'
  | 'rain'
  | 'drizzle'
  | 'thunderstorm'
  | 'snow'
  | 'mist'
  | 'unknown';

export type WeatherData = {
  temp: number; // Celsius
  feelsLike: number;
  condition: WeatherCondition;
  description: string;
  humidity: number;
  windSpeed: number; // m/s
  visibility: number; // meters
  cityName: string;
  fetchedAt: number; // Unix ms timestamp
};

export type WeatherState = {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
};
