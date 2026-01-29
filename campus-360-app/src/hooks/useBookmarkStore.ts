/**
 * Tour History & Bookmarks Store
 * Manages favorites, recently viewed locations, and bookmarks
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Bookmark {
  id: string;
  blockId: string;
  imageId: string;
  name: string;
  thumbnail?: string;
  createdAt: number;
  cameraPosition?: { fov: number; yaw: number; pitch: number };
}

export interface RecentLocation {
  blockId: string;
  imageId: string;
  name: string;
  visitedAt: number;
}

interface BookmarkState {
  bookmarks: Bookmark[];
  recentLocations: RecentLocation[];
  maxRecentLocations: number;

  // Bookmark actions
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (blockId: string, imageId: string) => boolean;
  getBookmark: (blockId: string, imageId: string) => Bookmark | undefined;
  clearBookmarks: () => void;

  // Recent locations actions
  addRecentLocation: (location: Omit<RecentLocation, 'visitedAt'>) => void;
  clearRecentLocations: () => void;
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      recentLocations: [],
      maxRecentLocations: 10,

      addBookmark: (bookmark) => {
        const { blockId, imageId } = bookmark;
        const existing = get().bookmarks.find(
          (b) => b.blockId === blockId && b.imageId === imageId
        );

        if (existing) return; // Already bookmarked

        const newBookmark: Bookmark = {
          ...bookmark,
          id: `${blockId}-${imageId}-${Date.now()}`,
          createdAt: Date.now(),
        };

        set((state) => ({
          bookmarks: [newBookmark, ...state.bookmarks],
        }));
      },

      removeBookmark: (id) => {
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.id !== id),
        }));
      },

      isBookmarked: (blockId, imageId) => {
        return get().bookmarks.some((b) => b.blockId === blockId && b.imageId === imageId);
      },

      getBookmark: (blockId, imageId) => {
        return get().bookmarks.find((b) => b.blockId === blockId && b.imageId === imageId);
      },

      clearBookmarks: () => set({ bookmarks: [] }),

      addRecentLocation: (location) => {
        const { blockId, imageId } = location;
        const { maxRecentLocations } = get();

        set((state) => {
          // Remove existing entry for this location
          const filtered = state.recentLocations.filter(
            (r) => !(r.blockId === blockId && r.imageId === imageId)
          );

          // Add new entry at the beginning
          const newRecent: RecentLocation = {
            ...location,
            visitedAt: Date.now(),
          };

          return {
            recentLocations: [newRecent, ...filtered].slice(0, maxRecentLocations),
          };
        });
      },

      clearRecentLocations: () => set({ recentLocations: [] }),
    }),
    {
      name: 'tour-bookmarks',
      partialize: (state) => ({
        bookmarks: state.bookmarks,
        recentLocations: state.recentLocations,
      }),
    }
  )
);
