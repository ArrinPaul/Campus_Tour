import { create } from 'zustand';
import { preloadImages } from '../utils/textureLoader';

// Type definitions - using type instead of interface for better module exports
export type Hotspot = {
  id: string; // Target Image ID or 'next'/'prev'
  x: number;
  y: number;
  z: number;
  text?: string;
  targetBlockId?: string;
};

export type POI = {
  id: string;
  x: number;
  y: number;
  z: number;
  title: string;
  description: string;
  image?: string;
  video?: string;
};

export type Lab = {
  id: string;
  panorama: string;
  name: string;
  initialLookAt?: { x: number; y: number; z: number };
  links?: { [key: string]: string };
  hotspots?: Hotspot[];
  pois?: POI[];
};

export type Block = {
  id: string;
  name?: string; // made optional as label/short might be used
  label?: string;
  short?: string;
  svgPath?: string;
  svgAnchor?: { x: number; y: number };
  labelOffset?: { x: number; y: number };
  labelAnchor?: 'start' | 'end' | 'middle';
  labs: Lab[];
};

export type Manifest = {
  blocks: Block[];
};

interface TourDataState {
  currentBlockId: string | null;
  currentImageId: string | null;
  isTransitioning: boolean;
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
  isTransitioning: false,
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
    // Start transition
    set({ isTransitioning: true });

    // Delay state update to allow fade-out animation
    setTimeout(() => {
      set({ currentImageId: imageId });

      // Preload logic: Load adjacent linear nodes AND hotspot targets
      const state = get();
      const currentBlock = state.manifest?.blocks.find((b) => b.id === state.currentBlockId);
      const currentImage = currentBlock?.labs?.find((lab) => lab.id === imageId);

      const urlsToPreload: string[] = [];

      if (currentBlock && currentBlock.labs) {
        const currentIndex = currentBlock.labs.findIndex((lab) => lab.id === imageId);
        if (currentIndex !== -1) {
          const nextIndex = (currentIndex + 1) % currentBlock.labs.length;
          const prevIndex = currentIndex === 0 ? currentBlock.labs.length - 1 : currentIndex - 1;
          if (currentBlock.labs[nextIndex])
            urlsToPreload.push(currentBlock.labs[nextIndex].panorama);
          if (currentBlock.labs[prevIndex])
            urlsToPreload.push(currentBlock.labs[prevIndex].panorama);
        }

        // Preload Hotspots
        if (currentImage?.hotspots) {
          currentImage.hotspots.forEach((hotspot) => {
            // Search in current block first
            let targetLab = currentBlock.labs.find((l) => l.id === hotspot.id);
            // If not found (cross-block link), search globally (simplified for now)
            if (!targetLab && state.manifest) {
              for (const b of state.manifest.blocks) {
                const found = b.labs.find((l) => l.id === hotspot.id);
                if (found) {
                  targetLab = found;
                  break;
                }
              }
            }
            if (targetLab) {
              urlsToPreload.push(targetLab.panorama);
            }
          });
        }
      }

      // Deduplicate and preload
      const uniqueUrls = [...new Set(urlsToPreload)];
      if (uniqueUrls.length > 0) {
        preloadImages(uniqueUrls);
      }

      set((state) => {
        const newHistory = [imageId, ...state.history.filter((id) => id !== imageId)].slice(0, 5);
        localStorage.setItem('tour-history', JSON.stringify(newHistory));
        return { history: newHistory };
      });

      // End transition after a slight delay to allow fade-in
      setTimeout(() => {
        set({ isTransitioning: false });
      }, 500);
    }, 300); // Wait for fade-out
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
