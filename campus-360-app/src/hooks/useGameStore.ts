import { create } from 'zustand';

interface GameState {
  foundItems: string[];
  totalItems: number;
  isGameActive: boolean;
  collectItem: (id: string) => void;
  setGameActive: (active: boolean) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  foundItems: [],
  totalItems: 3, // Total mascots to find
  isGameActive: false,
  collectItem: (id) =>
    set((state) => ({
      foundItems: state.foundItems.includes(id) ? state.foundItems : [...state.foundItems, id],
    })),
  setGameActive: (active) => set({ isGameActive: active }),
  resetGame: () => set({ foundItems: [], isGameActive: true }),
}));
