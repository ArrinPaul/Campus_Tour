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
  MapPin,
} from 'lucide-react';
import { useTourState } from '../../hooks/useTourState';
import { motion, AnimatePresence } from 'framer-motion';
import type { Block, Lab } from '../../hooks/useTourDataStore';

export const ArrowControls = () => {
  const {
    zoomCamera,
    isAutoRotating,
    setAutoRotation,
    nextImage,
    previousImage,
    manifest,
    currentBlockId,
    currentImageId,
    setBlock,
    setImage,
    setIdle,
  } = useTourState();
  const [showInfo, setShowInfo] = useState(false);
  const [showLocations, setShowLocations] = useState(false);
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

  const currentBlock: Block | undefined = manifest?.blocks?.find((b: Block) => b.id === currentBlockId);
  const currentIndex = currentBlock?.labs?.findIndex((l: Lab) => l.id === currentImageId) ?? 0;
  const totalViews = currentBlock?.labs?.length ?? 0;

  const handleBlockClick = (blockId: string) => {
    const block = manifest?.blocks?.find((b: Block) => b.id === blockId);
    setBlock(blockId);
    if (block?.labs?.length > 0) {
      setImage(block.labs[0].id);
    }
    setShowLocations(false);
    setIdle(false);
  };

  const btn = "p-3 rounded-xl bg-white/10 backdrop-blur-md text-white/70 hover:text-white hover:bg-white/20 transition-all active:scale-95";

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 p-2 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/10"
      >
        <button onClick={() => setShowLocations(true)} className={btn}>
          <MapPin size={20} />
        </button>
        
        <div className="w-px h-8 bg-white/10" />
        
        <button onClick={previousImage} className={btn}>
          <ChevronLeft size={20} />
        </button>
        
        <button
          onClick={() => setAutoRotation(!isAutoRotating)}
          className="p-3 rounded-xl bg-white text-black hover:bg-white/90 transition-all active:scale-95"
        >
          {isAutoRotating ? <Pause size={20} /> : <Play size={20} />}
        </button>
        
        <button onClick={nextImage} className={btn}>
          <ChevronRight size={20} />
        </button>
        
        <div className="w-px h-8 bg-white/10" />
        
        <button onClick={() => zoomCamera('in')} className={btn}>
          <ZoomIn size={20} />
        </button>
        <button onClick={() => zoomCamera('out')} className={btn}>
          <ZoomOut size={20} />
        </button>
        
        <div className="w-px h-8 bg-white/10" />
        
        <button onClick={toggleFullscreen} className={btn}>
          {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>
        <button onClick={() => setShowInfo(true)} className={btn}>
          <Info size={20} />
        </button>
      </motion.div>

      {totalViews > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-white/60 text-xs"
        >
          {currentIndex + 1} / {totalViews}
        </motion.div>
      )}

      <AnimatePresence>
        {showLocations && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-end justify-center z-50 pb-28"
            onClick={() => setShowLocations(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-4 max-w-md w-full mx-4 max-h-[60vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">Locations</h3>
                <button onClick={() => setShowLocations(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/50">
                  <X size={18} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {manifest?.blocks?.map((block: Block) => (
                  <button
                    key={block.id}
                    onClick={() => handleBlockClick(block.id)}
                    className={`text-left p-3 rounded-xl transition-all ${
                      currentBlockId === block.id
                        ? 'bg-white text-black'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="text-sm font-medium">{block.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            onClick={() => setShowInfo(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-5 max-w-xs w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">Controls</h3>
                <button onClick={() => setShowInfo(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/50">
                  <X size={18} />
                </button>
              </div>
              <ul className="space-y-3 text-sm text-white/60">
                <li className="flex items-center gap-3">
                  <Mouse size={16} className="text-white/40" />
                  <span>Drag to look around</span>
                </li>
                <li className="flex items-center gap-3">
                  <kbd className="px-2 py-1 rounded-lg bg-white/10 text-xs font-mono">Scroll</kbd>
                  <span>Zoom in/out</span>
                </li>
                <li className="flex items-center gap-3">
                  <kbd className="px-2 py-1 rounded-lg bg-white/10 text-xs font-mono">Space</kbd>
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
