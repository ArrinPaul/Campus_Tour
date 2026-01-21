import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Info,
  X,
} from 'lucide-react';
import { useTourState } from '../../hooks/useTourState';
import { motion, AnimatePresence } from 'framer-motion';

export const ArrowControls = () => {
  const {
    zoomCamera,
    isAutoRotating,
    setAutoRotation,
    nextImage,
    previousImage,
  } = useTourState();
  const [showInfo, setShowInfo] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    } else {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    }
  };

  const btnBase = "p-3 rounded-xl bg-slate-900/80 backdrop-blur-xl border border-white/10 text-white/80 hover:text-white hover:bg-slate-800/90 hover:border-white/20 transition-all duration-200 active:scale-95";
  const btnPrimary = "p-3.5 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 active:scale-95 shadow-lg shadow-blue-500/25";

  return (
    <>
      {/* Bottom Center - Main Controls */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 p-2 rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-white/10"
      >
        {/* Previous */}
        <button onClick={previousImage} className={btnBase} aria-label="Previous view">
          <ChevronLeft size={20} />
        </button>

        {/* Play/Pause */}
        <button
          onClick={() => setAutoRotation(!isAutoRotating)}
          className={btnPrimary}
          aria-label={isAutoRotating ? 'Pause auto-rotate' : 'Start auto-rotate'}
        >
          {isAutoRotating ? <Pause size={20} /> : <Play size={20} />}
        </button>

        {/* Next */}
        <button onClick={nextImage} className={btnBase} aria-label="Next view">
          <ChevronRight size={20} />
        </button>
      </motion.div>

      {/* Bottom Right - Utility Controls */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="fixed bottom-6 right-4 z-40 flex flex-col gap-2"
      >
        <button onClick={() => zoomCamera('in')} className={btnBase} aria-label="Zoom in">
          <ZoomIn size={18} />
        </button>
        <button onClick={() => zoomCamera('out')} className={btnBase} aria-label="Zoom out">
          <ZoomOut size={18} />
        </button>
        <button onClick={toggleFullscreen} className={btnBase} aria-label="Toggle fullscreen">
          {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
        </button>
      </motion.div>

      {/* Bottom Left - Info Button */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="fixed bottom-6 left-4 z-40"
      >
        <button 
          onClick={() => setShowInfo(true)} 
          className={btnBase}
          aria-label="Show controls info"
        >
          <Info size={18} />
        </button>
      </motion.div>

      {/* Info Modal */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowInfo(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 max-w-sm w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Controls</h3>
                <button 
                  onClick={() => setShowInfo(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <ul className="space-y-3 text-sm text-white/70">
                <li className="flex items-center gap-3">
                  <kbd className="px-2 py-1 rounded bg-white/10 text-xs font-mono">Drag</kbd>
                  <span>Look around</span>
                </li>
                <li className="flex items-center gap-3">
                  <kbd className="px-2 py-1 rounded bg-white/10 text-xs font-mono">Scroll</kbd>
                  <span>Zoom in/out</span>
                </li>
                <li className="flex items-center gap-3">
                  <kbd className="px-2 py-1 rounded bg-white/10 text-xs font-mono">← →</kbd>
                  <span>Navigate views</span>
                </li>
                <li className="flex items-center gap-3">
                  <kbd className="px-2 py-1 rounded bg-white/10 text-xs font-mono">Space</kbd>
                  <span>Toggle auto-rotate</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
