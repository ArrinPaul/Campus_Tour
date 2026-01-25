import { create } from 'zustand';

interface UIState {
  isIdle: boolean;
  isTourStarted: boolean;
  isAudioEnabled: boolean;
  isMapOpen: boolean;
  setIdle: (idle: boolean) => void;
  setTourStarted: (started: boolean) => void;
  setAudioEnabled: (enabled: boolean) => void;
  setMapOpen: (isOpen: boolean) => void;
}

export const useUIStateStore = create<UIState>((set) => ({
  isIdle: false,
  isTourStarted: false,
  isAudioEnabled: false,
  isMapOpen: false,
  setIdle: (idle) => set({ isIdle: idle }),
  setTourStarted: (started) => set({ isTourStarted: started }),
  setAudioEnabled: (enabled) => set({ isAudioEnabled: enabled }),
  setMapOpen: (isOpen) => set({ isMapOpen: isOpen }),
}));
