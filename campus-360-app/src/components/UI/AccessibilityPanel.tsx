/**
 * Accessibility Settings Panel
 * UI for managing accessibility preferences
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useAccessibilityStore } from '../../utils/accessibility';
import { useEffect } from 'react';

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label: string;
  description?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onChange, label, description }) => {
  const id = `toggle-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="flex items-start justify-between py-3">
      <div className="flex-1 pr-4">
        <label htmlFor={id} className="text-white font-medium cursor-pointer">
          {label}
        </label>
        {description && <p className="text-white/60 text-sm mt-0.5">{description}</p>}
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
          enabled ? 'bg-blue-500' : 'bg-white/20'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({ isOpen, onClose }) => {
  const {
    reducedMotion,
    highContrast,
    largeText,
    screenReaderMode,
    audioDescriptions,
    keyboardNavigationEnabled,
    setReducedMotion,
    setHighContrast,
    setLargeText,
    setScreenReaderMode,
    setAudioDescriptions,
    setKeyboardNavigationEnabled,
    detectSystemPreferences,
  } = useAccessibilityStore();

  // Apply settings to document
  useEffect(() => {
    const root = document.documentElement;

    if (reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }
  }, [reducedMotion, highContrast, largeText]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl z-50 flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-labelledby="a11y-panel-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2
                id="a11y-panel-title"
                className="text-xl font-bold text-white flex items-center gap-2"
              >
                <span>♿</span>
                Accessibility
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Close accessibility panel"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Visual Section */}
              <section className="mb-6">
                <h3 className="text-white/70 text-sm font-semibold uppercase tracking-wide mb-3">
                  Visual
                </h3>
                <div className="bg-white/5 rounded-xl p-4 divide-y divide-white/10">
                  <ToggleSwitch
                    enabled={reducedMotion}
                    onChange={setReducedMotion}
                    label="Reduce Motion"
                    description="Minimize animations and transitions"
                  />
                  <ToggleSwitch
                    enabled={highContrast}
                    onChange={setHighContrast}
                    label="High Contrast"
                    description="Increase contrast for better visibility"
                  />
                  <ToggleSwitch
                    enabled={largeText}
                    onChange={setLargeText}
                    label="Large Text"
                    description="Increase text size throughout the app"
                  />
                </div>
              </section>

              {/* Audio Section */}
              <section className="mb-6">
                <h3 className="text-white/70 text-sm font-semibold uppercase tracking-wide mb-3">
                  Audio
                </h3>
                <div className="bg-white/5 rounded-xl p-4 divide-y divide-white/10">
                  <ToggleSwitch
                    enabled={screenReaderMode}
                    onChange={setScreenReaderMode}
                    label="Screen Reader Mode"
                    description="Optimize for screen reader users"
                  />
                  <ToggleSwitch
                    enabled={audioDescriptions}
                    onChange={setAudioDescriptions}
                    label="Audio Descriptions"
                    description="Announce navigation and interactions"
                  />
                </div>
              </section>

              {/* Navigation Section */}
              <section className="mb-6">
                <h3 className="text-white/70 text-sm font-semibold uppercase tracking-wide mb-3">
                  Navigation
                </h3>
                <div className="bg-white/5 rounded-xl p-4 divide-y divide-white/10">
                  <ToggleSwitch
                    enabled={keyboardNavigationEnabled}
                    onChange={setKeyboardNavigationEnabled}
                    label="Keyboard Navigation"
                    description="Enable keyboard shortcuts"
                  />
                </div>
              </section>

              {/* Keyboard Shortcuts Reference */}
              <section className="mb-6">
                <h3 className="text-white/70 text-sm font-semibold uppercase tracking-wide mb-3">
                  Keyboard Shortcuts
                </h3>
                <div className="bg-white/5 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">Navigate forward</span>
                    <kbd className="px-2 py-0.5 bg-white/10 rounded text-white/60">→</kbd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">Navigate backward</span>
                    <kbd className="px-2 py-0.5 bg-white/10 rounded text-white/60">←</kbd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">Look up/down</span>
                    <kbd className="px-2 py-0.5 bg-white/10 rounded text-white/60">↑ / ↓</kbd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">Toggle fullscreen</span>
                    <kbd className="px-2 py-0.5 bg-white/10 rounded text-white/60">F</kbd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">Toggle map</span>
                    <kbd className="px-2 py-0.5 bg-white/10 rounded text-white/60">M</kbd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">Toggle help</span>
                    <kbd className="px-2 py-0.5 bg-white/10 rounded text-white/60">H / ?</kbd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">Close dialog</span>
                    <kbd className="px-2 py-0.5 bg-white/10 rounded text-white/60">Esc</kbd>
                  </div>
                </div>
              </section>

              {/* Reset Button */}
              <button
                onClick={detectSystemPreferences}
                className="w-full py-3 px-4 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Detect System Preferences
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

interface AccessibilityButtonProps {
  onClick: () => void;
  className?: string;
}

export const AccessibilityButton: React.FC<AccessibilityButtonProps> = ({
  onClick,
  className = '',
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      aria-label="Open accessibility settings"
      title="Accessibility"
    >
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    </motion.button>
  );
};

/**
 * Skip Link Component
 * Allows keyboard users to skip to main content
 */
export const SkipLink: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:outline-none"
    >
      Skip to main content
    </a>
  );
};

export default AccessibilityPanel;
