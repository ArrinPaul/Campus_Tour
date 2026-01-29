/**
 * Accessibility Utilities
 * ARIA labels, keyboard navigation, and screen reader support
 */

import { useCallback, useEffect, useRef } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Accessibility settings store
interface AccessibilityState {
  // Visual preferences
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;

  // Audio preferences
  screenReaderMode: boolean;
  audioDescriptions: boolean;

  // Keyboard navigation
  keyboardNavigationEnabled: boolean;
  focusOutlineVisible: boolean;

  // Actions
  setReducedMotion: (enabled: boolean) => void;
  setHighContrast: (enabled: boolean) => void;
  setLargeText: (enabled: boolean) => void;
  setScreenReaderMode: (enabled: boolean) => void;
  setAudioDescriptions: (enabled: boolean) => void;
  setKeyboardNavigationEnabled: (enabled: boolean) => void;
  detectSystemPreferences: () => void;
}

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set) => ({
      reducedMotion: false,
      highContrast: false,
      largeText: false,
      screenReaderMode: false,
      audioDescriptions: false,
      keyboardNavigationEnabled: true,
      focusOutlineVisible: true,

      setReducedMotion: (enabled) => set({ reducedMotion: enabled }),
      setHighContrast: (enabled) => set({ highContrast: enabled }),
      setLargeText: (enabled) => set({ largeText: enabled }),
      setScreenReaderMode: (enabled) => set({ screenReaderMode: enabled }),
      setAudioDescriptions: (enabled) => set({ audioDescriptions: enabled }),
      setKeyboardNavigationEnabled: (enabled) => set({ keyboardNavigationEnabled: enabled }),

      detectSystemPreferences: () => {
        if (typeof window === 'undefined') return;

        // Detect reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Detect high contrast preference
        const prefersHighContrast = window.matchMedia('(prefers-contrast: more)').matches;

        set({
          reducedMotion: prefersReducedMotion,
          highContrast: prefersHighContrast,
        });
      },
    }),
    {
      name: 'campus-tour-accessibility',
    }
  )
);

/**
 * Hook to manage focus trap within a container
 */
export const useFocusTrap = (isActive: boolean) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element
    firstElement.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [isActive]);

  return containerRef;
};

/**
 * Hook for keyboard shortcuts
 */
interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description: string;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  const { keyboardNavigationEnabled } = useAccessibilityStore();

  useEffect(() => {
    if (!keyboardNavigationEnabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      for (const shortcut of shortcuts) {
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = !shortcut.ctrlKey || e.ctrlKey || e.metaKey;
        const shiftMatch = !shortcut.shiftKey || e.shiftKey;
        const altMatch = !shortcut.altKey || e.altKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          e.preventDefault();
          shortcut.action();
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, keyboardNavigationEnabled]);
};

/**
 * Hook for skip links (skip to main content)
 */
export const useSkipLinks = () => {
  const skipToMain = useCallback(() => {
    const main = document.querySelector('main, [role="main"], #main-content');
    if (main instanceof HTMLElement) {
      main.tabIndex = -1;
      main.focus();
      main.removeAttribute('tabindex');
    }
  }, []);

  const skipToNav = useCallback(() => {
    const nav = document.querySelector('nav, [role="navigation"]');
    if (nav instanceof HTMLElement) {
      nav.tabIndex = -1;
      nav.focus();
      nav.removeAttribute('tabindex');
    }
  }, []);

  return { skipToMain, skipToNav };
};

/**
 * Screen reader announcer
 */
class ScreenReaderAnnouncer {
  private static instance: ScreenReaderAnnouncer;
  private container: HTMLDivElement | null = null;

  private constructor() {
    if (typeof document !== 'undefined') {
      this.container = document.createElement('div');
      this.container.setAttribute('aria-live', 'polite');
      this.container.setAttribute('aria-atomic', 'true');
      this.container.setAttribute('class', 'sr-only');
      this.container.style.cssText =
        'position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;';
      document.body.appendChild(this.container);
    }
  }

  static getInstance(): ScreenReaderAnnouncer {
    if (!ScreenReaderAnnouncer.instance) {
      ScreenReaderAnnouncer.instance = new ScreenReaderAnnouncer();
    }
    return ScreenReaderAnnouncer.instance;
  }

  announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
    if (!this.container) return;

    this.container.setAttribute('aria-live', priority);
    this.container.textContent = '';

    // Use requestAnimationFrame to ensure the announcement is picked up
    requestAnimationFrame(() => {
      if (this.container) {
        this.container.textContent = message;
      }
    });
  }
}

export const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  ScreenReaderAnnouncer.getInstance().announce(message, priority);
};

/**
 * Hook for announcing route/location changes
 */
export const useAnnounceNavigation = (locationName: string | null) => {
  const previousLocation = useRef<string | null>(null);

  useEffect(() => {
    if (locationName && locationName !== previousLocation.current) {
      announce(`Navigated to ${locationName}`);
      previousLocation.current = locationName;
    }
  }, [locationName]);
};

/**
 * Component wrapper for accessible modals
 */
export interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  describedBy?: string;
}

/**
 * Generate unique IDs for ARIA relationships
 */
let idCounter = 0;
export const generateAriaId = (prefix: string = 'aria'): string => {
  return `${prefix}-${++idCounter}`;
};

/**
 * ARIA label generators for common tour elements
 */
export const ariaLabels = {
  hotspot: (name: string, type?: string) =>
    `${type || 'Interactive point'}: ${name}. Press Enter to interact.`,

  location: (name: string, description?: string) =>
    `Location: ${name}${description ? `. ${description}` : ''}`,

  navigationArrow: (direction: string, destination?: string) =>
    `Navigate ${direction}${destination ? ` to ${destination}` : ''}`,

  panorama: (locationName: string) =>
    `360 degree panoramic view of ${locationName}. Use arrow keys or drag to look around.`,

  minimap: (currentLocation: string) =>
    `Campus map. Current location: ${currentLocation}. Click on markers to navigate.`,

  bookmark: (locationName: string, isBookmarked: boolean) =>
    `${isBookmarked ? 'Remove bookmark from' : 'Bookmark'} ${locationName}`,

  share: (platform: string) => `Share current location on ${platform}`,

  audio: (isPlaying: boolean) => `${isPlaying ? 'Pause' : 'Play'} ambient audio`,

  fullscreen: (isFullscreen: boolean) => `${isFullscreen ? 'Exit' : 'Enter'} fullscreen mode`,

  tour: (tourName: string, step: number, total: number) => `${tourName}: Step ${step} of ${total}`,
};

/**
 * Detect if screen reader is likely active
 */
export const detectScreenReader = (): boolean => {
  if (typeof window === 'undefined') return false;

  // Check for common screen reader indicators
  const hasAriaLive = document.querySelector('[aria-live]') !== null;
  const hasReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // This is a heuristic - there's no reliable way to detect screen readers
  return hasAriaLive || hasReducedMotion;
};

export default useAccessibilityStore;
