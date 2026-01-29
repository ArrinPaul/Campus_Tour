import React, { useState } from 'react';
import { ChevronRight, MapPin, Maximize, Minimize, HelpCircle, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTourState } from '../../hooks/useTourState';
import type { Block } from '../../hooks/useTourDataStore';
import { X } from 'lucide-react';
import { SharePanel } from './SharePanel';
import { sortBlocks } from '../../utils/blockOrder';

export const TopBar: React.FC = () => {
  const { manifest, currentBlockId, currentImageId, setBlock, setImage, setIdle } = useTourState();
  const [showLocations, setShowLocations] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSharePanel, setShowSharePanel] = useState(false);

  const sortedBlocks = React.useMemo(() => {
    return sortBlocks(manifest?.blocks || []);
  }, [manifest?.blocks]);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    } else {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    }
  };

  const currentBlock = manifest?.blocks?.find((b) => b.id === currentBlockId);
  const currentIndex = currentBlock?.labs?.findIndex((l) => l.id === currentImageId) ?? 0;
  const totalViews = currentBlock?.labs?.length ?? 0;

  const handleBlockClick = (blockId: string) => {
    const block = manifest?.blocks?.find((b) => b.id === blockId);
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
        className="fixed top-3 xs:top-4 sm:top-5 md:top-6 lg:top-8 left-3 xs:left-4 sm:left-5 md:left-6 lg:left-8 z-40 max-w-[50%] xs:max-w-[55%] sm:max-w-[60%] md:max-w-none"
      >
        <h1 className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-white tracking-tight truncate">Campus Virtual Tour</h1>
        <button
          onClick={() => setShowLocations(true)}
          className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 mt-0.5 sm:mt-1 text-white/60 hover:text-white transition-colors group"
        >
          <MapPin className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-sky-400 shrink-0" />
          <span className="text-[10px] xs:text-xs sm:text-sm md:text-base truncate">
            {currentBlock?.name || currentBlock?.label || 'Select Location'}
          </span>
          <ChevronRight
            className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
          />
        </button>
      </motion.div>

      {/* Top Right - View Counter & Actions */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="fixed top-3 xs:top-4 sm:top-5 md:top-6 lg:top-8 right-3 xs:right-4 sm:right-5 md:right-6 lg:right-8 z-40 flex items-center gap-1 xs:gap-1.5 sm:gap-2 md:gap-3"
      >
        {totalViews > 1 && (
          <div className="hidden sm:block px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10">
            <span className="text-xs sm:text-sm md:text-base text-white/80 font-medium tabular-nums">
              {currentIndex + 1} / {totalViews}
            </span>
          </div>
        )}
        <button
          onClick={() => setShowSharePanel(true)}
          className="p-1.5 xs:p-2 sm:p-2.5 md:p-3 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-black/50 transition-all"
          title="Share this view"
        >
          <Share2 className="w-4 h-4 xs:w-[16px] xs:h-[16px] sm:w-[18px] sm:h-[18px] md:w-5 md:h-5" />
        </button>
        <button
          onClick={toggleFullscreen}
          className="hidden sm:flex p-2 sm:p-2.5 md:p-3 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-black/50 transition-all"
        >
          {isFullscreen ? <Minimize className="w-4 h-4 sm:w-[18px] sm:h-[18px] md:w-5 md:h-5" /> : <Maximize className="w-4 h-4 sm:w-[18px] sm:h-[18px] md:w-5 md:h-5" />}
        </button>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('open-help-modal'))}
          className="p-1.5 xs:p-2 sm:p-2.5 md:p-3 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-black/50 transition-all"
        >
          <HelpCircle className="w-4 h-4 xs:w-[16px] xs:h-[16px] sm:w-[18px] sm:h-[18px] md:w-5 md:h-5" />
        </button>
      </motion.div>

      {/* Share Panel */}
      <SharePanel isOpen={showSharePanel} onClose={() => setShowSharePanel(false)} />

      {/* Locations Modal */}
      <AnimatePresence>
        {showLocations && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
            onClick={() => setShowLocations(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-t-2xl sm:rounded-2xl p-4 sm:p-6 w-full sm:max-w-md sm:mx-4 shadow-2xl max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-white">Explore Campus</h2>
                  <p className="text-xs sm:text-sm text-white/50 mt-0.5">Select a location to visit</p>
                </div>
                <button
                  onClick={() => setShowLocations(false)}
                  className="p-1.5 sm:p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-all"
                >
                  <X size={18} className="sm:w-5 sm:h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-4 max-h-[55vh] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
                {sortedBlocks.map((block: Block) => (
                  <button
                    key={block.id}
                    onClick={() => handleBlockClick(block.id)}
                    className={`relative p-3 sm:p-4 rounded-xl text-left transition-all ${
                      currentBlockId === block.id
                        ? 'bg-sky-500/20 border-2 border-sky-500/50 text-white'
                        : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <MapPin
                      size={14}
                      className={`sm:w-4 sm:h-4 ${currentBlockId === block.id ? 'text-sky-400' : 'text-white/40'}`}
                    />
                    <span className="block mt-1.5 sm:mt-2 text-xs sm:text-sm font-medium line-clamp-2">
                      {block.name || block.label}
                    </span>
                    {currentBlockId === block.id && (
                      <span className="absolute top-2 right-2 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-sky-400" />
                    )}
                  </button>
                ))}
              </div>
              
              {/* Mobile swipe indicator */}
              <div className="sm:hidden pt-4 flex justify-center">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
