/**
 * Weather Widget Component
 * Displays current campus weather conditions
 */

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWeatherStore } from '../../hooks/useWeatherStore';
import { Cloud, CloudRain, Sun, CloudSnow, Wind, Droplets, CloudFog } from 'lucide-react';

export const WeatherWidget: React.FC = () => {
  const { weather, isLoading, fetchWeather } = useWeatherStore();

  // Fetch weather on mount and refresh every 30 minutes
  useEffect(() => {
    fetchWeather();

    const interval = setInterval(
      () => {
        fetchWeather();
      },
      30 * 60 * 1000
    ); // 30 minutes

    return () => clearInterval(interval);
  }, [fetchWeather]);

  const getWeatherIcon = (condition: string) => {
    const iconProps = { className: 'w-8 h-8' };

    switch (condition) {
      case 'sunny':
      case 'clear':
        return <Sun {...iconProps} className="w-8 h-8 text-yellow-400" />;
      case 'cloudy':
        return <Cloud {...iconProps} className="w-8 h-8 text-gray-400" />;
      case 'rainy':
        return <CloudRain {...iconProps} className="w-8 h-8 text-blue-400" />;
      case 'snowy':
        return <CloudSnow {...iconProps} className="w-8 h-8 text-blue-200" />;
      case 'foggy':
        return <CloudFog {...iconProps} className="w-8 h-8 text-gray-500" />;
      default:
        return <Cloud {...iconProps} className="w-8 h-8 text-gray-400" />;
    }
  };

  if (isLoading || !weather) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20"
      >
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <Cloud className="w-5 h-5 animate-pulse" />
          <span>Loading weather...</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20 shadow-lg"
    >
      <div className="flex items-center gap-4">
        {/* Weather Icon */}
        <div className="flex-shrink-0">{getWeatherIcon(weather.condition)}</div>

        {/* Temperature */}
        <div className="flex-shrink-0">
          <div className="text-3xl font-bold text-white">{weather.temperature}°C</div>
          <div className="text-xs text-white/70 capitalize">{weather.description}</div>
        </div>

        {/* Additional Info */}
        <div className="flex gap-4 text-xs text-white/80 border-l border-white/20 pl-4">
          <div className="flex items-center gap-1">
            <Droplets className="w-4 h-4" />
            <span>{weather.humidity}%</span>
          </div>
          <div className="flex items-center gap-1">
            <Wind className="w-4 h-4" />
            <span>{weather.windSpeed} km/h</span>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-[10px] text-white/40 mt-1 text-right">
        Updated{' '}
        {new Date(weather.lastUpdated).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
    </motion.div>
  );
};
