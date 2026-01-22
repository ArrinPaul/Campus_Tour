import { create } from 'zustand';
import { preloadImages } from '../utils/textureLoader';

// Type definitions - using type instead of interface for better module exports
export type Lab = {
  id: string;
  panorama: string;
  name: string;
  initialLookAt?: { x: number; y: number; z: number };
  links?: { [key: string]: string };
};

export type Block = {
  id: string;
  name: string;
  labs: Lab[];
};

export type Manifest = {
  blocks: Block[];
};

interface TourDataState {
  currentBlockId: string | null;
  currentImageId: string | null;
  manifest: Manifest | null;
  history: string[]; // Array of imageIds
  setManifest: (manifest: Manifest) => void;
  setBlock: (blockId: string) => void;
  setImage: (imageId: string) => void;
  addToHistory: (imageId: string) => void;
  navigateToLink: (direction: 'up' | 'down' | 'left' | 'right') => void; // New navigation function
  nextImage: () => void;
  previousImage: () => void;
}

export const useTourDataStore = create<TourDataState>((set, get) => ({
  currentBlockId: null,
  currentImageId: null,
  manifest: null,
  history: JSON.parse(localStorage.getItem('tour-history') || '[]'),
  setManifest: (manifest) => set({ manifest }),
  setBlock: (blockId) => {
    set({ currentBlockId: blockId });
    const state = get();
    if (state.manifest) {
      const block = state.manifest.blocks.find((b) => b.id === blockId);
      if (block && block.labs && block.labs.length > 0) {
        // Find the entrance lab or default to the first one
        const entranceLab = block.labs.find((l) => l.id.includes('_entrance')) || block.labs[0];
        get().setImage(entranceLab.id);
      }
    }
  },
  setImage: (imageId) => {
    set({ currentImageId: imageId });
    const state = get();
    if (state.manifest && state.currentBlockId) {
      const currentBlock = state.manifest.blocks.find((b) => b.id === state.currentBlockId);
      if (currentBlock && currentBlock.labs) {
        const currentIndex = currentBlock.labs.findIndex((lab) => lab.id === imageId);
        if (currentIndex !== -1) {
          const nextIndex = (currentIndex + 1) % currentBlock.labs.length;
          const prevIndex = currentIndex === 0 ? currentBlock.labs.length - 1 : currentIndex - 1;

          const nextImage = currentBlock.labs[nextIndex];
          const prevImage = currentBlock.labs[prevIndex];

          const urlsToPreload: string[] = [];
          if (nextImage) urlsToPreload.push(nextImage.panorama);
          if (prevImage) urlsToPreload.push(prevImage.panorama);

          preloadImages(urlsToPreload);
        }
      }
    }

    set((state) => {
      const newHistory = [imageId, ...state.history.filter((id) => id !== imageId)].slice(0, 5);
      localStorage.setItem('tour-history', JSON.stringify(newHistory));
      return { history: newHistory };
    });
  },
  addToHistory: (imageId) =>
    set((state) => {
      const newHistory = [imageId, ...state.history.filter((id) => id !== imageId)].slice(0, 5);
      localStorage.setItem('tour-history', JSON.stringify(newHistory));
      return { history: newHistory };
    }),
  navigateToLink: (direction) => {
    const state = get();
    const { manifest, currentBlockId, currentImageId } = state;
    if (!manifest || !currentBlockId || !currentImageId) return;

    const block = manifest.blocks.find((b) => b.id === currentBlockId);
    if (!block) return;

    const image = block.labs.find((l) => l.id === currentImageId);
    if (!image || !image.links) return;

    const nextImageId = image.links[direction];
    if (nextImageId) {
      get().setImage(nextImageId);
    }
  },
  nextImage: () => {
    const state = get();
    if (!state.manifest || !state.currentBlockId || !state.currentImageId) return;

    const currentBlock = state.manifest.blocks.find((b) => b.id === state.currentBlockId);
    if (!currentBlock || !currentBlock.labs) return;

    let currentIndex = currentBlock.labs.findIndex((lab) => lab.id === state.currentImageId);
    if (currentIndex === -1) currentIndex = 0;

    const nextIndex = (currentIndex + 1) % currentBlock.labs.length;
    const nextImageId = currentBlock.labs[nextIndex].id;
    get().setImage(nextImageId);
  },
  previousImage: () => {
    const state = get();
    if (!state.manifest || !state.currentBlockId || !state.currentImageId) return;

    const currentBlock = state.manifest.blocks.find((b) => b.id === state.currentBlockId);
    if (!currentBlock || !currentBlock.labs) return;

    const currentIndex = currentBlock.labs.findIndex((lab) => lab.id === state.currentImageId);
    if (currentIndex === -1) return;

    const prevIndex = currentIndex === 0 ? currentBlock.labs.length - 1 : currentIndex - 1;
    const prevImageId = currentBlock.labs[prevIndex].id;
    get().setImage(prevImageId);
  },
}));
