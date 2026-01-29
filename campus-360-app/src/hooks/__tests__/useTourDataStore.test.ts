/**
 * Unit Tests for useTourDataStore
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { act } from '@testing-library/react';
import { useTourDataStore, type Manifest } from '../useTourDataStore';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock preloadImages
vi.mock('../../utils/textureLoader', () => ({
  preloadImages: vi.fn(),
}));

// Sample test manifest
const createTestManifest = (): Manifest => ({
  blocks: [
    {
      id: 'block1',
      name: 'Block 1',
      labs: [
        {
          id: 'block1_entrance',
          panorama: '/images/block1_entrance.jpg',
          name: 'Entrance',
          hotspots: [{ id: 'block1_lobby', x: 1, y: 0, z: 0, text: 'Go to Lobby' }],
          links: {
            left: 'block1_left',
            right: 'block1_right',
          },
        },
        {
          id: 'block1_lobby',
          panorama: '/images/block1_lobby.jpg',
          name: 'Lobby',
        },
        {
          id: 'block1_left',
          panorama: '/images/block1_left.jpg',
          name: 'Left Wing',
        },
        {
          id: 'block1_right',
          panorama: '/images/block1_right.jpg',
          name: 'Right Wing',
        },
      ],
    },
    {
      id: 'block2',
      name: 'Block 2',
      labs: [
        {
          id: 'block2_entrance',
          panorama: '/images/block2_entrance.jpg',
          name: 'Entrance',
        },
        {
          id: 'block2_hall',
          panorama: '/images/block2_hall.jpg',
          name: 'Hall',
        },
      ],
    },
  ],
});

describe('useTourDataStore', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorageMock.clear();

    // Reset store state
    useTourDataStore.setState({
      currentBlockId: null,
      currentImageId: null,
      isTransitioning: false,
      manifest: null,
      history: [],
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('setManifest', () => {
    it('should set the manifest', () => {
      const manifest = createTestManifest();
      const { setManifest } = useTourDataStore.getState();

      act(() => {
        setManifest(manifest);
      });

      const state = useTourDataStore.getState();
      expect(state.manifest).toEqual(manifest);
      expect(state.manifest?.blocks).toHaveLength(2);
    });
  });

  describe('setBlock', () => {
    it('should set current block and select entrance lab', () => {
      const manifest = createTestManifest();

      act(() => {
        useTourDataStore.setState({ manifest });
      });

      const { setBlock } = useTourDataStore.getState();

      act(() => {
        setBlock('block1');
        vi.advanceTimersByTime(1000); // Allow transition to complete
      });

      const state = useTourDataStore.getState();
      expect(state.currentBlockId).toBe('block1');
      expect(state.currentImageId).toBe('block1_entrance');
    });

    it('should handle block without entrance suffix', () => {
      const manifest: Manifest = {
        blocks: [
          {
            id: 'simple',
            name: 'Simple Block',
            labs: [
              { id: 'simple_first', panorama: '/images/first.jpg', name: 'First' },
              { id: 'simple_second', panorama: '/images/second.jpg', name: 'Second' },
            ],
          },
        ],
      };

      act(() => {
        useTourDataStore.setState({ manifest });
      });

      const { setBlock } = useTourDataStore.getState();

      act(() => {
        setBlock('simple');
        vi.advanceTimersByTime(1000);
      });

      const state = useTourDataStore.getState();
      expect(state.currentImageId).toBe('simple_first');
    });
  });

  describe('setImage', () => {
    it('should trigger transition animation', () => {
      const manifest = createTestManifest();

      act(() => {
        useTourDataStore.setState({
          manifest,
          currentBlockId: 'block1',
        });
      });

      const { setImage } = useTourDataStore.getState();

      act(() => {
        setImage('block1_lobby');
      });

      // Check transitioning is true immediately
      expect(useTourDataStore.getState().isTransitioning).toBe(true);

      // After fade-out delay
      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(useTourDataStore.getState().currentImageId).toBe('block1_lobby');

      // After fade-in delay
      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(useTourDataStore.getState().isTransitioning).toBe(false);
    });

    it('should add image to history', () => {
      const manifest = createTestManifest();

      act(() => {
        useTourDataStore.setState({
          manifest,
          currentBlockId: 'block1',
        });
      });

      const { setImage } = useTourDataStore.getState();

      act(() => {
        setImage('block1_lobby');
        vi.advanceTimersByTime(1000);
        setImage('block1_left');
        vi.advanceTimersByTime(1000);
      });

      const state = useTourDataStore.getState();
      expect(state.history).toContain('block1_left');
      expect(state.history).toContain('block1_lobby');
    });
  });

  describe('nextImage and previousImage', () => {
    it('should navigate to next image in sequence', () => {
      const manifest = createTestManifest();

      act(() => {
        useTourDataStore.setState({
          manifest,
          currentBlockId: 'block1',
          currentImageId: 'block1_entrance',
        });
      });

      const { nextImage } = useTourDataStore.getState();

      act(() => {
        nextImage();
        vi.advanceTimersByTime(1000);
      });

      expect(useTourDataStore.getState().currentImageId).toBe('block1_lobby');
    });

    it('should wrap around at the end', () => {
      const manifest = createTestManifest();

      act(() => {
        useTourDataStore.setState({
          manifest,
          currentBlockId: 'block1',
          currentImageId: 'block1_right', // Last in list
        });
      });

      const { nextImage } = useTourDataStore.getState();

      act(() => {
        nextImage();
        vi.advanceTimersByTime(1000);
      });

      expect(useTourDataStore.getState().currentImageId).toBe('block1_entrance');
    });

    it('should navigate to previous image', () => {
      const manifest = createTestManifest();

      act(() => {
        useTourDataStore.setState({
          manifest,
          currentBlockId: 'block1',
          currentImageId: 'block1_lobby',
        });
      });

      const { previousImage } = useTourDataStore.getState();

      act(() => {
        previousImage();
        vi.advanceTimersByTime(1000);
      });

      expect(useTourDataStore.getState().currentImageId).toBe('block1_entrance');
    });

    it('should wrap around at the beginning', () => {
      const manifest = createTestManifest();

      act(() => {
        useTourDataStore.setState({
          manifest,
          currentBlockId: 'block1',
          currentImageId: 'block1_entrance', // First in list
        });
      });

      const { previousImage } = useTourDataStore.getState();

      act(() => {
        previousImage();
        vi.advanceTimersByTime(1000);
      });

      expect(useTourDataStore.getState().currentImageId).toBe('block1_right');
    });
  });

  describe('navigateToLink', () => {
    it('should navigate using directional links', () => {
      const manifest = createTestManifest();

      act(() => {
        useTourDataStore.setState({
          manifest,
          currentBlockId: 'block1',
          currentImageId: 'block1_entrance',
        });
      });

      const { navigateToLink } = useTourDataStore.getState();

      act(() => {
        navigateToLink('left');
        vi.advanceTimersByTime(1000);
      });

      expect(useTourDataStore.getState().currentImageId).toBe('block1_left');
    });

    it('should not navigate if link does not exist', () => {
      const manifest = createTestManifest();

      act(() => {
        useTourDataStore.setState({
          manifest,
          currentBlockId: 'block1',
          currentImageId: 'block1_entrance',
        });
      });

      const { navigateToLink } = useTourDataStore.getState();

      act(() => {
        navigateToLink('up');
        vi.advanceTimersByTime(1000);
      });

      // Should remain at entrance since 'up' link doesn't exist
      expect(useTourDataStore.getState().currentImageId).toBe('block1_entrance');
    });
  });

  describe('addToHistory', () => {
    it('should add image to history and limit to 5 items', () => {
      act(() => {
        useTourDataStore.setState({ history: [] });
      });

      const { addToHistory } = useTourDataStore.getState();

      act(() => {
        for (let i = 1; i <= 7; i++) {
          addToHistory(`image${i}`);
        }
      });

      const state = useTourDataStore.getState();
      expect(state.history).toHaveLength(5);
      expect(state.history[0]).toBe('image7');
    });

    it('should move existing item to front', () => {
      act(() => {
        useTourDataStore.setState({ history: ['a', 'b', 'c'] });
      });

      const { addToHistory } = useTourDataStore.getState();

      act(() => {
        addToHistory('b');
      });

      const state = useTourDataStore.getState();
      expect(state.history[0]).toBe('b');
      expect(state.history.filter((h) => h === 'b')).toHaveLength(1);
    });
  });
});
