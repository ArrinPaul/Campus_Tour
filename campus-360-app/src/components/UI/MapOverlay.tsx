import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin } from 'lucide-react';
import { useTourState } from '../../hooks/useTourState';
import { sortBlocks } from '../../utils/blockOrder';

// Clean campus grid layout
interface BuildingLayout {
  label: string;
  icon?: string;
}

// Campus layout mapping
const CAMPUS_LAYOUT: Record<string, BuildingLayout> = {
  gatetologo: { label: 'Main Gate' },
  block1: { label: 'Block 1' },
  block2: { label: 'Block 2' },
  block3: { label: 'Block 3' },
  block4: { label: 'Block 4' },
  block5: { label: 'Block 5' },
  block6: { label: 'Block 6' },
  devdan: { label: 'Devdan' },
  archi: { label: 'Architecture' },
};

const HIDDEN_BLOCKS = ['outside', 'out'];

export const MapOverlay: React.FC = () => {
  const { manifest, currentBlockId, setBlock, isMapOpen, setMapOpen } = useTourState();

  const processedBlocks = useMemo(() => {
    if (!manifest) return [];

    const filtered = manifest.blocks.filter((block) => !HIDDEN_BLOCKS.includes(block.id));
    const sorted = sortBlocks(filtered);
    
    return sorted.map((block) => {
      const layout = CAMPUS_LAYOUT[block.id];
      return {
        ...block,
        displayLabel: layout?.label || block.name || block.id,
      };
    });
  }, [manifest]);

  if (!manifest) return null;

  return (
    <AnimatePresence>
      {isMapOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setMapOpen(false)}
        >
          <motion.div
            className="relative w-full max-w-sm sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-2 xs:mx-3 sm:mx-4 md:mx-auto bg-zinc-900/95 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/10 overflow-hidden shadow-2xl max-h-[80vh] sm:max-h-[85vh] overflow-y-auto"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-3 xs:px-4 sm:px-5 md:px-6 py-2.5 xs:py-3 sm:py-4 border-b border-white/10 flex justify-between items-center sticky top-0 bg-zinc-900/95 backdrop-blur-xl z-10">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-sky-500/20 flex items-center justify-center">
                  <MapPin className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-sky-400" />
                </div>
                <div>
                  <h2 className="text-sm xs:text-base sm:text-lg font-semibold text-white">Campus Map</h2>
                  <p className="text-[10px] xs:text-xs sm:text-sm text-white/50">Tap a building to teleport</p>
                </div>
              </div>
              <button
                onClick={() => setMapOpen(false)}
                className="p-1 xs:p-1.5 sm:p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors"
              >
                <X className="w-4 h-4 xs:w-[18px] xs:h-[18px] sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Map Grid */}
            <div className="p-3 xs:p-4 sm:p-5 md:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 xs:gap-2 sm:gap-3">
                {processedBlocks.map((block, index) => {
                  const isActive = currentBlockId === block.id;

                  return (
                    <motion.button
                      key={block.id}
                      onClick={() => {
                        setBlock(block.id);
                        setMapOpen(false);
                      }}
                      className={`relative p-4 rounded-xl border-2 transition-all text-left group ${
                        isActive
                          ? 'bg-sky-500/20 border-sky-500 shadow-lg shadow-sky-500/20'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Building Icon */}
                      <div
                        className={`w-10 h-10 rounded-lg mb-2 flex items-center justify-center transition-colors ${
                          isActive
                            ? 'bg-sky-500 text-white'
                            : 'bg-white/10 text-white/50 group-hover:bg-white/15 group-hover:text-white/70'
                        }`}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className="w-5 h-5"
                        >
                          <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9v.01M9 12v.01M9 15v.01M9 18v.01" />
                        </svg>
                      </div>

                      {/* Label */}
                      <h3
                        className={`text-sm font-medium truncate ${
                          isActive ? 'text-sky-400' : 'text-white/70 group-hover:text-white'
                        }`}
                      >
                        {block.displayLabel}
                      </h3>

                      {/* Active Pulse */}
                      {isActive && (
                        <motion.div
                          className="absolute top-3 right-3 w-2 h-2 rounded-full bg-sky-400"
                          animate={{ 
                            scale: [1, 1.3, 1],
                            opacity: [1, 0.7, 1]
                          }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-center gap-6 text-xs text-white/40">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm bg-sky-500" />
                  <span>You are here</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm bg-white/20" />
                  <span>Available</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MapOverlay;
