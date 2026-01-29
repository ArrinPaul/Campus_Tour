import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Monitor, Smartphone, Move, ZoomIn, Keyboard } from 'lucide-react';
import { KEYBOARD_SHORTCUTS } from '../../hooks/useKeyboardShortcuts';

type TabType = 'desktop' | 'mobile' | 'keyboard';

export const HelpOverlay: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('desktop');

  // Show help automatically on first visit
  useEffect(() => {
    const hasSeenHelp = localStorage.getItem('hasSeenHelp');
    if (!hasSeenHelp) {
      setTimeout(() => setIsOpen(true), 2000);
      localStorage.setItem('hasSeenHelp', 'true');
    }
  }, []);

  // Auto-detect device type for initial tab
  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setActiveTab(isMobile ? 'mobile' : 'desktop');
  }, []);

  // Listen for custom event to open help manually
  useEffect(() => {
    const handleOpenHelp = () => setIsOpen(true);
    const handleCloseOverlays = () => setIsOpen(false);
    window.addEventListener('open-help-modal', handleOpenHelp);
    window.addEventListener('close-all-overlays', handleCloseOverlays);
    return () => {
      window.removeEventListener('open-help-modal', handleOpenHelp);
      window.removeEventListener('close-all-overlays', handleCloseOverlays);
    };
  }, []);

  const tabs = [
    { id: 'desktop' as TabType, label: 'Desktop', icon: Monitor },
    { id: 'mobile' as TabType, label: 'Mobile', icon: Smartphone },
    { id: 'keyboard' as TabType, label: 'Shortcuts', icon: Keyboard },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl w-[95%] xs:w-[90%] sm:max-w-md md:max-w-lg shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 xs:p-4 sm:p-5 border-b border-white/10">
              <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-white">How to Explore</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 xs:p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors"
              >
                <X className="w-4 h-4 xs:w-[18px] xs:h-[18px]" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-white/10">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 xs:gap-2 py-2.5 xs:py-3 px-2 xs:px-4 text-xs xs:text-sm font-medium transition-all relative ${
                    activeTab === tab.id
                      ? 'text-sky-400'
                      : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
                  <span>{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-400"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-3 xs:p-4 sm:p-5 min-h-[220px] xs:min-h-[250px] sm:min-h-[280px]">
              <AnimatePresence mode="wait">
                {activeTab === 'desktop' && (
                  <motion.div
                    key="desktop"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-4"
                  >
                    <ControlItem
                      icon={<Move size={18} />}
                      title="Look Around"
                      text="Click and drag your mouse to rotate the view 360°."
                    />
                    <ControlItem
                      icon={<ZoomIn size={18} />}
                      title="Zoom"
                      text="Use your mouse wheel to zoom in and out."
                    />
                    <ControlItem
                      icon={<span className="font-bold text-sm">WASD</span>}
                      title="Navigate"
                      text="Use keyboard keys or click arrows to move between scenes."
                    />
                  </motion.div>
                )}

                {activeTab === 'mobile' && (
                  <motion.div
                    key="mobile"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-4"
                  >
                    <ControlItem
                      icon={<Move size={18} />}
                      title="Touch & Drag"
                      text="Swipe with one finger to look around."
                    />
                    <ControlItem
                      icon={<Smartphone size={18} />}
                      title="Gyro Mode"
                      text="Tap the phone icon to look around by moving your device."
                    />
                    <ControlItem
                      icon={<ZoomIn size={18} />}
                      title="Pinch to Zoom"
                      text="Use two fingers to zoom in and out."
                    />
                  </motion.div>
                )}

                {activeTab === 'keyboard' && (
                  <motion.div
                    key="keyboard"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-2"
                  >
                    {KEYBOARD_SHORTCUTS.map((shortcut, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <span className="text-white/70 text-sm">{shortcut.action}</span>
                        <kbd className="px-2.5 py-1 bg-white/10 border border-white/10 rounded-md text-xs font-mono text-white/90">
                          {shortcut.key}
                        </kbd>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-3 xs:p-4 sm:p-5 border-t border-white/10 bg-white/5">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full bg-sky-500 hover:bg-sky-400 text-white font-medium py-2.5 xs:py-3 rounded-lg xs:rounded-xl text-sm xs:text-base transition-all"
              >
                Start Exploring
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ControlItem = ({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) => (
  <div className="flex gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
    <div className="w-10 h-10 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
      {icon}
    </div>
    <div className="flex-1">
      <h4 className="text-white font-medium text-sm mb-0.5">{title}</h4>
      <p className="text-white/50 text-xs leading-relaxed">{text}</p>
    </div>
  </div>
);

export default HelpOverlay;
