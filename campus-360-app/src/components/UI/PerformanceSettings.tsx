import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Zap, Gauge, Monitor, Smartphone, Check } from 'lucide-react';
import { usePerformanceStore, type PerformanceMode } from '../../hooks/usePerformanceStore';

const QUALITY_OPTIONS: {
  mode: PerformanceMode;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    mode: 'auto',
    label: 'Auto',
    description: 'Automatically adjusts based on device',
    icon: <Zap size={18} />,
  },
  {
    mode: 'low',
    label: 'Performance',
    description: 'Lower quality, smoother experience',
    icon: <Smartphone size={18} />,
  },
  {
    mode: 'medium',
    label: 'Balanced',
    description: 'Good balance of quality and speed',
    icon: <Gauge size={18} />,
  },
  {
    mode: 'high',
    label: 'Quality',
    description: 'Best visuals, may affect performance',
    icon: <Monitor size={18} />,
  },
];

export const PerformanceSettings: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { mode, setMode, toggleFPSCounter, showFPSCounter, settings } = usePerformanceStore();

  // Listen for close-all-overlays event
  useEffect(() => {
    const handleClose = () => setIsOpen(false);
    window.addEventListener('close-all-overlays', handleClose);
    return () => window.removeEventListener('close-all-overlays', handleClose);
  }, []);

  return (
    <>
      {/* Settings Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white/70 hover:text-white hover:bg-black/60 transition-all group"
        title="Performance Settings"
      >
        <Settings size={20} className="group-hover:rotate-90 transition-transform duration-300" />
      </motion.button>

      {/* Settings Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-sky-500/20 rounded-lg">
                    <Settings size={20} className="text-sky-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Performance</h2>
                    <p className="text-xs text-white/50">Optimize for your device</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Quality Options */}
              <div className="p-4 space-y-2">
                <p className="text-sm text-white/60 mb-3">Graphics Quality</p>
                {QUALITY_OPTIONS.map((option) => (
                  <button
                    key={option.mode}
                    onClick={() => setMode(option.mode)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                      mode === option.mode
                        ? 'bg-sky-500/20 border-2 border-sky-500/50'
                        : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        mode === option.mode
                          ? 'bg-sky-500/30 text-sky-400'
                          : 'bg-white/10 text-white/60'
                      }`}
                    >
                      {option.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{option.label}</span>
                        {mode === option.mode && <Check size={16} className="text-sky-400" />}
                      </div>
                      <p className="text-sm text-white/50">{option.description}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Current Settings Display */}
              <div className="px-6 py-4 border-t border-white/10 bg-white/5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-white/60">Current Settings</span>
                  <span className="text-xs text-white/40 capitalize">
                    {settings.textureQuality} quality
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex justify-between bg-black/20 rounded-lg px-3 py-2">
                    <span className="text-white/50">Geometry</span>
                    <span className="text-white/80">
                      {settings.sphereSegments.width}×{settings.sphereSegments.height}
                    </span>
                  </div>
                  <div className="flex justify-between bg-black/20 rounded-lg px-3 py-2">
                    <span className="text-white/50">Preload</span>
                    <span className="text-white/80">{settings.preloadCount} images</span>
                  </div>
                  <div className="flex justify-between bg-black/20 rounded-lg px-3 py-2">
                    <span className="text-white/50">Effects</span>
                    <span className="text-white/80">
                      {settings.enableTransitionEffects ? 'On' : 'Off'}
                    </span>
                  </div>
                  <div className="flex justify-between bg-black/20 rounded-lg px-3 py-2">
                    <span className="text-white/50">Target FPS</span>
                    <span className="text-white/80">{settings.targetFPS}</span>
                  </div>
                </div>
              </div>

              {/* Developer Options */}
              <div className="px-6 py-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-white/80">Show FPS Counter</span>
                    <p className="text-xs text-white/40">Display performance metrics</p>
                  </div>
                  <button
                    onClick={toggleFPSCounter}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      showFPSCounter ? 'bg-sky-500' : 'bg-white/20'
                    }`}
                  >
                    <motion.div
                      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                      animate={{ left: showFPSCounter ? '26px' : '4px' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PerformanceSettings;
