/**
 * Responsive Layout Hook
 * Handles landscape/portrait detection and responsive UI adjustments
 */

import { useState, useEffect, useCallback } from 'react';

export type Orientation = 'portrait' | 'landscape';
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

interface ResponsiveState {
  orientation: Orientation;
  deviceType: DeviceType;
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
  isSmallScreen: boolean;
  isTouchDevice: boolean;
}

interface ResponsiveBreakpoints {
  mobile: number;
  tablet: number;
}

const DEFAULT_BREAKPOINTS: ResponsiveBreakpoints = {
  mobile: 640,
  tablet: 1024,
};

export const useResponsiveLayout = (breakpoints: Partial<ResponsiveBreakpoints> = {}) => {
  const bp = { ...DEFAULT_BREAKPOINTS, ...breakpoints };

  const getState = useCallback((): ResponsiveState => {
    if (typeof window === 'undefined') {
      return {
        orientation: 'portrait',
        deviceType: 'desktop',
        width: 1920,
        height: 1080,
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isPortrait: false,
        isLandscape: true,
        isSmallScreen: false,
        isTouchDevice: false,
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const orientation: Orientation = width > height ? 'landscape' : 'portrait';

    let deviceType: DeviceType = 'desktop';
    if (width <= bp.mobile) {
      deviceType = 'mobile';
    } else if (width <= bp.tablet) {
      deviceType = 'tablet';
    }

    // Also consider portrait tablets as mobile-like
    const isMobileLike =
      deviceType === 'mobile' || (deviceType === 'tablet' && orientation === 'portrait');

    const isTouchDevice =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      ((navigator as Navigator & { msMaxTouchPoints?: number }).msMaxTouchPoints ?? 0) > 0;

    return {
      orientation,
      deviceType,
      width,
      height,
      isMobile: deviceType === 'mobile',
      isTablet: deviceType === 'tablet',
      isDesktop: deviceType === 'desktop',
      isPortrait: orientation === 'portrait',
      isLandscape: orientation === 'landscape',
      isSmallScreen: isMobileLike || width < 768,
      isTouchDevice,
    };
  }, [bp.mobile, bp.tablet]);

  const [state, setState] = useState<ResponsiveState>(getState);

  useEffect(() => {
    const handleResize = () => {
      setState(getState());
    };

    // Handle orientation change specifically for mobile devices
    const handleOrientationChange = () => {
      // Small delay to allow the browser to update dimensions
      setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    // Initial state
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [getState]);

  return state;
};

// Hook for applying responsive styles conditionally
export const useResponsiveValue = <T>(values: {
  mobile?: T;
  tablet?: T;
  desktop?: T;
  portrait?: T;
  landscape?: T;
  default: T;
}): T => {
  const { deviceType, orientation } = useResponsiveLayout();

  // Priority: orientation-specific > device-specific > default
  if (orientation === 'portrait' && values.portrait !== undefined) {
    return values.portrait;
  }
  if (orientation === 'landscape' && values.landscape !== undefined) {
    return values.landscape;
  }

  if (deviceType === 'mobile' && values.mobile !== undefined) {
    return values.mobile;
  }
  if (deviceType === 'tablet' && values.tablet !== undefined) {
    return values.tablet;
  }
  if (deviceType === 'desktop' && values.desktop !== undefined) {
    return values.desktop;
  }

  return values.default;
};

// CSS class helper for responsive layouts
export const useResponsiveClasses = () => {
  const { orientation, deviceType, isSmallScreen, isTouchDevice } = useResponsiveLayout();

  return {
    // Base orientation/device classes
    orientationClass: `orientation-${orientation}`,
    deviceClass: `device-${deviceType}`,

    // Conditional classes
    smallScreenClass: isSmallScreen ? 'small-screen' : 'large-screen',
    touchClass: isTouchDevice ? 'touch-device' : 'pointer-device',

    // Combined for easy application
    layoutClasses: [
      `orientation-${orientation}`,
      `device-${deviceType}`,
      isSmallScreen ? 'small-screen' : 'large-screen',
      isTouchDevice ? 'touch-device' : 'pointer-device',
    ].join(' '),
  };
};
