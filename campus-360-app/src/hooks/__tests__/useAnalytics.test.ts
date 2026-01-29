/**
 * Unit Tests for useAnalytics hook
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useAnalyticsStore, useAnalytics } from '../useAnalytics';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useAnalyticsStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAnalyticsStore.setState({
      sessionId: 'test-session',
      sessionStartTime: Date.now(),
      events: [],
      locationStats: {},
      totalPageViews: 0,
      totalSessionTime: 0,
      analyticsEnabled: true,
      debugMode: false,
    });
  });

  describe('trackEvent', () => {
    it('should track an event when analytics is enabled', () => {
      const { trackEvent } = useAnalyticsStore.getState();

      act(() => {
        trackEvent('page_view', { page: 'home' });
      });

      const state = useAnalyticsStore.getState();
      expect(state.events).toHaveLength(1);
      expect(state.events[0].type).toBe('page_view');
      expect(state.events[0].data.page).toBe('home');
    });

    it('should not track events when analytics is disabled', () => {
      act(() => {
        useAnalyticsStore.setState({ analyticsEnabled: false });
      });

      const { trackEvent } = useAnalyticsStore.getState();

      act(() => {
        trackEvent('page_view', { page: 'home' });
      });

      const state = useAnalyticsStore.getState();
      expect(state.events).toHaveLength(0);
    });

    it('should increment totalPageViews for page_view events', () => {
      const { trackEvent } = useAnalyticsStore.getState();

      act(() => {
        trackEvent('page_view');
        trackEvent('page_view');
        trackEvent('hotspot_click');
      });

      const state = useAnalyticsStore.getState();
      expect(state.totalPageViews).toBe(2);
    });

    it('should limit events to 1000', () => {
      const { trackEvent } = useAnalyticsStore.getState();

      act(() => {
        for (let i = 0; i < 1100; i++) {
          trackEvent('page_view');
        }
      });

      const state = useAnalyticsStore.getState();
      expect(state.events.length).toBeLessThanOrEqual(1000);
    });
  });

  describe('trackLocationVisit', () => {
    it('should track location visits and increment visit count', () => {
      const { trackLocationVisit } = useAnalyticsStore.getState();

      act(() => {
        trackLocationVisit('Block1', 'entrance');
        trackLocationVisit('Block1', 'entrance');
        trackLocationVisit('Block2', 'lobby');
      });

      const state = useAnalyticsStore.getState();
      expect(state.locationStats['Block1:entrance'].visitCount).toBe(2);
      expect(state.locationStats['Block2:lobby'].visitCount).toBe(1);
    });

    it('should update lastVisited timestamp', () => {
      const { trackLocationVisit } = useAnalyticsStore.getState();
      const beforeTime = Date.now();

      act(() => {
        trackLocationVisit('Block1', 'entrance');
      });

      const state = useAnalyticsStore.getState();
      expect(state.locationStats['Block1:entrance'].lastVisited).toBeGreaterThanOrEqual(beforeTime);
    });
  });

  describe('getPopularLocations', () => {
    it('should return locations sorted by visit count', () => {
      const { trackLocationVisit, getPopularLocations } = useAnalyticsStore.getState();

      act(() => {
        trackLocationVisit('Block1', 'entrance');
        trackLocationVisit('Block2', 'lobby');
        trackLocationVisit('Block2', 'lobby');
        trackLocationVisit('Block2', 'lobby');
        trackLocationVisit('Block1', 'hallway');
        trackLocationVisit('Block1', 'hallway');
      });

      const popular = getPopularLocations(3);
      expect(popular[0].visitCount).toBe(3);
      expect(popular[0].locationId).toBe('lobby');
      expect(popular[1].visitCount).toBe(2);
    });

    it('should respect the limit parameter', () => {
      const { trackLocationVisit, getPopularLocations } = useAnalyticsStore.getState();

      act(() => {
        for (let i = 0; i < 20; i++) {
          trackLocationVisit('Block1', `location${i}`);
        }
      });

      const popular = getPopularLocations(5);
      expect(popular).toHaveLength(5);
    });
  });

  describe('getRecentEvents', () => {
    it('should return events in reverse chronological order', () => {
      const { trackEvent, getRecentEvents } = useAnalyticsStore.getState();

      act(() => {
        trackEvent('page_view', { index: 1 });
        trackEvent('hotspot_click', { index: 2 });
        trackEvent('bookmark_add', { index: 3 });
      });

      const recent = getRecentEvents(3);
      expect(recent[0].data.index).toBe(3);
      expect(recent[2].data.index).toBe(1);
    });
  });

  describe('clearAnalytics', () => {
    it('should reset all analytics data', () => {
      const { trackEvent, trackLocationVisit, clearAnalytics } = useAnalyticsStore.getState();

      act(() => {
        trackEvent('page_view');
        trackLocationVisit('Block1', 'entrance');
        clearAnalytics();
      });

      const state = useAnalyticsStore.getState();
      expect(state.events).toHaveLength(0);
      expect(Object.keys(state.locationStats)).toHaveLength(0);
      expect(state.totalPageViews).toBe(0);
    });
  });
});

describe('useAnalytics hook', () => {
  it('should provide track function', () => {
    const { result } = renderHook(() => useAnalytics());

    expect(result.current.track).toBeDefined();
    expect(typeof result.current.track).toBe('function');
  });

  it('should track events using the hook', () => {
    const { result } = renderHook(() => useAnalytics());

    act(() => {
      result.current.track('screenshot_taken', { format: 'png' });
    });

    const state = useAnalyticsStore.getState();
    const events = state.events.filter((e) => e.type === 'screenshot_taken');
    expect(events).toHaveLength(1);
  });
});
