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
  Mouse,
  MapPin,
  RotateCcw,
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
  const currentImage: Lab | undefined = currentBlock?.labs?.find((l: Lab) => l.id === currentImageId);
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

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="fixed top-6 left-6 z-40"
      >
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/[0.08] shadow-2xl">
          <MapPin size={14} className="text-white/50" />
          <div className="flex flex-col">
            <span className="text-[11px] text-white/40 uppercase tracking-wider font-medium">
              {currentBlock?.name || 'Campus'}
            </span>
            <span className="text-sm text-white font-medium -mt-0.5">
              {currentImage?.name || 'Virtual Tour'}
            </span>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40"
      >
        <div className="flex items-center gap-1.5 p-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/[0.08] shadow-2xl">
          <ControlButton 
            onClick={() => setShowLocations(true)} 
            tooltip="Locations"
            icon={<MapPin size={18} />}
          />
          
          <Divider />
          
          <ControlButton 
            onClick={previousImage} 
            tooltip="Previous"
            icon={<ChevronLeft size={18} />}
          />
          
          <button
            onClick={() => setAutoRotation(!isAutoRotating)}
            className="relative group flex items-center justify-center w-12 h-12 rounded-full bg-white text-black hover:bg-white/90 transition-all duration-200 active:scale-95 shadow-lg shadow-white/20"
          >
            {isAutoRotating ? <Pause size={18} strokeWidth={2.5} /> : <Play size={18} strokeWidth={2.5} className="ml-0.5" />}
          </button>
          
          <ControlButton 
            onClick={nextImage} 
            tooltip="Next"
            icon={<ChevronRight size={18} />}
          />
          
          <Divider />
          
          <ControlButton 
            onClick={() => zoomCamera('out')} 
            tooltip="Zoom Out"
            icon={<ZoomOut size={18} />}
          />
          <ControlButton 
            onClick={() => zoomCamera('in')} 
            tooltip="Zoom In"
            icon={<ZoomIn size={18} />}
          />
          
          <Divider />
          
          <ControlButton 
            onClick={toggleFullscreen} 
            tooltip={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            icon={isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          />
          <ControlButton 
            onClick={() => setShowInfo(true)} 
            tooltip="Help"
            icon={<HelpCircle size={18} />}
          />
        </div>

        {totalViews > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-2"
          >
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/[0.08]">
              <RotateCcw size={12} className="text-white/40" />
              <span className="text-xs text-white/70 font-medium tabular-nums">
                {currentIndex + 1} of {totalViews}
              </span>
            </div>
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {showLocations && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center z-50 pb-32"
            onClick={() => setShowLocations(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="bg-[#161616]/95 backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-5 max-w-lg w-full mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-base font-semibold text-white">Explore Locations</h3>
                  <p className="text-xs text-white/40 mt-0.5">Select a location to visit</p>
                </div>
                <button 
                  onClick={() => setShowLocations(false)} 
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/70 transition-all"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {manifest?.blocks?.map((block: Block) => (
                  <button
                    key={block.id}
                    onClick={() => handleBlockClick(block.id)}
                    className={`group relative text-left p-4 rounded-2xl transition-all duration-200 ${
                      currentBlockId === block.id
                        ? 'bg-white text-black shadow-lg shadow-white/10'
                        : 'bg-white/[0.03] text-white/70 hover:bg-white/[0.08] hover:text-white border border-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${currentBlockId === block.id ? 'bg-black/10' : 'bg-white/5'}`}>
                        <MapPin size={14} className={currentBlockId === block.id ? 'text-black/60' : 'text-white/40'} />
                      </div>
                      <span className="text-sm font-medium">{block.name}</span>
                    </div>
                    {currentBlockId === block.id && (
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-green-500" />
                    )}
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
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowInfo(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="bg-[#161616]/95 backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-6 max-w-sm w-full mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-semibold text-white">How to Navigate</h3>
                  <p className="text-xs text-white/40 mt-0.5">Controls & shortcuts</p>
                </div>
                <button 
                  onClick={() => setShowInfo(false)} 
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/70 transition-all"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-4">
                <HelpItem
                  icon={<Mouse size={16} />}
                  title="Look Around"
                  description="Click and drag to explore"
                />
                <HelpItem
                  icon={<span className="text-[10px] font-bold">SCROLL</span>}
                  title="Zoom"
                  description="Use scroll wheel or pinch"
                />
                <HelpItem
                  icon={<span className="text-[10px] font-bold">SPACE</span>}
                  title="Auto-Rotate"
                  description="Toggle automatic rotation"
                />
                <HelpItem
                  icon={<ChevronLeft size={14} />}
                  title="Navigate"
                  description="Use arrows or buttons"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

function ControlButton({ onClick, tooltip, icon }: { onClick: () => void; tooltip: string; icon: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="group relative flex items-center justify-center w-11 h-11 rounded-full bg-white/[0.05] text-white/60 hover:bg-white/[0.12] hover:text-white transition-all duration-200 active:scale-95"
    >
      {icon}
      <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-white text-black text-xs font-medium whitespace-nowrap opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none shadow-lg">
        {tooltip}
      </span>
    </button>
  );
}

function Divider() {
  return <div className="w-px h-6 bg-white/[0.08] mx-1" />;
}

function HelpItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.05] text-white/50">
        {icon}
      </div>
      <div>
        <div className="text-sm font-medium text-white">{title}</div>
        <div className="text-xs text-white/40">{description}</div>
      </div>
    </div>
  );
}
