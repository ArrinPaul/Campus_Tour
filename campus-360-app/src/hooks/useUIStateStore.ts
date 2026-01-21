import { create } from 'zustand';

interface UIState {
  isIdle: boolean;
  isTourStarted: boolean;
  setIdle: (idle: boolean) => void;
  setTourStarted: (started: boolean) => void;
}

export const useUIStateStore = create<UIState>((set) => ({
  isIdle: false,
  isTourStarted: false,
  setIdle: (idle) => set({ isIdle: idle }),
  setTourStarted: (started) => set({ isTourStarted: started }),
}));
