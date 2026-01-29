/**
 * Weather Store - Manages campus weather data
 * Can fetch from real API or use mock data
 */

import { create } from 'zustand';

export interface WeatherData {
  temperature: number; // in Celsius
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy' | 'foggy' | 'clear';
  humidity: number; // percentage
  windSpeed: number; // km/h
  description: string;
  icon: string;
  lastUpdated: number;
}

interface WeatherState {
  weather: WeatherData | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchWeather: () => Promise<void>;
  setWeather: (weather: WeatherData) => void;
  clearError: () => void;
}

// Mock weather data (replace with real API in production)
const getMockWeather = (): WeatherData => {
  const conditions: WeatherData['condition'][] = ['sunny', 'cloudy', 'rainy', 'clear'];
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];

  return {
    temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
    condition: randomCondition,
    humidity: Math.floor(Math.random() * 30) + 40, // 40-70%
    windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
    description: `${randomCondition.charAt(0).toUpperCase() + randomCondition.slice(1)} skies`,
    icon: randomCondition,
    lastUpdated: Date.now(),
  };
};

// Optional: Real weather API integration (exported for future use)
export const fetchRealWeather = async (
  lat: number,
  lon: number,
  apiKey?: string
): Promise<WeatherData> => {
  if (!apiKey) {
    // Return mock data if no API key provided
    return getMockWeather();
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) throw new Error('Weather fetch failed');

    const data = await response.json();

    return {
      temperature: Math.round(data.main.temp),
      condition: mapWeatherCondition(data.weather[0].main),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // m/s to km/h
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      lastUpdated: Date.now(),
    };
  } catch (error) {
    console.error('Weather API error:', error);
    return getMockWeather();
  }
};

const mapWeatherCondition = (condition: string): WeatherData['condition'] => {
  const lower = condition.toLowerCase();
  if (lower.includes('clear')) return 'clear';
  if (lower.includes('sun')) return 'sunny';
  if (lower.includes('cloud')) return 'cloudy';
  if (lower.includes('rain')) return 'rainy';
  if (lower.includes('storm') || lower.includes('thunder')) return 'stormy';
  if (lower.includes('snow')) return 'snowy';
  if (lower.includes('fog') || lower.includes('mist')) return 'foggy';
  return 'clear';
};

export const useWeatherStore = create<WeatherState>((set) => ({
  weather: null,
  isLoading: false,
  error: null,

  fetchWeather: async () => {
    set({ isLoading: true, error: null });

    try {
      // You can replace with real coordinates and API key
      // const weather = await fetchRealWeather(28.6139, 77.2090, process.env.VITE_WEATHER_API_KEY);

      // Using mock data for now
      const weather = getMockWeather();

      set({ weather, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch weather',
        isLoading: false,
      });
    }
  },

  setWeather: (weather) => set({ weather }),
  clearError: () => set({ error: null }),
}));
