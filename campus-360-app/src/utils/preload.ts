/**
 * Component preloading utilities
 * Separated from LazyComponents to avoid fast-refresh warnings
 */

// Preload all heavy components after initial render
export const preloadHeavyComponents = () => {
  // Delay preloading to not compete with initial render
  setTimeout(() => {
    import('../components/UI/MapOverlay').catch(() => {});
    import('../components/UI/HelpOverlay').catch(() => {});
    import('../components/UI/PerformanceSettings').catch(() => {});
  }, 2000);
};
