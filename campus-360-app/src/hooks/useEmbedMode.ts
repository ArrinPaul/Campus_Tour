/**
 * Embed Mode Hook
 * Detects if running in iframe and parses embed options
 */

import { useSyncExternalStore } from 'react';

interface EmbedOptions {
  showControls: boolean;
  showNavigation: boolean;
  autoplay: boolean;
}

// Check if we're in an iframe (runs once on module load)
const getIsEmbedded = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    return window.self !== window.top;
  } catch {
    return true; // If we can't access window.top, we're likely in a cross-origin iframe
  }
};

// Parse embed options from URL
const getEmbedOptions = (): Partial<EmbedOptions> => {
  if (typeof window === 'undefined') return {};

  const params = new URLSearchParams(window.location.search);
  const isEmbedParam = params.get('embed') === 'true';
  const inIframe = getIsEmbedded();

  if (!isEmbedParam && !inIframe) return {};

  return {
    showControls: params.get('controls') !== 'false',
    showNavigation: params.get('nav') !== 'false',
    autoplay: params.get('autoplay') === 'true',
  };
};

// Subscribe function for useSyncExternalStore (no-op since these don't change)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const subscribe = (_callback: () => void) => {
  return () => {};
};

// Server snapshot
const getServerSnapshot = () => ({
  isEmbedded: false,
  embedOptions: {} as Partial<EmbedOptions>,
});

// Client snapshot (memoized)
let cachedSnapshot: { isEmbedded: boolean; embedOptions: Partial<EmbedOptions> } | null = null;

const getSnapshot = () => {
  if (cachedSnapshot === null) {
    cachedSnapshot = {
      isEmbedded: getIsEmbedded(),
      embedOptions: getEmbedOptions(),
    };

    // Add embed class to body if embedded
    if (cachedSnapshot.isEmbedded && typeof document !== 'undefined') {
      document.body.classList.add('is-embedded');
    }
  }
  return cachedSnapshot;
};

/**
 * Hook to detect if running in embed mode (iframe)
 * Returns stable references - no re-renders
 */
export const useEmbedMode = () => {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};

/**
 * Generate embed code for current view
 */
export const generateEmbedCode = (
  options: {
    width: string;
    height: string;
    showControls: boolean;
    showNavigation: boolean;
    autoplay: boolean;
    responsive: boolean;
  },
  currentUrl?: string
): string => {
  const baseUrl = currentUrl || window.location.href.split('?')[0];
  const params = new URLSearchParams();

  // Add current location if available
  const urlParams = new URLSearchParams(window.location.search);
  const block = urlParams.get('block');
  const view = urlParams.get('view');
  if (block) params.set('block', block);
  if (view) params.set('view', view);

  // Add embed options
  params.set('embed', 'true');
  if (!options.showControls) params.set('controls', 'false');
  if (!options.showNavigation) params.set('nav', 'false');
  if (options.autoplay) params.set('autoplay', 'true');

  const embedUrl = `${baseUrl}?${params.toString()}`;

  if (options.responsive) {
    return `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
  <iframe
    src="${embedUrl}"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
    allowfullscreen
    loading="lazy"
    title="Campus Virtual Tour"
  ></iframe>
</div>`;
  }

  return `<iframe
  src="${embedUrl}"
  width="${options.width}"
  height="${options.height}"
  style="border: 0;"
  allowfullscreen
  loading="lazy"
  title="Campus Virtual Tour"
></iframe>`;
};
