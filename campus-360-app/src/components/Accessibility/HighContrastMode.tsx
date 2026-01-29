/**
 * Accessibility Components
 * High Contrast Mode overlay and One-Hand Mode UI adjustments
 */

import { useEffect } from 'react';
import { useAccessibilityStore } from '../../hooks/useAccessibilityStore';

/**
 * High Contrast Provider
 * Applies high contrast CSS variables and classes to the document
 */
export const HighContrastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { highContrastMode, largeText, reduceMotion } = useAccessibilityStore();

  useEffect(() => {
    const root = document.documentElement;
    
    if (highContrastMode) {
      root.classList.add('high-contrast');
      // Apply high contrast CSS variables
      root.style.setProperty('--hc-bg', '#000000');
      root.style.setProperty('--hc-text', '#ffffff');
      root.style.setProperty('--hc-accent', '#ffff00');
      root.style.setProperty('--hc-link', '#00ffff');
      root.style.setProperty('--hc-border', '#ffffff');
      root.style.setProperty('--hc-button-bg', '#ffffff');
      root.style.setProperty('--hc-button-text', '#000000');
    } else {
      root.classList.remove('high-contrast');
      root.style.removeProperty('--hc-bg');
      root.style.removeProperty('--hc-text');
      root.style.removeProperty('--hc-accent');
      root.style.removeProperty('--hc-link');
      root.style.removeProperty('--hc-border');
      root.style.removeProperty('--hc-button-bg');
      root.style.removeProperty('--hc-button-text');
    }

    return () => {
      root.classList.remove('high-contrast');
    };
  }, [highContrastMode]);

  useEffect(() => {
    const root = document.documentElement;
    
    if (largeText) {
      root.classList.add('large-text');
      root.style.setProperty('--base-font-size', '1.25rem');
    } else {
      root.classList.remove('large-text');
      root.style.removeProperty('--base-font-size');
    }
  }, [largeText]);

  useEffect(() => {
    const root = document.documentElement;
    
    if (reduceMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
  }, [reduceMotion]);

  return <>{children}</>;
};

/**
 * High Contrast Styles (inject into head)
 */
export const HighContrastStyles: React.FC = () => {
  return (
    <style>{`
      /* High Contrast Mode Styles */
      .high-contrast {
        --tw-bg-opacity: 1 !important;
      }
      
      .high-contrast .hc-bg {
        background-color: var(--hc-bg) !important;
      }
      
      .high-contrast .hc-text {
        color: var(--hc-text) !important;
      }
      
      .high-contrast .hc-border {
        border-color: var(--hc-border) !important;
        border-width: 2px !important;
      }
      
      .high-contrast button,
      .high-contrast .hc-button {
        background-color: var(--hc-button-bg) !important;
        color: var(--hc-button-text) !important;
        border: 3px solid var(--hc-accent) !important;
        font-weight: bold !important;
      }
      
      .high-contrast button:hover,
      .high-contrast button:focus {
        background-color: var(--hc-accent) !important;
        color: var(--hc-bg) !important;
        outline: 3px solid var(--hc-text) !important;
        outline-offset: 2px;
      }
      
      .high-contrast a,
      .high-contrast .hc-link {
        color: var(--hc-link) !important;
        text-decoration: underline !important;
      }
      
      .high-contrast .backdrop-blur-md,
      .high-contrast .backdrop-blur-sm,
      .high-contrast .backdrop-blur {
        backdrop-filter: none !important;
        background-color: var(--hc-bg) !important;
      }
      
      .high-contrast .bg-white\\/10,
      .high-contrast .bg-white\\/20,
      .high-contrast .bg-black\\/50,
      .high-contrast .bg-black\\/60,
      .high-contrast .bg-black\\/70 {
        background-color: var(--hc-bg) !important;
        border: 2px solid var(--hc-border) !important;
      }
      
      .high-contrast .text-white\\/60,
      .high-contrast .text-white\\/70,
      .high-contrast .text-white\\/80 {
        color: var(--hc-text) !important;
      }
      
      .high-contrast .bg-gradient-to-r,
      .high-contrast .bg-gradient-to-br,
      .high-contrast .bg-gradient-to-b {
        background: var(--hc-bg) !important;
        border: 2px solid var(--hc-accent) !important;
      }

      /* Large Text Mode */
      .large-text {
        font-size: var(--base-font-size, 1rem);
      }
      
      .large-text button,
      .large-text p,
      .large-text span,
      .large-text label {
        font-size: 1.2em !important;
      }
      
      .large-text h1 { font-size: 2.5em !important; }
      .large-text h2 { font-size: 2em !important; }
      .large-text h3 { font-size: 1.75em !important; }
      .large-text h4 { font-size: 1.5em !important; }

      /* Reduce Motion */
      .reduce-motion *,
      .reduce-motion *::before,
      .reduce-motion *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    `}</style>
  );
};
