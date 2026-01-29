import { useEffect, useCallback } from 'react';
import { useTourDataStore } from './useTourDataStore';
import { useCameraControlsStore } from './useCameraControlsStore';
import { useUIStateStore } from './useUIStateStore';

interface KeyboardShortcutsOptions {
  enabled?: boolean;
}

export const useKeyboardShortcuts = ({ enabled = true }: KeyboardShortcutsOptions = {}) => {
  const { navigateToLink, nextImage, previousImage } = useTourDataStore();
  const { zoomCamera, setAutoRotation, isAutoRotating, startRotation, stopRotation } =
    useCameraControlsStore();
  const { isMapOpen, setMapOpen } = useUIStateStore();

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen();
    }
  }, []);

  const closeAllOverlays = useCallback(() => {
    // Close map overlay
    if (isMapOpen) {
      setMapOpen(false);
    }
    // Dispatch custom event to close other overlays (help, game, etc.)
    window.dispatchEvent(new CustomEvent('close-all-overlays'));
  }, [isMapOpen, setMapOpen]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = event.key.toLowerCase();

      switch (key) {
        // Camera rotation with arrow keys (continuous while held)
        case 'arrowup':
          event.preventDefault();
          startRotation('up');
          break;
        case 'arrowdown':
          event.preventDefault();
          startRotation('down');
          break;
        case 'arrowleft':
          event.preventDefault();
          startRotation('left');
          break;
        case 'arrowright':
          event.preventDefault();
          startRotation('right');
          break;

        // WASD for scene navigation (linked scenes)
        case 'w':
          event.preventDefault();
          navigateToLink('up');
          break;
        case 's':
          event.preventDefault();
          navigateToLink('down');
          break;
        case 'a':
          event.preventDefault();
          navigateToLink('left');
          break;
        case 'd':
          event.preventDefault();
          navigateToLink('right');
          break;

        // Zoom with +/- keys
        case '+':
        case '=':
          event.preventDefault();
          zoomCamera('in');
          break;
        case '-':
        case '_':
          event.preventDefault();
          zoomCamera('out');
          break;

        // Map toggle with M
        case 'm':
          event.preventDefault();
          setMapOpen(!isMapOpen);
          break;

        // Fullscreen toggle with F
        case 'f':
          event.preventDefault();
          toggleFullscreen();
          break;

        // Escape to close overlays
        case 'escape':
          event.preventDefault();
          closeAllOverlays();
          break;

        // Space for auto-rotation toggle
        case ' ':
          event.preventDefault();
          setAutoRotation(!isAutoRotating);
          break;

        // N for next image, P for previous image
        case 'n':
          event.preventDefault();
          nextImage();
          break;
        case 'p':
          event.preventDefault();
          previousImage();
          break;

        // H for help overlay
        case 'h':
        case '?':
          event.preventDefault();
          window.dispatchEvent(new CustomEvent('open-help-modal'));
          break;

        default:
          break;
      }
    },
    [
      navigateToLink,
      nextImage,
      previousImage,
      zoomCamera,
      setAutoRotation,
      isAutoRotating,
      isMapOpen,
      setMapOpen,
      toggleFullscreen,
      closeAllOverlays,
      startRotation,
    ]
  );

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      // Stop camera rotation when arrow keys are released
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        stopRotation();
      }
    },
    [stopRotation]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [enabled, handleKeyDown, handleKeyUp]);

  return {
    toggleFullscreen,
    closeAllOverlays,
  };
};

// Export keyboard shortcuts reference for UI display
export const KEYBOARD_SHORTCUTS = [
  { key: '↑ ↓ ← →', action: 'Rotate camera view' },
  { key: 'W A S D', action: 'Navigate between scenes' },
  { key: '+ / -', action: 'Zoom in / out' },
  { key: 'M', action: 'Toggle map overlay' },
  { key: 'F', action: 'Toggle fullscreen' },
  { key: 'Space', action: 'Toggle auto-rotation' },
  { key: 'N / P', action: 'Next / Previous scene' },
  { key: 'H or ?', action: 'Show help' },
  { key: 'Esc', action: 'Close overlays' },
] as const;
