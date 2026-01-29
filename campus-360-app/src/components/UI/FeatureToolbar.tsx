/**
 * Feature Toolbar Component
 * A unified, compact toolbar for all extra features
 * Matches the existing UI design language
 * 
 * Admin Panel & A/B Testing are hidden by default
 * Press Ctrl+Shift+A to open Admin Panel (requires password)
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings2,
  Accessibility,
  Calendar,
  Cloud,
  Hand,
  Eye,
  Sun,
  Moon,
  X,
} from 'lucide-react';
import { useAccessibilityStore } from '../../hooks/useAccessibilityStore';
import { AdminPanel } from '../Admin/AdminPanel';
import { ABTestingPanel } from '../Admin/ABTestingPanel';
import { useAdminStore } from '../../hooks/useAdminStore';

// Feature Toggle Button Component
const FeatureButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick: () => void;
  badge?: string | number;
}> = ({ icon, label, isActive = false, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`relative p-3 rounded-xl transition-all ${
      isActive
        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/50'
        : 'text-white/60 hover:text-white hover:bg-white/10 border border-transparent'
    }`}
    title={label}
  >
    {icon}
    {badge !== undefined && (
      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-sky-500 text-white text-[10px] font-bold flex items-center justify-center">
        {badge}
      </span>
    )}
  </button>
);

interface FeatureToolbarProps {
  // Feature visibility states
  showWeather: boolean;
  setShowWeather: (show: boolean) => void;
  showEvents: boolean;
  setShowEvents: (show: boolean) => void;
  showAnalytics: boolean;
  setShowAnalytics: (show: boolean) => void;
  // Time of day
  timeOfDay: 'day' | 'night' | 'auto';
  setTimeOfDay: (time: 'day' | 'night' | 'auto') => void;
  // Admin features (hidden from normal users by default)
  showAdminPanel?: boolean;
  setShowAdminPanel?: (show: boolean) => void;
  showABTesting?: boolean;
  setShowABTesting?: (show: boolean) => void;
}

export const FeatureToolbar: React.FC<FeatureToolbarProps> = ({
  showWeather,
  setShowWeather,
  showEvents,
  setShowEvents,
  // Analytics props kept for App.tsx compatibility but not shown in toolbar
  showAnalytics: _showAnalytics,
  setShowAnalytics: _setShowAnalytics,
  timeOfDay,
  setTimeOfDay,
  showAdminPanel: externalShowAdminPanel,
  setShowAdminPanel: externalSetShowAdminPanel,
  showABTesting: externalShowABTesting,
  setShowABTesting: externalSetShowABTesting,
}) => {
  // Suppress unused variable warnings
  void _showAnalytics;
  void _setShowAnalytics;
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false);
  const [internalShowAdminPanel, setInternalShowAdminPanel] = useState(false);
  const [internalShowABTesting, setInternalShowABTesting] = useState(false);

  // Use external state if provided, otherwise use internal state
  const showAdminPanel = externalShowAdminPanel ?? internalShowAdminPanel;
  const setShowAdminPanel = externalSetShowAdminPanel ?? setInternalShowAdminPanel;
  const showABTesting = externalShowABTesting ?? internalShowABTesting;
  const setShowABTesting = externalSetShowABTesting ?? setInternalShowABTesting;

  // Check if user is authenticated as admin
  const isAdminMode = useAdminStore((state) => state.isAdminMode);

  // Secret keyboard shortcut for admin access: Ctrl+Shift+A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+A for Admin Panel
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setShowAdminPanel(true);
      }
      // Ctrl+Shift+T for A/B Testing (only if already logged in as admin)
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 't' && isAdminMode) {
        e.preventDefault();
        setShowABTesting(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminMode, setShowAdminPanel, setShowABTesting]);
  
  const {
    highContrastMode,
    oneHandMode,
    toggleHighContrast,
    toggleOneHandMode,
    handPreference,
    setHandPreference,
    largeText,
    toggleLargeText,
    reduceMotion,
    toggleReduceMotion,
  } = useAccessibilityStore();

  const activeAccessibilityCount = [highContrastMode, oneHandMode, largeText, reduceMotion].filter(Boolean).length;

  return (
    <>
      {/* Main Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-16 xs:bottom-18 sm:bottom-20 md:bottom-24 lg:bottom-28 right-2 xs:right-3 sm:right-4 md:right-6 lg:right-8 z-40"
      >
        <div className="flex flex-col items-center gap-2">
          {/* Expanded Feature Buttons */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                className="flex flex-col gap-2 p-2 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/10"
              >
                {/* Weather Toggle */}
                <FeatureButton
                  icon={<Cloud size={20} />}
                  label={showWeather ? 'Hide Weather' : 'Show Weather'}
                  isActive={showWeather}
                  onClick={() => setShowWeather(!showWeather)}
                />

                {/* Events Toggle */}
                <FeatureButton
                  icon={<Calendar size={20} />}
                  label={showEvents ? 'Hide Events' : 'Show Events'}
                  isActive={showEvents}
                  onClick={() => setShowEvents(!showEvents)}
                />

                {/* Divider */}
                <div className="w-full h-px bg-white/10 my-1" />

                {/* Time of Day Toggle */}
                <FeatureButton
                  icon={timeOfDay === 'night' ? <Moon size={20} /> : <Sun size={20} />}
                  label={`Time: ${timeOfDay}`}
                  isActive={timeOfDay !== 'auto'}
                  onClick={() => {
                    const modes: Array<'auto' | 'day' | 'night'> = ['auto', 'day', 'night'];
                    const currentIndex = modes.indexOf(timeOfDay);
                    setTimeOfDay(modes[(currentIndex + 1) % modes.length]);
                  }}
                />

                {/* Divider */}
                <div className="w-full h-px bg-white/10 my-1" />

                {/* Accessibility */}
                <FeatureButton
                  icon={<Accessibility size={20} />}
                  label="Accessibility"
                  isActive={activeAccessibilityCount > 0}
                  onClick={() => setShowAccessibilityPanel(true)}
                  badge={activeAccessibilityCount > 0 ? activeAccessibilityCount : undefined}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Toggle Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-3.5 rounded-full transition-all shadow-lg ${
              isExpanded
                ? 'bg-sky-500 text-white'
                : 'bg-black/50 backdrop-blur-xl border border-white/10 text-white/70 hover:text-white hover:bg-black/70'
            }`}
            title="Feature Settings"
          >
            {isExpanded ? <X size={22} /> : <Settings2 size={22} />}
          </button>
        </div>
      </motion.div>

      {/* Accessibility Quick Panel */}
      <AnimatePresence>
        {showAccessibilityPanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowAccessibilityPanel(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-sky-500/20">
                    <Accessibility size={20} className="text-sky-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">Accessibility</h2>
                </div>
                <button
                  onClick={() => setShowAccessibilityPanel(false)}
                  className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3">
                {/* High Contrast */}
                <AccessibilityToggle
                  icon={<Eye size={18} />}
                  label="High Contrast"
                  description="Increase visibility"
                  isActive={highContrastMode}
                  onToggle={toggleHighContrast}
                />

                {/* One-Hand Mode */}
                <AccessibilityToggle
                  icon={<Hand size={18} />}
                  label="One-Hand Mode"
                  description="Controls on one side"
                  isActive={oneHandMode}
                  onToggle={toggleOneHandMode}
                />

                {/* Hand Preference (only when one-hand mode is on) */}
                <AnimatePresence>
                  {oneHandMode && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex gap-2 ml-10"
                    >
                      <button
                        onClick={() => setHandPreference('left')}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                          handPreference === 'left'
                            ? 'bg-sky-500 text-white'
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        Left
                      </button>
                      <button
                        onClick={() => setHandPreference('right')}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                          handPreference === 'right'
                            ? 'bg-sky-500 text-white'
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        Right
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Large Text */}
                <AccessibilityToggle
                  icon={<span className="text-lg font-bold">A</span>}
                  label="Large Text"
                  description="Bigger fonts"
                  isActive={largeText}
                  onToggle={toggleLargeText}
                />

                {/* Reduce Motion */}
                <AccessibilityToggle
                  icon={<span className="text-sm">◇</span>}
                  label="Reduce Motion"
                  description="Less animations"
                  isActive={reduceMotion}
                  onToggle={toggleReduceMotion}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Panel Modal */}
      <AnimatePresence>
        {showAdminPanel && (
          <AdminPanel onClose={() => setShowAdminPanel(false)} />
        )}
      </AnimatePresence>

      {/* A/B Testing Modal */}
      <AnimatePresence>
        {showABTesting && (
          <ABTestingPanel onClose={() => setShowABTesting(false)} />
        )}
      </AnimatePresence>
    </>
  );
};

// Accessibility Toggle Component
const AccessibilityToggle: React.FC<{
  icon: React.ReactNode;
  label: string;
  description: string;
  isActive: boolean;
  onToggle: () => void;
}> = ({ icon, label, description, isActive, onToggle }) => (
  <button
    onClick={onToggle}
    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
      isActive
        ? 'bg-sky-500/20 border border-sky-500/50'
        : 'bg-white/5 border border-transparent hover:bg-white/10'
    }`}
  >
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
      isActive ? 'bg-sky-500 text-white' : 'bg-white/10 text-white/60'
    }`}>
      {icon}
    </div>
    <div className="flex-1 text-left">
      <p className="text-sm font-medium text-white">{label}</p>
      <p className="text-xs text-white/50">{description}</p>
    </div>
    <div className={`w-10 h-6 rounded-full p-1 transition-all ${
      isActive ? 'bg-sky-500' : 'bg-white/20'
    }`}>
      <motion.div
        className="w-4 h-4 rounded-full bg-white"
        animate={{ x: isActive ? 16 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </div>
  </button>
);
