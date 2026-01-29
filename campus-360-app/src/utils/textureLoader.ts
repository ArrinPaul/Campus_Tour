import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { usePerformanceStore } from '../hooks/usePerformanceStore';

// Track preloaded URLs to avoid duplicates
const preloadedUrls = new Set<string>();
const preloadQueue: string[] = [];
let isProcessingQueue = false;

export const preloadTexture = (url: string) => {
  useLoader.preload(THREE.TextureLoader, url);
};

// Smart preloader that respects performance settings
export const preloadImages = (urls: string[]) => {
  const settings = usePerformanceStore.getState().settings;
  const maxPreload = settings.preloadCount;

  // Filter out already preloaded URLs
  const newUrls = urls.filter((url) => !preloadedUrls.has(url));

  // Limit based on performance settings
  const urlsToPreload = newUrls.slice(0, maxPreload);

  urlsToPreload.forEach((url) => {
    preloadedUrls.add(url);
    preloadTexture(url);
  });
};

// Priority-based preloader for smarter loading
export const preloadWithPriority = (
  urls: { url: string; priority: 'high' | 'medium' | 'low' }[]
) => {
  const settings = usePerformanceStore.getState().settings;

  // Sort by priority
  const sorted = [...urls].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  // Filter and limit
  const maxPreload = settings.preloadCount;
  const newUrls = sorted.filter((item) => !preloadedUrls.has(item.url)).slice(0, maxPreload);

  newUrls.forEach((item) => {
    preloadedUrls.add(item.url);
    preloadTexture(item.url);
  });
};

// Queue-based preloader for background loading
export const queuePreload = (urls: string[]) => {
  urls.forEach((url) => {
    if (!preloadedUrls.has(url) && !preloadQueue.includes(url)) {
      preloadQueue.push(url);
    }
  });

  if (!isProcessingQueue) {
    processQueue();
  }
};

const processQueue = () => {
  if (preloadQueue.length === 0) {
    isProcessingQueue = false;
    return;
  }

  isProcessingQueue = true;
  const url = preloadQueue.shift()!;

  if (!preloadedUrls.has(url)) {
    preloadedUrls.add(url);
    preloadTexture(url);
  }

  // Process next item with a delay to avoid blocking
  setTimeout(processQueue, 100);
};

// Clear preload cache (useful for memory management)
export const clearPreloadCache = () => {
  preloadedUrls.clear();
  preloadQueue.length = 0;
};

// Get preload stats
export const getPreloadStats = () => ({
  preloadedCount: preloadedUrls.size,
  queueLength: preloadQueue.length,
});
