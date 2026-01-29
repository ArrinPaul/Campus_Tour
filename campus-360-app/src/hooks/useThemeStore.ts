/**
 * Theme Store
 * Manage dark/light theme with system preference detection
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

// Get system preference
const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Resolve the actual theme based on mode
const resolveTheme = (mode: ThemeMode): 'light' | 'dark' => {
  if (mode === 'system') {
    return getSystemTheme();
  }
  return mode;
};

// Apply theme to document
const applyTheme = (theme: 'light' | 'dark'): void => {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  if (theme === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
  }

  // Update meta theme-color
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', theme === 'dark' ? '#0f172a' : '#f8fafc');
  }
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'dark',
      resolvedTheme: 'dark',

      setMode: (mode) => {
        const resolvedTheme = resolveTheme(mode);
        applyTheme(resolvedTheme);
        set({ mode, resolvedTheme });
      },

      toggleTheme: () => {
        const current = get().mode;
        let newMode: ThemeMode;

        if (current === 'dark') {
          newMode = 'light';
        } else if (current === 'light') {
          newMode = 'system';
        } else {
          newMode = 'dark';
        }

        get().setMode(newMode);
      },
    }),
    {
      name: 'campus-tour-theme',
      onRehydrateStorage: () => (state) => {
        // Apply theme after rehydration
        if (state) {
          const resolvedTheme = resolveTheme(state.mode);
          applyTheme(resolvedTheme);
          // Update resolved theme in case system preference changed
          if (state.resolvedTheme !== resolvedTheme) {
            state.resolvedTheme = resolvedTheme;
          }
        }
      },
    }
  )
);

// Listen to system theme changes
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const handleChange = () => {
    const state = useThemeStore.getState();
    if (state.mode === 'system') {
      const resolvedTheme = getSystemTheme();
      applyTheme(resolvedTheme);
      useThemeStore.setState({ resolvedTheme });
    }
  };

  mediaQuery.addEventListener('change', handleChange);
}

export default useThemeStore;
