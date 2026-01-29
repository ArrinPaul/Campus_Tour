/**
 * Admin Store - Manages editable POI and location data
 * Allows updating content without code changes
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface EditablePOI {
  id: string;
  locationId: string;
  title: string;
  description: string;
  x: number;
  y: number;
  z: number;
  image?: string;
  video?: string;
  isVisible: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface LocationOverride {
  locationId: string;
  customName?: string;
  customDescription?: string;
  isHidden: boolean;
  sortOrder?: number;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isActive: boolean;
  showOnLocations: string[]; // Empty = show everywhere
  expiresAt?: number;
  createdAt: number;
}

interface AdminState {
  // Authentication (simple for demo)
  isAdminMode: boolean;
  adminPassword: string;
  
  // Editable content
  customPOIs: EditablePOI[];
  locationOverrides: Map<string, LocationOverride>;
  announcements: Announcement[];
  
  // Settings
  maintenanceMode: boolean;
  maintenanceMessage: string;
  
  // Actions - Auth
  enableAdminMode: (password: string) => boolean;
  disableAdminMode: () => void;
  setAdminPassword: (password: string) => void;
  
  // Actions - POI
  addPOI: (poi: Omit<EditablePOI, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePOI: (id: string, updates: Partial<EditablePOI>) => void;
  deletePOI: (id: string) => void;
  getPOIsForLocation: (locationId: string) => EditablePOI[];
  
  // Actions - Location Overrides
  setLocationOverride: (locationId: string, override: Partial<LocationOverride>) => void;
  removeLocationOverride: (locationId: string) => void;
  
  // Actions - Announcements
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt'>) => void;
  updateAnnouncement: (id: string, updates: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;
  getActiveAnnouncements: (locationId?: string) => Announcement[];
  
  // Actions - Maintenance
  setMaintenanceMode: (enabled: boolean, message?: string) => void;
  
  // Export/Import
  exportData: () => string;
  importData: (data: string) => boolean;
}

const DEFAULT_ADMIN_PASSWORD = 'admin123'; // Change in production!

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAdminMode: false,
      adminPassword: DEFAULT_ADMIN_PASSWORD,
      customPOIs: [],
      locationOverrides: new Map(),
      announcements: [],
      maintenanceMode: false,
      maintenanceMessage: 'The virtual tour is temporarily unavailable for maintenance.',
      
      // Auth actions
      enableAdminMode: (password) => {
        if (password === get().adminPassword) {
          set({ isAdminMode: true });
          return true;
        }
        return false;
      },
      
      disableAdminMode: () => set({ isAdminMode: false }),
      
      setAdminPassword: (password) => set({ adminPassword: password }),
      
      // POI actions
      addPOI: (poi) => {
        const newPOI: EditablePOI = {
          ...poi,
          id: `poi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((state) => ({ customPOIs: [...state.customPOIs, newPOI] }));
      },
      
      updatePOI: (id, updates) => {
        set((state) => ({
          customPOIs: state.customPOIs.map((poi) =>
            poi.id === id ? { ...poi, ...updates, updatedAt: Date.now() } : poi
          ),
        }));
      },
      
      deletePOI: (id) => {
        set((state) => ({
          customPOIs: state.customPOIs.filter((poi) => poi.id !== id),
        }));
      },
      
      getPOIsForLocation: (locationId) => {
        return get().customPOIs.filter(
          (poi) => poi.locationId === locationId && poi.isVisible
        );
      },
      
      // Location override actions
      setLocationOverride: (locationId, override) => {
        const overrides = new Map(get().locationOverrides);
        const existing = overrides.get(locationId) || { locationId, isHidden: false };
        overrides.set(locationId, { ...existing, ...override });
        set({ locationOverrides: overrides });
      },
      
      removeLocationOverride: (locationId) => {
        const overrides = new Map(get().locationOverrides);
        overrides.delete(locationId);
        set({ locationOverrides: overrides });
      },
      
      // Announcement actions
      addAnnouncement: (announcement) => {
        const newAnnouncement: Announcement = {
          ...announcement,
          id: `ann_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: Date.now(),
        };
        set((state) => ({ announcements: [...state.announcements, newAnnouncement] }));
      },
      
      updateAnnouncement: (id, updates) => {
        set((state) => ({
          announcements: state.announcements.map((ann) =>
            ann.id === id ? { ...ann, ...updates } : ann
          ),
        }));
      },
      
      deleteAnnouncement: (id) => {
        set((state) => ({
          announcements: state.announcements.filter((ann) => ann.id !== id),
        }));
      },
      
      getActiveAnnouncements: (locationId) => {
        const now = Date.now();
        return get().announcements.filter((ann) => {
          if (!ann.isActive) return false;
          if (ann.expiresAt && ann.expiresAt < now) return false;
          if (ann.showOnLocations.length > 0 && locationId) {
            return ann.showOnLocations.includes(locationId);
          }
          return true;
        });
      },
      
      // Maintenance actions
      setMaintenanceMode: (enabled, message) => {
        set({
          maintenanceMode: enabled,
          ...(message && { maintenanceMessage: message }),
        });
      },
      
      // Export/Import
      exportData: () => {
        const state = get();
        return JSON.stringify({
          customPOIs: state.customPOIs,
          locationOverrides: Array.from(state.locationOverrides.entries()),
          announcements: state.announcements,
          maintenanceMode: state.maintenanceMode,
          maintenanceMessage: state.maintenanceMessage,
          exportedAt: new Date().toISOString(),
        }, null, 2);
      },
      
      importData: (data) => {
        try {
          const parsed = JSON.parse(data);
          set({
            customPOIs: parsed.customPOIs || [],
            locationOverrides: new Map(parsed.locationOverrides || []),
            announcements: parsed.announcements || [],
            maintenanceMode: parsed.maintenanceMode || false,
            maintenanceMessage: parsed.maintenanceMessage || '',
          });
          return true;
        } catch {
          return false;
        }
      },
    }),
    {
      name: 'campus-tour-admin',
      partialize: (state) => ({
        adminPassword: state.adminPassword,
        customPOIs: state.customPOIs,
        locationOverrides: Array.from(state.locationOverrides.entries()),
        announcements: state.announcements,
        maintenanceMode: state.maintenanceMode,
        maintenanceMessage: state.maintenanceMessage,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.locationOverrides)) {
          state.locationOverrides = new Map(state.locationOverrides as [string, LocationOverride][]);
        }
      },
    }
  )
);
