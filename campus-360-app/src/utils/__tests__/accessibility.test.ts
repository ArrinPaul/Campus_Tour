/**
 * Unit Tests for Accessibility Utilities
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  useAccessibilityStore,
  useFocusTrap,
  generateAriaId,
  ariaLabels,
  announce,
} from '../accessibility';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: query === '(prefers-reduced-motion: reduce)',
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

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

describe('useAccessibilityStore', () => {
  beforeEach(() => {
    localStorageMock.clear();

    // Reset store state
    useAccessibilityStore.setState({
      reducedMotion: false,
      highContrast: false,
      largeText: false,
      screenReaderMode: false,
      audioDescriptions: false,
      keyboardNavigationEnabled: true,
      focusOutlineVisible: true,
    });
  });

  describe('visual settings', () => {
    it('should toggle reduced motion', () => {
      const { setReducedMotion } = useAccessibilityStore.getState();

      act(() => {
        setReducedMotion(true);
      });

      expect(useAccessibilityStore.getState().reducedMotion).toBe(true);

      act(() => {
        setReducedMotion(false);
      });

      expect(useAccessibilityStore.getState().reducedMotion).toBe(false);
    });

    it('should toggle high contrast', () => {
      const { setHighContrast } = useAccessibilityStore.getState();

      act(() => {
        setHighContrast(true);
      });

      expect(useAccessibilityStore.getState().highContrast).toBe(true);
    });

    it('should toggle large text', () => {
      const { setLargeText } = useAccessibilityStore.getState();

      act(() => {
        setLargeText(true);
      });

      expect(useAccessibilityStore.getState().largeText).toBe(true);
    });
  });

  describe('audio settings', () => {
    it('should toggle screen reader mode', () => {
      const { setScreenReaderMode } = useAccessibilityStore.getState();

      act(() => {
        setScreenReaderMode(true);
      });

      expect(useAccessibilityStore.getState().screenReaderMode).toBe(true);
    });

    it('should toggle audio descriptions', () => {
      const { setAudioDescriptions } = useAccessibilityStore.getState();

      act(() => {
        setAudioDescriptions(true);
      });

      expect(useAccessibilityStore.getState().audioDescriptions).toBe(true);
    });
  });

  describe('navigation settings', () => {
    it('should toggle keyboard navigation', () => {
      const { setKeyboardNavigationEnabled } = useAccessibilityStore.getState();

      act(() => {
        setKeyboardNavigationEnabled(false);
      });

      expect(useAccessibilityStore.getState().keyboardNavigationEnabled).toBe(false);
    });
  });

  describe('detectSystemPreferences', () => {
    it('should detect reduced motion preference', () => {
      const { detectSystemPreferences } = useAccessibilityStore.getState();

      act(() => {
        detectSystemPreferences();
      });

      // Our mock returns true for prefers-reduced-motion
      expect(useAccessibilityStore.getState().reducedMotion).toBe(true);
    });
  });
});

describe('useFocusTrap', () => {
  it('should return a ref', () => {
    const { result } = renderHook(() => useFocusTrap(false));
    expect(result.current).toBeDefined();
    expect(result.current.current).toBe(null);
  });
});

describe('generateAriaId', () => {
  it('should generate unique IDs', () => {
    const id1 = generateAriaId('test');
    const id2 = generateAriaId('test');

    expect(id1).not.toBe(id2);
    expect(id1).toMatch(/^test-\d+$/);
    expect(id2).toMatch(/^test-\d+$/);
  });

  it('should use default prefix', () => {
    const id = generateAriaId();
    expect(id).toMatch(/^aria-\d+$/);
  });
});

describe('ariaLabels', () => {
  describe('hotspot', () => {
    it('should generate hotspot label with type', () => {
      const label = ariaLabels.hotspot('Library Entrance', 'Door');
      expect(label).toBe('Door: Library Entrance. Press Enter to interact.');
    });

    it('should generate hotspot label without type', () => {
      const label = ariaLabels.hotspot('Library Entrance');
      expect(label).toBe('Interactive point: Library Entrance. Press Enter to interact.');
    });
  });

  describe('location', () => {
    it('should generate location label with description', () => {
      const label = ariaLabels.location('Main Hall', 'The central gathering area');
      expect(label).toBe('Location: Main Hall. The central gathering area');
    });

    it('should generate location label without description', () => {
      const label = ariaLabels.location('Main Hall');
      expect(label).toBe('Location: Main Hall');
    });
  });

  describe('navigationArrow', () => {
    it('should generate navigation label with destination', () => {
      const label = ariaLabels.navigationArrow('forward', 'Library');
      expect(label).toBe('Navigate forward to Library');
    });

    it('should generate navigation label without destination', () => {
      const label = ariaLabels.navigationArrow('left');
      expect(label).toBe('Navigate left');
    });
  });

  describe('panorama', () => {
    it('should generate panorama label', () => {
      const label = ariaLabels.panorama('Science Building Lobby');
      expect(label).toBe(
        '360 degree panoramic view of Science Building Lobby. Use arrow keys or drag to look around.'
      );
    });
  });

  describe('minimap', () => {
    it('should generate minimap label', () => {
      const label = ariaLabels.minimap('Block A');
      expect(label).toBe('Campus map. Current location: Block A. Click on markers to navigate.');
    });
  });

  describe('bookmark', () => {
    it('should generate bookmark add label', () => {
      const label = ariaLabels.bookmark('Library', false);
      expect(label).toBe('Bookmark Library');
    });

    it('should generate bookmark remove label', () => {
      const label = ariaLabels.bookmark('Library', true);
      expect(label).toBe('Remove bookmark from Library');
    });
  });

  describe('share', () => {
    it('should generate share label', () => {
      const label = ariaLabels.share('Twitter');
      expect(label).toBe('Share current location on Twitter');
    });
  });

  describe('audio', () => {
    it('should generate play label', () => {
      const label = ariaLabels.audio(false);
      expect(label).toBe('Play ambient audio');
    });

    it('should generate pause label', () => {
      const label = ariaLabels.audio(true);
      expect(label).toBe('Pause ambient audio');
    });
  });

  describe('fullscreen', () => {
    it('should generate enter fullscreen label', () => {
      const label = ariaLabels.fullscreen(false);
      expect(label).toBe('Enter fullscreen mode');
    });

    it('should generate exit fullscreen label', () => {
      const label = ariaLabels.fullscreen(true);
      expect(label).toBe('Exit fullscreen mode');
    });
  });

  describe('tour', () => {
    it('should generate tour progress label', () => {
      const label = ariaLabels.tour('Campus Highlights', 3, 10);
      expect(label).toBe('Campus Highlights: Step 3 of 10');
    });
  });
});

describe('announce', () => {
  it('should not throw when called', () => {
    expect(() => announce('Test message')).not.toThrow();
  });

  it('should accept priority parameter', () => {
    expect(() => announce('Urgent message', 'assertive')).not.toThrow();
  });
});
