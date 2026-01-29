/**
 * Guided Tour Store
 * Manages auto-play guided tour functionality
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TourStop {
  id: string;
  blockId: string;
  imageId: string;
  name: string;
  description?: string;
  duration: number; // seconds to stay at this stop
  cameraAngle?: { azimuth: number; polar: number }; // optional camera angle
}

export interface GuidedTour {
  id: string;
  name: string;
  description: string;
  stops: TourStop[];
  estimatedDuration: number; // total minutes
  thumbnail?: string;
}

interface GuidedTourState {
  // Available tours
  tours: GuidedTour[];

  // Current tour state
  activeTour: GuidedTour | null;
  currentStopIndex: number;
  isPlaying: boolean;
  isPaused: boolean;
  progress: number; // 0-100

  // Settings
  autoAdvance: boolean;
  showNarration: boolean;
  playbackSpeed: number; // 0.5, 1, 1.5, 2

  // Actions
  setTours: (tours: GuidedTour[]) => void;
  startTour: (tour: GuidedTour) => void;
  stopTour: () => void;
  pauseTour: () => void;
  resumeTour: () => void;
  nextStop: () => void;
  previousStop: () => void;
  goToStop: (index: number) => void;
  setProgress: (progress: number) => void;
  setAutoAdvance: (autoAdvance: boolean) => void;
  setShowNarration: (show: boolean) => void;
  setPlaybackSpeed: (speed: number) => void;
}

// Default guided tours for the campus
const DEFAULT_TOURS: GuidedTour[] = [
  {
    id: 'campus-highlights',
    name: 'Campus Highlights',
    description: 'A quick tour of the most iconic locations on campus',
    estimatedDuration: 5,
    stops: [
      {
        id: 'stop-1',
        blockId: 'Gate_to_Logo',
        imageId: 'Gate_to_Logo_1',
        name: 'Main Entrance',
        description: 'Welcome to our beautiful campus! This is the main gate.',
        duration: 8,
      },
      {
        id: 'stop-2',
        blockId: 'Block1',
        imageId: 'Block1_1',
        name: 'Block 1 - Academic Building',
        description: 'Our primary academic building houses classrooms and labs.',
        duration: 8,
      },
      {
        id: 'stop-3',
        blockId: 'Block2',
        imageId: 'Block2_1',
        name: 'Block 2 - Library',
        description: 'The central library with extensive resources.',
        duration: 8,
      },
    ],
  },
  {
    id: 'full-campus-tour',
    name: 'Full Campus Tour',
    description: 'Explore every corner of our campus in detail',
    estimatedDuration: 15,
    stops: [
      {
        id: 'full-1',
        blockId: 'Gate_to_Logo',
        imageId: 'Gate_to_Logo_1',
        name: 'Campus Entrance',
        description: 'Start your journey at the main entrance.',
        duration: 10,
      },
      {
        id: 'full-2',
        blockId: 'Block1',
        imageId: 'Block1_1',
        name: 'Block 1',
        description: 'Academic excellence begins here.',
        duration: 10,
      },
      {
        id: 'full-3',
        blockId: 'Block2',
        imageId: 'Block2_1',
        name: 'Block 2',
        description: 'More learning facilities.',
        duration: 10,
      },
      {
        id: 'full-4',
        blockId: 'Block3',
        imageId: 'Block3_1',
        name: 'Block 3',
        description: 'Research and innovation hub.',
        duration: 10,
      },
      {
        id: 'full-5',
        blockId: 'Block4',
        imageId: 'Block4_1',
        name: 'Block 4',
        description: 'Student services and administration.',
        duration: 10,
      },
      {
        id: 'full-6',
        blockId: 'Block5',
        imageId: 'Block5_1',
        name: 'Block 5',
        description: 'Sports and recreation facilities.',
        duration: 10,
      },
    ],
  },
];

export const useGuidedTourStore = create<GuidedTourState>()(
  persist(
    (set) => ({
      tours: DEFAULT_TOURS,
      activeTour: null,
      currentStopIndex: 0,
      isPlaying: false,
      isPaused: false,
      progress: 0,
      autoAdvance: true,
      showNarration: true,
      playbackSpeed: 1,

      setTours: (tours) => set({ tours }),

      startTour: (tour) =>
        set({
          activeTour: tour,
          currentStopIndex: 0,
          isPlaying: true,
          isPaused: false,
          progress: 0,
        }),

      stopTour: () =>
        set({
          activeTour: null,
          currentStopIndex: 0,
          isPlaying: false,
          isPaused: false,
          progress: 0,
        }),

      pauseTour: () => set({ isPaused: true, isPlaying: false }),

      resumeTour: () => set({ isPaused: false, isPlaying: true }),

      nextStop: () =>
        set((state) => {
          if (!state.activeTour) return state;
          const nextIndex = state.currentStopIndex + 1;
          if (nextIndex >= state.activeTour.stops.length) {
            // Tour completed
            return {
              isPlaying: false,
              isPaused: false,
              progress: 100,
            };
          }
          return {
            currentStopIndex: nextIndex,
            progress: (nextIndex / state.activeTour.stops.length) * 100,
          };
        }),

      previousStop: () =>
        set((state) => {
          if (!state.activeTour) return state;
          const prevIndex = Math.max(0, state.currentStopIndex - 1);
          return {
            currentStopIndex: prevIndex,
            progress: (prevIndex / state.activeTour.stops.length) * 100,
          };
        }),

      goToStop: (index) =>
        set((state) => {
          if (!state.activeTour) return state;
          const clampedIndex = Math.max(0, Math.min(index, state.activeTour.stops.length - 1));
          return {
            currentStopIndex: clampedIndex,
            progress: (clampedIndex / state.activeTour.stops.length) * 100,
          };
        }),

      setProgress: (progress) => set({ progress }),

      setAutoAdvance: (autoAdvance) => set({ autoAdvance }),

      setShowNarration: (show) => set({ showNarration: show }),

      setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
    }),
    {
      name: 'guided-tour-settings',
      partialize: (state) => ({
        autoAdvance: state.autoAdvance,
        showNarration: state.showNarration,
        playbackSpeed: state.playbackSpeed,
      }),
    }
  )
);
