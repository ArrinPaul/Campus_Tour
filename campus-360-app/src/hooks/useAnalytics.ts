/**
 * Analytics Hook
 * Track user interactions, navigation paths, and popular locations
 */

import { useCallback, useEffect, useRef } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Event types for tracking
export type AnalyticsEventType =
  | 'page_view'
  | 'location_visit'
  | 'hotspot_click'
  | 'tour_start'
  | 'tour_complete'
  | 'bookmark_add'
  | 'share_click'
  | 'screenshot_taken'
  | 'settings_change'
  | 'error';

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  timestamp: number;
  data: Record<string, unknown>;
  sessionId: string;
}

export interface LocationStats {
  locationId: string;
  blockId: string;
  visitCount: number;
  totalTimeSpent: number; // milliseconds
  lastVisited: number;
}

interface AnalyticsState {
  // Session info
  sessionId: string;
  sessionStartTime: number;

  // Event log (limited to last 1000 events)
  events: AnalyticsEvent[];

  // Aggregated stats
  locationStats: Record<string, LocationStats>;
  totalPageViews: number;
  totalSessionTime: number;

  // Settings
  analyticsEnabled: boolean;
  debugMode: boolean;

  // Actions
  trackEvent: (type: AnalyticsEventType, data?: Record<string, unknown>) => void;
  trackLocationVisit: (blockId: string, locationId: string) => void;
  trackLocationLeave: (blockId: string, locationId: string) => void;
  setAnalyticsEnabled: (enabled: boolean) => void;
  setDebugMode: (enabled: boolean) => void;
  getPopularLocations: (limit?: number) => LocationStats[];
  getRecentEvents: (limit?: number) => AnalyticsEvent[];
  clearAnalytics: () => void;
}

// Generate unique session ID
const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

// Generate unique event ID
const generateEventId = (): string => {
  return `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

export const useAnalyticsStore = create<AnalyticsState>()(
  persist(
    (set, get) => ({
      sessionId: generateSessionId(),
      sessionStartTime: Date.now(),
      events: [],
      locationStats: {},
      totalPageViews: 0,
      totalSessionTime: 0,
      analyticsEnabled: true,
      debugMode: false,

      trackEvent: (type, data = {}) => {
        const state = get();
        if (!state.analyticsEnabled) return;

        const event: AnalyticsEvent = {
          id: generateEventId(),
          type,
          timestamp: Date.now(),
          data: {
            ...data,
            url: window.location.href,
            userAgent: navigator.userAgent,
          },
          sessionId: state.sessionId,
        };

        if (state.debugMode) {
          console.log('[Analytics]', type, data);
        }

        set((s) => ({
          events: [...s.events.slice(-999), event],
          totalPageViews: type === 'page_view' ? s.totalPageViews + 1 : s.totalPageViews,
        }));

        // Send to external analytics service (if configured)
        sendToAnalyticsService(event);
      },

      trackLocationVisit: (blockId, locationId) => {
        const state = get();
        if (!state.analyticsEnabled) return;

        const key = `${blockId}:${locationId}`;
        const existing = state.locationStats[key];

        set((s) => ({
          locationStats: {
            ...s.locationStats,
            [key]: {
              locationId,
              blockId,
              visitCount: (existing?.visitCount || 0) + 1,
              totalTimeSpent: existing?.totalTimeSpent || 0,
              lastVisited: Date.now(),
            },
          },
        }));

        state.trackEvent('location_visit', { blockId, locationId });
      },

      trackLocationLeave: (blockId, locationId) => {
        const state = get();
        if (!state.analyticsEnabled) return;

        const key = `${blockId}:${locationId}`;
        const existing = state.locationStats[key];

        if (existing) {
          const timeSpent = Date.now() - existing.lastVisited;
          set((s) => ({
            locationStats: {
              ...s.locationStats,
              [key]: {
                ...existing,
                totalTimeSpent: existing.totalTimeSpent + timeSpent,
              },
            },
          }));
        }
      },

      setAnalyticsEnabled: (enabled) => set({ analyticsEnabled: enabled }),

      setDebugMode: (enabled) => set({ debugMode: enabled }),

      getPopularLocations: (limit = 10) => {
        const stats = Object.values(get().locationStats);
        return stats.sort((a, b) => b.visitCount - a.visitCount).slice(0, limit);
      },

      getRecentEvents: (limit = 50) => {
        return get().events.slice(-limit).reverse();
      },

      clearAnalytics: () =>
        set({
          events: [],
          locationStats: {},
          totalPageViews: 0,
          sessionId: generateSessionId(),
          sessionStartTime: Date.now(),
        }),
    }),
    {
      name: 'campus-tour-analytics',
      partialize: (state) => ({
        locationStats: state.locationStats,
        totalPageViews: state.totalPageViews,
        analyticsEnabled: state.analyticsEnabled,
      }),
    }
  )
);

// Placeholder for external analytics service integration
// Replace with actual implementation (Google Analytics, Mixpanel, etc.)
const sendToAnalyticsService = (event: AnalyticsEvent): void => {
  // Example: Google Analytics 4
  if (typeof window !== 'undefined' && 'gtag' in window) {
    const gtag = (window as unknown as { gtag: (...args: unknown[]) => void }).gtag;
    gtag('event', event.type, {
      event_category: 'tour',
      event_label: JSON.stringify(event.data),
      value: event.timestamp,
    });
  }

  // Example: Custom analytics endpoint
  // fetch('/api/analytics', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(event),
  // }).catch(() => {});
};

/**
 * Hook to track page/location visits with automatic leave tracking
 */
export const useLocationTracking = (blockId: string | null, locationId: string | null) => {
  const { trackLocationVisit, trackLocationLeave } = useAnalyticsStore();
  const lastLocationRef = useRef<{ blockId: string; locationId: string } | null>(null);

  useEffect(() => {
    if (!blockId || !locationId) return;

    // Track leave for previous location
    if (lastLocationRef.current) {
      trackLocationLeave(lastLocationRef.current.blockId, lastLocationRef.current.locationId);
    }

    // Track visit for new location
    trackLocationVisit(blockId, locationId);
    lastLocationRef.current = { blockId, locationId };

    // Track leave on unmount
    return () => {
      if (lastLocationRef.current) {
        trackLocationLeave(lastLocationRef.current.blockId, lastLocationRef.current.locationId);
      }
    };
  }, [blockId, locationId, trackLocationVisit, trackLocationLeave]);
};

/**
 * Hook for tracking general events
 */
export const useAnalytics = () => {
  const { trackEvent, analyticsEnabled, debugMode, setAnalyticsEnabled, setDebugMode } =
    useAnalyticsStore();

  const track = useCallback(
    (type: AnalyticsEventType, data?: Record<string, unknown>) => {
      trackEvent(type, data);
    },
    [trackEvent]
  );

  return {
    track,
    trackEvent,
    analyticsEnabled,
    debugMode,
    setAnalyticsEnabled,
    setDebugMode,
  };
};

export default useAnalyticsStore;
