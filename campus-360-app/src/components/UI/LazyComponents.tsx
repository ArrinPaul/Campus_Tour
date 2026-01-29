/**
 * Lazy-loaded Components
 * Dynamic imports for code splitting - only load when needed
 */

import React, { Suspense, lazy } from 'react';

// Loading fallback component
const LoadingFallback: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <div className="flex items-center justify-center p-4">
    <div className="flex flex-col items-center gap-2">
      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-white/60 text-sm">{message}</span>
    </div>
  </div>
);

// Lazy load heavy UI components
const LazyMapOverlayComponent = lazy(() => import('./MapOverlay'));
const LazyHelpOverlayComponent = lazy(() => import('./HelpOverlay'));
const LazyPerformanceSettingsComponent = lazy(() => import('./PerformanceSettings'));

export const LazyMapOverlay: React.FC = () => (
  <Suspense fallback={<LoadingFallback message="Loading map..." />}>
    <LazyMapOverlayComponent />
  </Suspense>
);

export const LazyHelpOverlay: React.FC = () => (
  <Suspense fallback={<LoadingFallback message="Loading help..." />}>
    <LazyHelpOverlayComponent />
  </Suspense>
);

export const LazyPerformanceSettings: React.FC = () => (
  <Suspense fallback={<LoadingFallback message="Loading settings..." />}>
    <LazyPerformanceSettingsComponent />
  </Suspense>
);
