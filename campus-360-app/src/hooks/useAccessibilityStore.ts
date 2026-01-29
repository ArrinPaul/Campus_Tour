/**
 * Accessibility Store - Manages accessibility settings
 * High Contrast Mode, One-Hand Mode, and other accessibility features
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type HandPreference = 'left' | 'right';

interface AccessibilityState {
  // High Contrast Mode
  highContrastMode: boolean;
  
  // One-Hand Mode
  oneHandMode: boolean;
  handPreference: HandPreference;
  
  // Other accessibility settings
  reduceMotion: boolean;
  largeText: boolean;
  screenReaderOptimized: boolean;
  
  // Actions
  toggleHighContrast: () => void;
  setHighContrast: (enabled: boolean) => void;
  toggleOneHandMode: () => void;
  setOneHandMode: (enabled: boolean) => void;
  setHandPreference: (hand: HandPreference) => void;
  toggleReduceMotion: () => void;
  toggleLargeText: () => void;
  toggleScreenReaderOptimized: () => void;
  resetAccessibility: () => void;
}

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set) => ({
      // Default states
      highContrastMode: false,
      oneHandMode: false,
      handPreference: 'right',
      reduceMotion: false,
      largeText: false,
      screenReaderOptimized: false,
      
      // Actions
      toggleHighContrast: () => set((state) => ({ 
        highContrastMode: !state.highContrastMode 
      })),
      
      setHighContrast: (enabled) => set({ highContrastMode: enabled }),
      
      toggleOneHandMode: () => set((state) => ({ 
        oneHandMode: !state.oneHandMode 
      })),
      
      setOneHandMode: (enabled) => set({ oneHandMode: enabled }),
      
      setHandPreference: (hand) => set({ handPreference: hand }),
      
      toggleReduceMotion: () => set((state) => ({ 
        reduceMotion: !state.reduceMotion 
      })),
      
      toggleLargeText: () => set((state) => ({ 
        largeText: !state.largeText 
      })),
      
      toggleScreenReaderOptimized: () => set((state) => ({ 
        screenReaderOptimized: !state.screenReaderOptimized 
      })),
      
      resetAccessibility: () => set({
        highContrastMode: false,
        oneHandMode: false,
        handPreference: 'right',
        reduceMotion: false,
        largeText: false,
        screenReaderOptimized: false,
      }),
    }),
    {
      name: 'campus-tour-accessibility',
    }
  )
);
