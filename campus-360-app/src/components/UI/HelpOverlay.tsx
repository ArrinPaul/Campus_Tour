import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mouse, Smartphone, Move, ZoomIn } from 'lucide-react';
import { useTourState } from '../../hooks/useTourState';

export const HelpOverlay: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isTourStarted } = useTourState();

  // Show help automatically on first visit after tour starts
  useEffect(() => {
    if (isTourStarted) {
      const hasSeenHelp = localStorage.getItem('hasSeenHelp');
      if (!hasSeenHelp) {
        setIsOpen(true);
        localStorage.setItem('hasSeenHelp', 'true');
      }
    }
  }, [isTourStarted]);

  // Listen for custom event to open help manually
  useEffect(() => {
    const handleOpenHelp = () => setIsOpen(true);
    window.addEventListener('open-help-modal', handleOpenHelp);
    return () => window.removeEventListener('open-help-modal', handleOpenHelp);
  }, []);

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
            className="bg-zinc-900 border border-white/10 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
              <h2 className="text-xl font-bold text-white">How to Explore</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Desktop Controls */}
              <div className="space-y-6">
                <h3 className="text-emerald-400 font-semibold uppercase tracking-wider text-sm flex items-center gap-2">
                  <Mouse size={16} /> Desktop
                </h3>
                <div className="space-y-4">
                  <ControlItem 
                    icon={<Move size={20} />}
                    title="Look Around"
                    text="Click and drag your mouse to rotate the view 360°."
                  />
                  <ControlItem 
                    icon={<ZoomIn size={20} />}
                    title="Zoom"
                    text="Use your mouse wheel to zoom in and out."
                  />
                  <ControlItem 
                    icon={<span className="font-bold text-lg px-1">W/A/S/D</span>}
                    title="Move"
                    text="Click arrows or use keyboard keys to change scenes."
                  />
                </div>
              </div>

              {/* Mobile Controls */}
              <div className="space-y-6">
                <h3 className="text-emerald-400 font-semibold uppercase tracking-wider text-sm flex items-center gap-2">
                  <Smartphone size={16} /> Mobile
                </h3>
                <div className="space-y-4">
                  <ControlItem 
                    icon={<Move size={20} />}
                    title="Touch & Drag"
                    text="Swipe with one finger to look around."
                  />
                  <ControlItem 
                    icon={<Smartphone size={20} className="animate-pulse" />}
                    title="Gyro Mode"
                    text="Tap the phone icon to look around by moving your device."
                  />
                  <ControlItem 
                    icon={<ZoomIn size={20} />}
                    title="Pinch to Zoom"
                    text="Use two fingers to zoom in and out."
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 bg-white/5 text-center">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-8 rounded-full transition-all"
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

const ControlItem = ({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) => (
  <div className="flex gap-4">
    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
      {icon}
    </div>
    <div>
      <h4 className="text-white font-medium mb-1">{title}</h4>
      <p className="text-white/60 text-sm leading-relaxed">{text}</p>
    </div>
  </div>
);
