/**
 * Activity Tracker Hook
 * Monitors user activity and triggers warnings/resets for kiosk mode
 */

import { useEffect, useCallback } from 'react';
import { useSessionStore } from './useSessionStore';

export const useActivityTracker = () => {
  const {
    isSessionActive,
    lastActivityTime,
    inactivityTimeout,
    inactivityWarningShown,
    recordActivity,
    showWarning,
  } = useSessionStore();

  // Track user activity events
  const handleActivity = useCallback(() => {
    if (isSessionActive) {
      recordActivity();
    }
  }, [isSessionActive, recordActivity]);

  // Set up activity listeners
  useEffect(() => {
    if (!isSessionActive) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click', 'wheel'];

    // Throttle activity recording to avoid excessive updates
    let timeoutId: number;
    const throttledActivity = () => {
      if (timeoutId) return;
      timeoutId = window.setTimeout(() => {
        handleActivity();
        timeoutId = 0;
      }, 1000); // Throttle to once per second
    };

    events.forEach((event) => {
      window.addEventListener(event, throttledActivity);
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, throttledActivity);
      });
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isSessionActive, handleActivity]);

  // Check for inactivity
  useEffect(() => {
    if (!isSessionActive || inactivityWarningShown) return;

    const checkInterval = setInterval(() => {
      const timeSinceActivity = Date.now() - lastActivityTime;
      const inactivityMs = inactivityTimeout * 1000;

      // Show warning if user has been inactive
      if (timeSinceActivity >= inactivityMs) {
        showWarning();
      }
    }, 1000); // Check every second

    return () => clearInterval(checkInterval);
  }, [isSessionActive, lastActivityTime, inactivityTimeout, inactivityWarningShown, showWarning]);

  return {
    handleActivity,
  };
};
