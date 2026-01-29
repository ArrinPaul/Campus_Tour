/**
 * Device Motion & Gyroscope Hook
 * Provides gyroscope and device motion controls for mobile devices
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useCameraControlsStore } from './useCameraControlsStore';

interface DeviceMotionState {
  isSupported: boolean;
  isEnabled: boolean;
  hasPermission: boolean | null;
  alpha: number;
  beta: number;
  gamma: number;
}

interface DeviceMotionConfig {
  sensitivity: number;
  smoothing: number;
}

const DEFAULT_CONFIG: DeviceMotionConfig = {
  sensitivity: 1.0,
  smoothing: 0.15,
};

export const useDeviceMotion = (config: Partial<DeviceMotionConfig> = {}) => {
  const { sensitivity, smoothing } = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  const { setGyroEnabled, setCameraYaw } = useCameraControlsStore();

  // Check if device orientation is supported
  const isSupported =
    typeof window !== 'undefined' &&
    ('DeviceOrientationEvent' in window || 'DeviceMotionEvent' in window);

  const [state, setState] = useState<DeviceMotionState>({
    isSupported,
    isEnabled: false,
    hasPermission: null,
    alpha: 0,
    beta: 0,
    gamma: 0,
  });

  const lastOrientationRef = useRef({ alpha: 0, beta: 0, gamma: 0 });
  const initialOrientationRef = useRef<{ alpha: number; beta: number } | null>(null);
  const smoothedRef = useRef({ alpha: 0, beta: 0 });

  // Request permission (required on iOS 13+)
  const requestPermission = useCallback(async (): Promise<boolean> => {
    // Check if permission API exists (iOS 13+)
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> })
        .requestPermission === 'function'
    ) {
      try {
        const permissionState = await (
          DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }
        ).requestPermission();
        const granted = permissionState === 'granted';
        setState((prev) => ({ ...prev, hasPermission: granted }));
        return granted;
      } catch {
        setState((prev) => ({ ...prev, hasPermission: false }));
        return false;
      }
    }
    // No permission needed on other devices
    setState((prev) => ({ ...prev, hasPermission: true }));
    return true;
  }, []);

  // Handle device orientation changes
  const handleOrientation = useCallback(
    (event: DeviceOrientationEvent) => {
      const alpha = event.alpha ?? 0;
      const beta = event.beta ?? 0;
      const gamma = event.gamma ?? 0;

      // Set initial orientation on first reading
      if (!initialOrientationRef.current) {
        initialOrientationRef.current = { alpha, beta };
        smoothedRef.current = { alpha: 0, beta: 0 };
      }

      // Calculate delta from initial orientation
      let deltaAlpha = alpha - (initialOrientationRef.current.alpha ?? 0);

      // Normalize alpha delta to handle wraparound
      if (deltaAlpha > 180) deltaAlpha -= 360;
      if (deltaAlpha < -180) deltaAlpha += 360;

      // Apply smoothing (exponential moving average)
      smoothedRef.current.alpha += (deltaAlpha - smoothedRef.current.alpha) * smoothing;

      // Update state
      setState((prev) => ({
        ...prev,
        alpha,
        beta,
        gamma,
      }));

      // Apply to camera yaw using existing store method
      const yawRadians = (smoothedRef.current.alpha * Math.PI * sensitivity) / 180;
      setCameraYaw(yawRadians);

      lastOrientationRef.current = { alpha, beta, gamma };
    },
    [sensitivity, smoothing, setCameraYaw]
  );

  // Enable device motion controls
  const enable = useCallback(async () => {
    if (!state.isSupported) {
      console.warn('Device orientation is not supported');
      return false;
    }

    // Request permission if needed
    const hasPermission = state.hasPermission ?? (await requestPermission());
    if (!hasPermission) {
      console.warn('Device orientation permission denied');
      return false;
    }

    // Reset initial orientation
    initialOrientationRef.current = null;

    window.addEventListener('deviceorientation', handleOrientation, true);
    setState((prev) => ({ ...prev, isEnabled: true }));
    setGyroEnabled(true);
    return true;
  }, [
    state.isSupported,
    state.hasPermission,
    requestPermission,
    handleOrientation,
    setGyroEnabled,
  ]);

  // Disable device motion controls
  const disable = useCallback(() => {
    window.removeEventListener('deviceorientation', handleOrientation, true);
    setState((prev) => ({ ...prev, isEnabled: false }));
    setGyroEnabled(false);
  }, [handleOrientation, setGyroEnabled]);

  // Toggle device motion
  const toggle = useCallback(async () => {
    if (state.isEnabled) {
      disable();
      return false;
    }
    return enable();
  }, [state.isEnabled, enable, disable]);

  // Reset to current orientation as center
  const recenter = useCallback(() => {
    initialOrientationRef.current = {
      alpha: lastOrientationRef.current.alpha,
      beta: lastOrientationRef.current.beta,
    };
    smoothedRef.current = { alpha: 0, beta: 0 };
    setCameraYaw(0);
  }, [setCameraYaw]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [handleOrientation]);

  return {
    ...state,
    requestPermission,
    enable,
    disable,
    toggle,
    recenter,
  };
};

// Simplified gyroscope hook for basic use
export const useGyroscope = () => {
  return useDeviceMotion({
    sensitivity: 1.0,
    smoothing: 0.15,
  });
};
