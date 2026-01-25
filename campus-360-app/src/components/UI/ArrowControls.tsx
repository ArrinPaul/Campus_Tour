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
  HelpCircle,
  X,
  MapPin,
  Layers,
  Smartphone,
  Glasses,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useTourState } from '../../hooks/useTourState';
import { xrStore } from '../../utils/xr';
import { motion, AnimatePresence } from 'framer-motion';
import type { Block, Lab } from '../../hooks/useTourDataStore';

export const ArrowControls = () => {
  const {
    zoomCamera,
    isAutoRotating,
    setAutoRotation,
    isGyroEnabled,
    setGyroEnabled,
    isAudioEnabled,
    setAudioEnabled,
    nextImage,
    previousImage,
    manifest,
    currentBlockId,
    currentImageId,
    setBlock,
    setImage,
    setIdle,
  } = useTourState();
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

  const currentBlock: Block | undefined = manifest?.blocks?.find(
    (b: Block) => b.id === currentBlockId
  );
  const currentIndex = currentBlock?.labs?.findIndex((l: Lab) => l.id === currentImageId) ?? 0;
  const totalViews = currentBlock?.labs?.length ?? 0;

  const handleBlockClick = (blockId: string) => {
    const block = manifest?.blocks?.find((b: Block) => b.id === blockId);
    setBlock(blockId);
    if (block?.labs && block.labs.length > 0) {
      setImage(block.labs[0].id);
    }
    setShowLocations(false);
    setIdle(false);
  };

  return (
    <>
      {/* Top Left - Title & Location */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="fixed top-0 left-0 p-6 z-40"
      >
        <h1 className="text-xl font-semibold text-white tracking-tight">Campus Virtual Tour</h1>
        <button
          onClick={() => setShowLocations(true)}
          className="flex items-center gap-2 mt-1 text-white/60 hover:text-white transition-colors group"
        >
          <MapPin size={14} className="text-blue-400" />
          <span className="text-sm">{currentBlock?.name || 'Select Location'}</span>
          <ChevronRight
            size={14}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </button>
      </motion.div>

      {/* Top Right - View Counter & Actions */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="fixed top-0 right-0 p-6 z-40 flex items-center gap-3"
      >
        {totalViews > 1 && (
          <div className="px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10">
            <span className="text-sm text-white/80 font-medium tabular-nums">
              {currentIndex + 1} / {totalViews}
            </span>
          </div>
        )}
        <button
          onClick={toggleFullscreen}
          className="p-2.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-black/50 transition-all"
        >
          {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
        </button>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('open-help-modal'))}
          className="p-2.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-black/50 transition-all"
        >
          <HelpCircle size={18} />
        </button>
      </motion.div>

      {/* Left Arrow - Previous */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        whileHover={{ scale: 1.1, x: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={previousImage}
        className="fixed left-6 top-1/2 -translate-y-1/2 z-40 p-4 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-black/50 transition-all shadow-lg"
      >
        <ChevronLeft size={24} />
      </motion.button>

      {/* Right Arrow - Next */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        whileHover={{ scale: 1.1, x: 2 }}
        whileTap={{ scale: 0.95 }}
        onClick={nextImage}
        className="fixed right-6 top-1/2 -translate-y-1/2 z-40 p-4 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-black/50 transition-all shadow-lg"
      >
        <ChevronRight size={24} />
      </motion.button>

      {/* Bottom Center - Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
      >
        <div className="flex items-center gap-2 p-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10">
          <button
            onClick={() => setShowLocations(true)}
            className="p-3 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
            title="Locations"
          >
            <Layers size={20} />
          </button>

          <div className="w-px h-6 bg-white/10" />

          <button
            onClick={() => setGyroEnabled(!isGyroEnabled)}
            className={`p-3 rounded-full transition-all ${
              isGyroEnabled ? 'bg-white text-black' : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
            title="Gyroscope Control"
          >
            <Smartphone size={20} />
          </button>

          <button
            onClick={() => xrStore.enterVR()}
            className="p-3 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
            title="Enter VR Mode"
          >
            <Glasses size={20} />
          </button>

          <button
            onClick={() => setAudioEnabled(!isAudioEnabled)}
            className={`p-3 rounded-full transition-all ${
              isAudioEnabled ? 'bg-white text-black' : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
            title="Toggle Audio"
          >
            {isAudioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>

          <div className="w-px h-6 bg-white/10" />

          <button
            onClick={() => zoomCamera('out')}
            className="p-3 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
            title="Zoom Out"
          >
            <ZoomOut size={20} />
          </button>

          <button
            onClick={() => setAutoRotation(!isAutoRotating)}
            className="p-4 rounded-full bg-white text-black hover:bg-white/90 transition-all shadow-lg"
            title={isAutoRotating ? 'Pause' : 'Play'}
          >
            {isAutoRotating ? (
              <Pause size={22} strokeWidth={2.5} />
            ) : (
              <Play size={22} strokeWidth={2.5} className="ml-0.5" />
            )}
          </button>

          <button
            onClick={() => zoomCamera('in')}
            className="p-3 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
            title="Zoom In"
          >
            <ZoomIn size={20} />
          </button>
        </div>
      </motion.div>

      {/* Locations Modal */}
      <AnimatePresence>
        {showLocations && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowLocations(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-white">Explore Campus</h2>
                  <p className="text-sm text-white/50 mt-0.5">Select a location to visit</p>
                </div>
                <button
                  onClick={() => setShowLocations(false)}
                  className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
                {manifest?.blocks?.map((block: Block) => (
                  <button
                    key={block.id}
                    onClick={() => handleBlockClick(block.id)}
                    className={`relative p-4 rounded-xl text-left transition-all ${
                      currentBlockId === block.id
                        ? 'bg-blue-500/20 border-2 border-blue-500/50 text-white'
                        : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <MapPin
                      size={16}
                      className={currentBlockId === block.id ? 'text-blue-400' : 'text-white/40'}
                    />
                    <span className="block mt-2 text-sm font-medium">{block.name}</span>
                    {currentBlockId === block.id && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-400" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

