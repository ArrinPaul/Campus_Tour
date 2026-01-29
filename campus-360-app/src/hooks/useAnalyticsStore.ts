/**
 * Analytics Store - Tracks user behavior and tour statistics
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LocationVisit {
  locationId: string;
  locationName: string;
  timestamp: number;
  duration: number; // seconds spent at location
}

export interface SessionData {
  id: string;
  startTime: number;
  endTime?: number;
  duration?: number; // total session duration in seconds
  locationsVisited: number;
  path: string[]; // Array of location IDs in order visited
  device: 'mobile' | 'tablet' | 'desktop';
  hasCompletedTour: boolean;
}

export interface LocationStats {
  locationId: string;
  locationName: string;
  visitCount: number;
  totalTimeSpent: number; // total seconds across all visits
  avgTimeSpent: number; // average seconds per visit
  lastVisited: number;
}

interface AnalyticsState {
  // Current session
  currentSession: SessionData | null;
  currentLocationId: string | null;
  locationEntryTime: number | null;

  // Historical data
  sessions: SessionData[];
  locationVisits: LocationVisit[];
  locationStats: Map<string, LocationStats>;

  // Aggregate stats
  totalSessions: number;
  totalLocationsVisited: number;
  avgSessionDuration: number;

  // Actions
  startSession: () => void;
  endSession: () => void;
  trackLocationEnter: (locationId: string, locationName: string) => void;
  trackLocationExit: () => void;
  getTopLocations: (limit?: number) => LocationStats[];
  getRecentSessions: (limit?: number) => SessionData[];
  getTotalStats: () => {
    totalSessions: number;
    totalLocations: number;
    avgDuration: number;
    totalViews: number;
  };
  clearAnalytics: () => void;
}

const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

export const useAnalyticsStore = create<AnalyticsState>()(
  persist(
    (set, get) => ({
      currentSession: null,
      currentLocationId: null,
      locationEntryTime: null,
      sessions: [],
      locationVisits: [],
      locationStats: new Map(),
      totalSessions: 0,
      totalLocationsVisited: 0,
      avgSessionDuration: 0,

      startSession: () => {
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newSession: SessionData = {
          id: sessionId,
          startTime: Date.now(),
          locationsVisited: 0,
          path: [],
          device: getDeviceType(),
          hasCompletedTour: false,
        };

        set({
          currentSession: newSession,
          totalSessions: get().totalSessions + 1,
        });
      },

      endSession: () => {
        const { currentSession, sessions } = get();
        if (!currentSession) return;

        // Track location exit if user was viewing one
        get().trackLocationExit();

        const endTime = Date.now();
        const duration = Math.floor((endTime - currentSession.startTime) / 1000);

        const completedSession: SessionData = {
          ...currentSession,
          endTime,
          duration,
        };

        const allSessions = [...sessions, completedSession];
        const avgDuration =
          allSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / allSessions.length;

        set({
          currentSession: null,
          sessions: allSessions,
          avgSessionDuration: avgDuration,
        });
      },

      trackLocationEnter: (locationId: string, _locationName: string) => {
        const { currentSession, currentLocationId } = get();

        // Exit previous location if exists
        if (currentLocationId) {
          get().trackLocationExit();
        }

        set({
          currentLocationId: locationId,
          locationEntryTime: Date.now(),
        });

        // Update session path
        if (currentSession) {
          set({
            currentSession: {
              ...currentSession,
              path: [...currentSession.path, locationId],
              locationsVisited: currentSession.locationsVisited + 1,
            },
            totalLocationsVisited: get().totalLocationsVisited + 1,
          });
        }
      },

      trackLocationExit: () => {
        const { currentLocationId, locationEntryTime, locationVisits, locationStats } = get();
        if (!currentLocationId || !locationEntryTime) return;

        const duration = Math.floor((Date.now() - locationEntryTime) / 1000);

        // Create visit record
        const visit: LocationVisit = {
          locationId: currentLocationId,
          locationName: currentLocationId, // You can enhance this with actual names
          timestamp: locationEntryTime,
          duration,
        };

        // Update location stats
        const existingStats = locationStats.get(currentLocationId);
        const newStats: LocationStats = existingStats
          ? {
              ...existingStats,
              visitCount: existingStats.visitCount + 1,
              totalTimeSpent: existingStats.totalTimeSpent + duration,
              avgTimeSpent:
                (existingStats.totalTimeSpent + duration) / (existingStats.visitCount + 1),
              lastVisited: Date.now(),
            }
          : {
              locationId: currentLocationId,
              locationName: currentLocationId,
              visitCount: 1,
              totalTimeSpent: duration,
              avgTimeSpent: duration,
              lastVisited: Date.now(),
            };

        const updatedStats = new Map(locationStats);
        updatedStats.set(currentLocationId, newStats);

        set({
          locationVisits: [...locationVisits, visit],
          locationStats: updatedStats,
          currentLocationId: null,
          locationEntryTime: null,
        });
      },

      getTopLocations: (limit = 10) => {
        const { locationStats } = get();
        return Array.from(locationStats.values())
          .sort((a, b) => b.visitCount - a.visitCount)
          .slice(0, limit);
      },

      getRecentSessions: (limit = 10) => {
        return get().sessions.slice(-limit).reverse();
      },

      getTotalStats: () => {
        const { sessions, locationStats, totalSessions } = get();
        const totalViews = Array.from(locationStats.values()).reduce(
          (sum, stat) => sum + stat.visitCount,
          0
        );
        const avgDuration =
          sessions.length > 0
            ? sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / sessions.length
            : 0;

        return {
          totalSessions,
          totalLocations: locationStats.size,
          avgDuration,
          totalViews,
        };
      },

      clearAnalytics: () => {
        set({
          currentSession: null,
          currentLocationId: null,
          locationEntryTime: null,
          sessions: [],
          locationVisits: [],
          locationStats: new Map(),
          totalSessions: 0,
          totalLocationsVisited: 0,
          avgSessionDuration: 0,
        });
      },
    }),
    {
      name: 'campus-tour-analytics',
      // Only persist historical data, not current session state
      partialize: (state) => ({
        sessions: state.sessions,
        locationVisits: state.locationVisits,
        locationStats: Array.from(state.locationStats.entries()), // Convert Map to array for storage
        totalSessions: state.totalSessions,
        totalLocationsVisited: state.totalLocationsVisited,
        avgSessionDuration: state.avgSessionDuration,
      }),
      // Restore Map from array
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.locationStats)) {
          state.locationStats = new Map(state.locationStats as [string, LocationStats][]);
        }
      },
    }
  )
);
