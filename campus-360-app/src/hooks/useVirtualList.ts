/**
 * Virtual Scrolling Hook
 * Efficient rendering for long lists with windowing
 */

import { useState, useMemo, useCallback } from 'react';

interface VirtualItem {
  id: string;
}

interface VirtualListItem<T> {
  item: T;
  index: number;
  style: {
    position: 'absolute';
    top: number;
    height: number;
    left: number;
    right: number;
  };
}

/**
 * Hook for virtual scrolling with configurable overscan
 */
export const useVirtualList = <T extends VirtualItem>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 3
) => {
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = items.length * itemHeight;

  const { startIndex, endIndex } = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const end = Math.min(items.length - 1, start + visibleCount + overscan * 2);
    return { startIndex: start, endIndex: end };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  const visibleItems: VirtualListItem<T>[] = useMemo(() => {
    return items.slice(startIndex, endIndex + 1).map((item, index) => ({
      item,
      index: startIndex + index,
      style: {
        position: 'absolute' as const,
        top: (startIndex + index) * itemHeight,
        height: itemHeight,
        left: 0,
        right: 0,
      },
    }));
  }, [items, startIndex, endIndex, itemHeight]);

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    handleScroll,
    scrollTop,
    startIndex,
    endIndex,
  };
};

/**
 * Window-based virtual scroll hook for very long lists
 */
export const useWindowVirtualScroll = <T extends VirtualItem>(items: T[], itemHeight: number) => {
  const [scrollY, setScrollY] = useState(0);
  const [windowHeight, setWindowHeight] = useState(
    typeof window !== 'undefined' ? window.innerHeight : 800
  );

  // Note: Call this in a useEffect in the component
  const setupListeners = useCallback(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleResize = () => setWindowHeight(window.innerHeight);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const { visibleItems, totalHeight, startIndex, endIndex } = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollY / itemHeight) - 5);
    const end = Math.min(items.length, Math.ceil((scrollY + windowHeight) / itemHeight) + 5);

    const visible = items.slice(start, end).map((item, i) => ({
      item,
      index: start + i,
      top: (start + i) * itemHeight,
    }));

    return {
      visibleItems: visible,
      totalHeight: items.length * itemHeight,
      startIndex: start,
      endIndex: end,
    };
  }, [items, itemHeight, scrollY, windowHeight]);

  return {
    visibleItems,
    totalHeight,
    startIndex,
    endIndex,
    setupListeners,
  };
};

/**
 * Calculate container height based on item count and max height
 */
export const calculateContainerHeight = (
  itemCount: number,
  itemHeight: number,
  maxHeight: number
): number => {
  return Math.min(maxHeight, itemCount * itemHeight);
};
