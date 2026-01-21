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
  Mouse,
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

  const btn = "p-2.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-white/50 hover:text-white hover:bg-black/60 transition-all active:scale-95";

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 p-1 rounded-xl bg-black/30 backdrop-blur-md border border-white/10"
      >
        <button onClick={previousImage} className={btn}>
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => setAutoRotation(!isAutoRotating)}
          className="p-2.5 rounded-lg bg-white text-black hover:bg-white/90 transition-all active:scale-95"
        >
          {isAutoRotating ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button onClick={nextImage} className={btn}>
          <ChevronRight size={18} />
        </button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed bottom-6 right-4 z-40 flex flex-col gap-1 p-1 rounded-xl bg-black/30 backdrop-blur-md border border-white/10"
      >
        <button onClick={() => zoomCamera('in')} className={btn}><ZoomIn size={16} /></button>
        <button onClick={() => zoomCamera('out')} className={btn}><ZoomOut size={16} /></button>
        <div className="h-px bg-white/10 my-0.5" />
        <button onClick={toggleFullscreen} className={btn}>
          {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed bottom-6 left-4 z-40">
        <button onClick={() => setShowInfo(true)} className={btn}><Info size={16} /></button>
      </motion.div>

      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            onClick={() => setShowInfo(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-[#141414] border border-white/10 rounded-xl p-5 max-w-xs w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">Controls</h3>
                <button onClick={() => setShowInfo(false)} className="p-1 rounded hover:bg-white/10 text-white/50">
                  <X size={16} />
                </button>
              </div>
              <ul className="space-y-2.5 text-xs text-white/60">
                <li className="flex items-center gap-3">
                  <Mouse size={14} className="text-white/40" />
                  <span>Drag to look around</span>
                </li>
                <li className="flex items-center gap-3">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono">Scroll</kbd>
                  <span>Zoom in/out</span>
                </li>
                <li className="flex items-center gap-3">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono">Space</kbd>
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
