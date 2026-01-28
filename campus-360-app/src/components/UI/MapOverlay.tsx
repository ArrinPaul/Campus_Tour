import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Navigation, MousePointer2 } from 'lucide-react';
import { useTourState } from '../../hooks/useTourState';

export const MapOverlay: React.FC = () => {
  const { manifest, currentBlockId, setBlock, isMapOpen, setMapOpen } = useTourState();

  if (!manifest) return null;

  // Larger viewBox for better spacing between elements
  const viewBox = '0 0 1200 600';

  // Helper function to calculate label position
  const calculateLabelPosition = (block: any) => {
    if (!block.svgAnchor) return { x: 0, y: 0 };

    // Position label slightly to the right of the anchor
    return {
      x: block.svgAnchor.x + 40,
      y: block.svgAnchor.y,
    };
  };

  return (
    <>
      {/* Map Modal */}
      <AnimatePresence>
        {isMapOpen && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMapOpen(false)}
          >
            <motion.div
              className="relative w-full max-w-[95vw] h-[90vh] flex flex-col bg-[#0d1829] rounded-2xl border border-emerald-500/20 overflow-hidden shadow-2xl"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-emerald-500/20 flex justify-between items-center bg-[#152035]">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    <Navigation size={22} className="text-emerald-400" />
                    Campus Navigation Map
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">Select a building to jump to that location</p>
                </div>
                <button
                  onClick={() => setMapOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Map Container */}
              <div className="relative w-full h-full bg-[#0a0e1a] overflow-hidden flex items-center justify-center cursor-move">
                <svg
                  viewBox={viewBox}
                  className="w-full h-full p-8"
                  style={{ 
                    filter: 'drop-shadow(0 0 40px rgba(16, 185, 129, 0.05))',
                    maxHeight: '100%' 
                  }}
                >
                  {/* Background Pattern */}
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {/* Blocks */}
                  {manifest.blocks.map((block) => {
                    const isActive = currentBlockId === block.id;
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
                        {/* Building Block */}
                        <motion.path
                          d={block.svgPath}
                          fill={isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(30, 58, 77, 0.2)'}
                          stroke={isActive ? '#10b981' : '#334155'}
                          strokeWidth={isActive ? 3 : 2}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{
                            fill: isActive ? 'rgba(16, 185, 129, 0.4)' : 'rgba(16, 185, 129, 0.1)',
                            stroke: '#10b981',
                            strokeWidth: 3,
                          }}
                          transition={{ duration: 0.2 }}
                        />

                        {/* Connection Line (Anchor to Label) */}
                        {block.svgAnchor && (
                          <line 
                            x1={block.svgAnchor.x} 
                            y1={block.svgAnchor.y} 
                            x2={labelPos.x} 
                            y2={labelPos.y} 
                            stroke={isActive ? '#10b981' : '#334155'}
                            strokeWidth="1"
                            strokeDasharray="4 4"
                            className="opacity-50 group-hover:opacity-100 transition-opacity"
                          />
                        )}

                        {/* Label */}
                        {block.svgAnchor && (
                          <text
                            x={labelPos.x}
                            y={labelPos.y}
                            fill={isActive ? '#fff' : '#94a3b8'}
                            fontSize={isActive ? "14" : "13"}
                            fontWeight={isActive ? '700' : '500'}
                            textAnchor="start"
                            dominantBaseline="middle"
                            className="pointer-events-none select-none transition-all duration-300"
                            style={{
                              paintOrder: 'stroke',
                              stroke: '#0a0e1a',
                              strokeWidth: '4px',
                              strokeLinecap: 'round',
                              strokeLinejoin: 'round',
                            }}
                          >
                            {block.short || block.label}
                          </text>
                        )}

                        {/* Anchor Point */}
                        {block.svgAnchor && (
                          <motion.circle
                            cx={block.svgAnchor.x}
                            cy={block.svgAnchor.y}
                            r={isActive ? 4 : 3}
                            fill={isActive ? '#10b981' : '#475569'}
                            className="group-hover:fill-emerald-400 transition-colors"
                          />
                        )}
                      </g>
                    );
                  })}
                </svg>

                {/* Floating Instructions */}
                <div className="absolute bottom-6 left-6 flex items-center gap-3 px-4 py-2 bg-[#152035]/90 backdrop-blur-md rounded-full border border-white/10 text-xs text-gray-400 shadow-lg">
                  <MousePointer2 size={14} className="text-emerald-400" />
                  <span>Click highlighted buildings to teleport</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
