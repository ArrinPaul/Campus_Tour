/**
 * Session Store - Manages kiosk mode, inactivity tracking, and attract mode
 * Handles automatic reset for public digital displays
 */

import { create } from 'zustand';

interface SessionState {
  // Session state
  isSessionActive: boolean;
  isAttractMode: boolean;
  showSplashScreen: boolean;
  lastActivityTime: number;

  // Inactivity tracking
  inactivityWarningShown: boolean;
  secondsUntilReset: number;

  // Settings
  inactivityTimeout: number; // seconds until warning
  resetTimeout: number; // seconds until full reset
  attractModeDelay: number; // seconds until attract mode starts

  // Actions
  startSession: () => void;
  endSession: () => void;
  recordActivity: () => void;
  showWarning: () => void;
  hideWarning: () => void;
  updateCountdown: (seconds: number) => void;
  resetToAttractMode: () => void;
  setInactivityTimeout: (seconds: number) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  // Initial state - Kiosk mode is OFF by default
  // Users get normal browsing experience unless kiosk mode is enabled
  isSessionActive: true, // Start with an active session (normal mode)
  isAttractMode: false, // Attract mode disabled by default
  showSplashScreen: false, // No splash screen by default
  lastActivityTime: Date.now(),
  inactivityWarningShown: false,
  secondsUntilReset: 30,

  // Default timeouts (in seconds)
  inactivityTimeout: 60, // Show warning after 60s
  resetTimeout: 30, // Reset after 30s warning
  attractModeDelay: 120, // Start attract mode after 2 minutes

  // Start a user session
  startSession: () =>
    set({
      isSessionActive: true,
      isAttractMode: false,
      showSplashScreen: false,
      lastActivityTime: Date.now(),
      inactivityWarningShown: false,
    }),

  // End session and return to attract mode
  endSession: () =>
    set({
      isSessionActive: false,
      isAttractMode: false,
      showSplashScreen: true,
      inactivityWarningShown: false,
    }),

  // Record user activity
  recordActivity: () =>
    set({
      lastActivityTime: Date.now(),
      inactivityWarningShown: false,
    }),

  // Show inactivity warning
  showWarning: () =>
    set((state) => ({
      inactivityWarningShown: true,
      secondsUntilReset: state.resetTimeout,
    })),

  // Hide warning
  hideWarning: () =>
    set({
      inactivityWarningShown: false,
    }),

  // Update countdown timer
  updateCountdown: (seconds: number) =>
    set({
      secondsUntilReset: seconds,
    }),

  // Reset to attract mode
  resetToAttractMode: () =>
    set({
      isSessionActive: false,
      isAttractMode: true,
      showSplashScreen: false,
      inactivityWarningShown: false,
      lastActivityTime: Date.now(),
    }),

  // Update inactivity timeout setting
  setInactivityTimeout: (seconds: number) =>
    set({
      inactivityTimeout: seconds,
    }),
}));
