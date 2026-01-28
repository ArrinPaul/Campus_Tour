import { create } from 'zustand';

interface UIState {
  isIdle: boolean;
  isAudioEnabled: boolean;
  isMapOpen: boolean;
  setIdle: (idle: boolean) => void;
  setAudioEnabled: (enabled: boolean) => void;
  setMapOpen: (isOpen: boolean) => void;
}

export const useUIStateStore = create<UIState>((set) => ({
  isIdle: false,
  isAudioEnabled: false,
  isMapOpen: false,
  setIdle: (idle) => set({ isIdle: idle }),
  setAudioEnabled: (enabled) => set({ isAudioEnabled: enabled }),
  setMapOpen: (isOpen) => set({ isMapOpen: isOpen }),
}));
