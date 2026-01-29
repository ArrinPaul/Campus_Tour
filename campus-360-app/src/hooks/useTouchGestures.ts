import { useEffect, useRef, useCallback } from 'react';
import { useCameraControlsStore } from './useCameraControlsStore';

interface TouchGesturesOptions {
  enabled?: boolean;
}

export const useTouchGestures = ({ enabled = true }: TouchGesturesOptions = {}) => {
  const { setCameraFov, cameraFov, stopRotation } = useCameraControlsStore();

  const touchState = useRef({
    initialDistance: 0,
    initialFov: 75,
    lastTouchX: 0,
    lastTouchY: 0,
    isTwoFingerTouch: false,
    isSwipeNavigation: false,
    swipeStartX: 0,
    swipeStartY: 0,
    swipeStartTime: 0,
  });

  const getDistance = useCallback((touches: TouchList) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      const state = touchState.current;

      if (e.touches.length === 2) {
        // Two-finger touch - prepare for pinch zoom
        state.isTwoFingerTouch = true;
        state.initialDistance = getDistance(e.touches);
        state.initialFov = cameraFov;
      } else if (e.touches.length === 1) {
        // Single finger - track for swipe detection
        state.isTwoFingerTouch = false;
        state.swipeStartX = e.touches[0].clientX;
        state.swipeStartY = e.touches[0].clientY;
        state.swipeStartTime = Date.now();
        state.lastTouchX = e.touches[0].clientX;
        state.lastTouchY = e.touches[0].clientY;
      }
    },
    [cameraFov, getDistance]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      const state = touchState.current;

      if (e.touches.length === 2 && state.isTwoFingerTouch) {
        // Pinch to zoom
        const currentDistance = getDistance(e.touches);
        const scale = currentDistance / state.initialDistance;

        // Calculate new FOV (smaller FOV = more zoomed in)
        let newFov = state.initialFov / scale;
        newFov = Math.max(30, Math.min(100, newFov));

        if (Math.abs(newFov - cameraFov) > 0.5) {
          setCameraFov(newFov);
        }
      } else if (e.touches.length === 1 && !state.isTwoFingerTouch) {
        // Single finger movement for camera rotation is handled by OrbitControls
        // We track for swipe gesture detection
        state.lastTouchX = e.touches[0].clientX;
        state.lastTouchY = e.touches[0].clientY;
      }
    },
    [cameraFov, setCameraFov, getDistance]
  );

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      const state = touchState.current;

      if (state.isTwoFingerTouch) {
        state.isTwoFingerTouch = false;
        state.initialDistance = 0;
      }

      // Detect quick swipe for navigation
      if (e.changedTouches.length === 1 && !state.isTwoFingerTouch) {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const deltaX = endX - state.swipeStartX;
        const deltaY = endY - state.swipeStartY;
        const deltaTime = Date.now() - state.swipeStartTime;

        // Quick swipe detection (fast movement over minimum distance)
        const minSwipeDistance = 100;
        const maxSwipeTime = 300;

        if (deltaTime < maxSwipeTime) {
          const absX = Math.abs(deltaX);
          const absY = Math.abs(deltaY);

          if (absX > minSwipeDistance && absX > absY) {
            // Horizontal swipe - could trigger scene navigation
            window.dispatchEvent(
              new CustomEvent('swipe-navigation', {
                detail: { direction: deltaX > 0 ? 'right' : 'left' },
              })
            );
          } else if (absY > minSwipeDistance && absY > absX) {
            // Vertical swipe
            window.dispatchEvent(
              new CustomEvent('swipe-navigation', {
                detail: { direction: deltaY > 0 ? 'down' : 'up' },
              })
            );
          }
        }
      }

      stopRotation();
    },
    [stopRotation]
  );

  useEffect(() => {
    if (!enabled) return;

    const options = { passive: false };

    window.addEventListener('touchstart', handleTouchStart, options);
    window.addEventListener('touchmove', handleTouchMove, options);
    window.addEventListener('touchend', handleTouchEnd, options);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
  };
};
