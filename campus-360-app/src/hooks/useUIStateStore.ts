import { create } from 'zustand';

interface UIState {
  isIdle: boolean;
  setIdle: (idle: boolean) => void;
}

export const useUIStateStore = create<UIState>((set) => ({
  isIdle: false,
  setIdle: (idle) => set({ isIdle: idle }),
}));
