/**
 * Unit Tests for useThemeStore
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import { useThemeStore } from '../useThemeStore';

describe('useThemeStore', () => {
  beforeEach(() => {
    // Reset store state
    useThemeStore.setState({
      mode: 'dark',
      resolvedTheme: 'dark',
    });
  });

  describe('setMode', () => {
    it('should set theme mode to light', () => {
      const { setMode } = useThemeStore.getState();

      act(() => {
        setMode('light');
      });

      const state = useThemeStore.getState();
      expect(state.mode).toBe('light');
      expect(state.resolvedTheme).toBe('light');
    });

    it('should set theme mode to dark', () => {
      act(() => {
        useThemeStore.setState({ mode: 'light', resolvedTheme: 'light' });
      });

      const { setMode } = useThemeStore.getState();

      act(() => {
        setMode('dark');
      });

      const state = useThemeStore.getState();
      expect(state.mode).toBe('dark');
      expect(state.resolvedTheme).toBe('dark');
    });

    it('should resolve system theme correctly', () => {
      const { setMode } = useThemeStore.getState();

      act(() => {
        setMode('system');
      });

      const state = useThemeStore.getState();
      expect(state.mode).toBe('system');
      // Since we mocked prefers-color-scheme: dark to return true
      expect(state.resolvedTheme).toBe('dark');
    });
  });

  describe('toggleTheme', () => {
    it('should cycle through themes: dark -> light -> system -> dark', () => {
      const { toggleTheme } = useThemeStore.getState();

      // Start with dark
      act(() => {
        useThemeStore.setState({ mode: 'dark', resolvedTheme: 'dark' });
      });

      // Toggle to light
      act(() => {
        toggleTheme();
      });
      expect(useThemeStore.getState().mode).toBe('light');

      // Toggle to system
      act(() => {
        toggleTheme();
      });
      expect(useThemeStore.getState().mode).toBe('system');

      // Toggle back to dark
      act(() => {
        toggleTheme();
      });
      expect(useThemeStore.getState().mode).toBe('dark');
    });
  });

  describe('resolvedTheme', () => {
    it('should match mode when mode is light or dark', () => {
      const { setMode } = useThemeStore.getState();

      act(() => {
        setMode('light');
      });
      expect(useThemeStore.getState().resolvedTheme).toBe('light');

      act(() => {
        setMode('dark');
      });
      expect(useThemeStore.getState().resolvedTheme).toBe('dark');
    });
  });
});
