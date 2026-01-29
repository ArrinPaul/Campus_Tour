/**
 * Time of Day Effect
 * Applies day/night filter overlay to simulate different times of day
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { TimeOfDay } from '../../hooks/useFeatureSettingsStore';

interface TimeOfDayOverlayProps {
  timeOfDay: TimeOfDay;
}

export const TimeOfDayOverlay: React.FC<TimeOfDayOverlayProps> = ({ timeOfDay }) => {
  const [currentTime, setCurrentTime] = useState<'day' | 'night'>('day');

  // Auto-detect time based on system clock
  useEffect(() => {
    if (timeOfDay === 'auto') {
      const updateTime = () => {
        const hour = new Date().getHours();
        setCurrentTime(hour >= 6 && hour < 18 ? 'day' : 'night');
      };
      
      updateTime();
      const interval = setInterval(updateTime, 60000); // Check every minute
      
      return () => clearInterval(interval);
    } else {
      setCurrentTime(timeOfDay);
    }
  }, [timeOfDay]);

  // Don't render overlay for day mode
  if (currentTime === 'day') {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 pointer-events-none z-10"
      style={{
        background: 'linear-gradient(to bottom, rgba(10, 20, 45, 0.4) 0%, rgba(15, 25, 55, 0.3) 50%, rgba(20, 30, 60, 0.4) 100%)',
        mixBlendMode: 'multiply',
      }}
    >
      {/* Stars effect for night mode */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              opacity: Math.random() * 0.5 + 0.3,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Moon glow in corner */}
      <motion.div
        className="absolute top-20 right-32 w-16 h-16 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 220, 0.9) 0%, rgba(255, 255, 200, 0.4) 50%, transparent 70%)',
          boxShadow: '0 0 60px 30px rgba(255, 255, 200, 0.2)',
        }}
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
};

/**
 * Time Indicator Badge
 * Shows current time of day setting
 */
export const TimeIndicator: React.FC<{ timeOfDay: TimeOfDay }> = ({ timeOfDay }) => {
  if (timeOfDay === 'auto') return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-40"
    >
      <div className={`px-3 py-1.5 rounded-full backdrop-blur-md border text-sm font-medium flex items-center gap-2 ${
        timeOfDay === 'night'
          ? 'bg-indigo-900/50 border-indigo-500/30 text-indigo-200'
          : 'bg-orange-500/20 border-orange-500/30 text-orange-200'
      }`}>
        {timeOfDay === 'night' ? '🌙' : '☀️'}
        <span>{timeOfDay === 'night' ? 'Night Mode' : 'Day Mode'}</span>
      </div>
    </motion.div>
  );
};
