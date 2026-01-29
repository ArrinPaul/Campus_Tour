/**
 * Feature Settings Store
 * Manages visibility and settings for optional features
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TimeOfDay = 'auto' | 'day' | 'night';

interface FeatureSettingsState {
  // Feature visibility
  showWeather: boolean;
  showEvents: boolean;
  showAnalytics: boolean;
  
  // Time of day simulation
  timeOfDay: TimeOfDay;
  
  // Kiosk mode settings
  kioskModeEnabled: boolean;
  attractModeEnabled: boolean;
  
  // Actions
  setShowWeather: (show: boolean) => void;
  setShowEvents: (show: boolean) => void;
  setShowAnalytics: (show: boolean) => void;
  setTimeOfDay: (time: TimeOfDay) => void;
  setKioskMode: (enabled: boolean) => void;
  setAttractMode: (enabled: boolean) => void;
  resetFeatures: () => void;
}

export const useFeatureSettingsStore = create<FeatureSettingsState>()(
  persist(
    (set) => ({
      // Default states - all features OFF by default
      showWeather: false,
      showEvents: false,
      showAnalytics: false,
      timeOfDay: 'auto',
      kioskModeEnabled: false,
      attractModeEnabled: false,
      
      // Actions
      setShowWeather: (show) => set({ showWeather: show }),
      setShowEvents: (show) => set({ showEvents: show }),
      setShowAnalytics: (show) => set({ showAnalytics: show }),
      setTimeOfDay: (time) => set({ timeOfDay: time }),
      setKioskMode: (enabled) => set({ kioskModeEnabled: enabled }),
      setAttractMode: (enabled) => set({ attractModeEnabled: enabled }),
      
      resetFeatures: () => set({
        showWeather: false,
        showEvents: false,
        showAnalytics: false,
        timeOfDay: 'auto',
        kioskModeEnabled: false,
        attractModeEnabled: false,
      }),
    }),
    {
      name: 'campus-tour-features',
    }
  )
);
