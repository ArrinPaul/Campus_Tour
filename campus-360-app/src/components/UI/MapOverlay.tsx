import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Navigation } from 'lucide-react';
import { useTourState } from '../../hooks/useTourState';

export const MapOverlay: React.FC = () => {
  const { manifest, currentBlockId, setBlock, isMapOpen, setMapOpen } = useTourState();

  if (!manifest) return null;

  // Larger viewBox for better spacing between elements
  const viewBox = '0 0 1200 600';
  
  // Helper function to calculate label position to the RIGHT of block
  const calculateLabelPosition = (block: any) => {
    if (!block.svgAnchor) return { x: 0, y: 0 };
    
    // Position label to the right of the block
    return {
      x: block.svgAnchor.x + 100, // 100px to the right
      y: block.svgAnchor.y
    };
  };

  return (
    <>
      {/* Map Modal */}
      <AnimatePresence>
        {isMapOpen && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMapOpen(false)}
          >
            <motion.div
              className="relative w-full max-w-7xl max-h-[90vh] flex flex-col bg-[#0d1829]/95 rounded-2xl border border-emerald-500/20 overflow-hidden shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-emerald-500/20 flex justify-between items-center bg-gradient-to-r from-[#0d1829] to-[#1e293b]">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <Navigation size={22} className="text-emerald-400" />
                  Campus Navigation Map
                </h2>
                <button
                  onClick={() => setMapOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="relative w-full h-full bg-[#0a0e1a] p-12 overflow-auto flex-1 flex items-center justify-center">
                <svg
                  viewBox={viewBox}
                  className="w-full h-full max-h-[75vh]"
                  style={{ filter: 'drop-shadow(0 4px 20px rgba(16, 185, 129, 0.2))' }}
                >
                  {/* Background */}
                  <defs>
                    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0f1729" stopOpacity="1" />
                      <stop offset="100%" stopColor="#1a2332" stopOpacity="1" />
                    </linearGradient>
                  </defs>
                  <rect width="1200" height="600" fill="url(#bgGrad)" />

                  {/* Blocks - Original design with proper label positioning */}
                  {manifest.blocks.map((block) => {
                    const isActive = currentBlockId === block.id;
                    
                    // Calculate label position to the right
                    const labelPos = calculateLabelPosition(block);
                    
                    return (
                      <g
                        key={block.id}
                        onClick={() => {
                          setBlock(block.id);
                          setMapOpen(false);
                        }}
                        className="cursor-pointer group"
                      >
                        {/* Building Block - Original SVG Path */}
                        <motion.path
                          d={block.svgPath}
                          fill={isActive ? 'rgba(16, 185, 129, 0.35)' : 'rgba(30, 58, 77, 0.4)'}
                          stroke={isActive ? '#10b981' : '#2d5a6f'}
                          strokeWidth={isActive ? 3.5 : 2.5}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ 
                            fill: isActive ? 'rgba(16, 185, 129, 0.5)' : 'rgba(42, 74, 106, 0.6)',
                            strokeWidth: 4,
                            scale: 1.02
                          }}
                          transition={{ duration: 0.2 }}
                        />

                        {/* Label - Positioned to the RIGHT of the box */}
                        {block.svgAnchor && (
                          <text
                            x={labelPos.x}
                            y={labelPos.y}
                            fill={isActive ? '#10b981' : '#94a3b8'}
                            fontSize="16"
                            fontWeight={isActive ? '700' : '600'}
                            textAnchor="start"
                            dominantBaseline="middle"
                            className="pointer-events-none select-none transition-all"
                            style={{
                              filter: isActive 
                                ? 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.7))' 
                                : 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.6))',
                              letterSpacing: '0.5px'
                            }}
                          >
                            {block.short || block.label}
                          </text>
                        )}

                        {/* Active indicator - small glow in center of block */}
                        {isActive && block.svgAnchor && (
                          <motion.circle
                            cx={block.svgAnchor.x}
                            cy={block.svgAnchor.y}
                            r="5"
                            fill="#10b981"
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [1, 0.3, 1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            }}
                          />
                        )}
                      </g>
                    );
                  })}
                </svg>

                {/* Instructions */}
                <div className="absolute bottom-8 left-8 text-xs text-emerald-400/60 bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm border border-emerald-500/20">
                  Click any building to navigate
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
