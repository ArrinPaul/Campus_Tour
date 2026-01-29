/**
 * Deep Linking Utilities
 * Enhanced URL sharing with camera angles, zoom, and view state
 */

import { useEffect, useCallback } from 'react';
import { useTourState } from './useTourState';
import { useCameraControlsStore } from './useCameraControlsStore';

export interface DeepLinkState {
  block?: string;
  view?: string;
  yaw?: number; // Camera horizontal rotation (degrees)
  pitch?: number; // Camera vertical rotation (degrees)
  fov?: number; // Field of view (zoom level)
  autoplay?: boolean; // Start guided tour
  tourId?: string; // Specific tour to start
}

/**
 * Parse URL search params into deep link state
 */
export const parseDeepLink = (searchParams: URLSearchParams): DeepLinkState => {
  const state: DeepLinkState = {};

  const block = searchParams.get('block');
  const view = searchParams.get('view');
  const yaw = searchParams.get('yaw');
  const pitch = searchParams.get('pitch');
  const fov = searchParams.get('fov');
  const autoplay = searchParams.get('autoplay');
  const tourId = searchParams.get('tour');

  if (block) state.block = block;
  if (view) state.view = view;
  if (yaw) state.yaw = parseFloat(yaw);
  if (pitch) state.pitch = parseFloat(pitch);
  if (fov) state.fov = parseFloat(fov);
  if (autoplay === 'true' || autoplay === '1') state.autoplay = true;
  if (tourId) state.tourId = tourId;

  return state;
};

/**
 * Generate a shareable deep link URL
 */
export const generateDeepLink = (state: DeepLinkState, baseUrl?: string): string => {
  const url = new URL(baseUrl || window.location.origin + window.location.pathname);
  const params = url.searchParams;

  if (state.block) params.set('block', state.block);
  if (state.view) params.set('view', state.view);
  if (state.yaw !== undefined) params.set('yaw', state.yaw.toFixed(1));
  if (state.pitch !== undefined) params.set('pitch', state.pitch.toFixed(1));
  if (state.fov !== undefined) params.set('fov', state.fov.toFixed(0));
  if (state.autoplay) params.set('autoplay', '1');
  if (state.tourId) params.set('tour', state.tourId);

  return url.toString();
};

/**
 * Hook to manage deep linking
 */
export const useDeepLink = () => {
  const { currentBlockId, currentImageId, setBlock, setImage } = useTourState();
  const { cameraFov, currentYaw, setCameraFov, setCameraYaw } = useCameraControlsStore();

  // Get current state for sharing
  const getCurrentDeepLinkState = useCallback((): DeepLinkState => {
    return {
      block: currentBlockId || undefined,
      view: currentImageId || undefined,
      yaw: (currentYaw * 180) / Math.PI, // Convert radians to degrees
      fov: cameraFov,
    };
  }, [currentBlockId, currentImageId, currentYaw, cameraFov]);

  // Generate shareable URL
  const getShareableUrl = useCallback(
    (includeCamera = true): string => {
      const state = getCurrentDeepLinkState();
      if (!includeCamera) {
        delete state.yaw;
        delete state.pitch;
        delete state.fov;
      }
      return generateDeepLink(state);
    },
    [getCurrentDeepLinkState]
  );

  // Apply deep link state
  const applyDeepLink = useCallback(
    (state: DeepLinkState) => {
      if (state.block) setBlock(state.block);
      if (state.view) setImage(state.view);
      if (state.yaw !== undefined) {
        setCameraYaw((state.yaw * Math.PI) / 180); // Convert degrees to radians
      }
      if (state.fov !== undefined) {
        setCameraFov(state.fov);
      }
    },
    [setBlock, setImage, setCameraYaw, setCameraFov]
  );

  // Update URL when location changes (without camera)
  useEffect(() => {
    if (currentBlockId && currentImageId) {
      const params = new URLSearchParams(window.location.search);
      params.set('block', currentBlockId);
      params.set('view', currentImageId);

      // Preserve other params like yaw, fov
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, [currentBlockId, currentImageId]);

  // Copy URL to clipboard
  const copyShareableUrl = useCallback(
    async (includeCamera = true): Promise<boolean> => {
      try {
        const url = getShareableUrl(includeCamera);
        await navigator.clipboard.writeText(url);
        return true;
      } catch {
        console.error('Failed to copy URL');
        return false;
      }
    },
    [getShareableUrl]
  );

  // Share via Web Share API
  const shareUrl = useCallback(
    async (title = 'Campus Virtual Tour', text = 'Check out this view!'): Promise<boolean> => {
      const url = getShareableUrl(true);

      if ('share' in navigator) {
        try {
          await navigator.share({ title, text, url });
          return true;
        } catch {
          // User cancelled or share failed
          return false;
        }
      }

      // Fallback to copy
      return copyShareableUrl(true);
    },
    [getShareableUrl, copyShareableUrl]
  );

  return {
    getCurrentDeepLinkState,
    getShareableUrl,
    applyDeepLink,
    copyShareableUrl,
    shareUrl,
  };
};

/**
 * Component to handle initial deep link on page load
 */
export const DeepLinkHandler: React.FC = () => {
  const { applyDeepLink } = useDeepLink();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const state = parseDeepLink(params);

    // Apply camera state after a short delay to ensure scene is loaded
    if (state.yaw !== undefined || state.fov !== undefined) {
      const timer = setTimeout(() => {
        applyDeepLink(state);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [applyDeepLink]);

  return null;
};

// Need to import React for the component
import React from 'react';
