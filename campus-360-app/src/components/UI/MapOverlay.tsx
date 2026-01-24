import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map as MapIcon, X, Navigation } from 'lucide-react';
import { useTourState } from '../../hooks/useTourState';

export const MapOverlay: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { manifest, currentBlockId, setBlock, currentYaw } = useTourState();

  if (!manifest) return null;

  // Calculate approximate bounding box to center the map (simple approach)
  // Defaulting to a fixed reasonable canvas for now based on the path data observed
  const viewBox = "0 0 800 500"; 

  // Radar cone rotation calculation (yaw is in radians)
  // We need to map 3D yaw to 2D rotation. 
  // In Three.js, Y is up, rotation around Y is horizontal.
  const radarRotation = (currentYaw * 180) / Math.PI;

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        className="absolute top-4 right-4 z-50 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all shadow-lg"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <MapIcon size={24} />
      </motion.button>

      {/* Map Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="relative w-full max-w-4xl bg-gray-900/90 rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Navigation size={20} className="text-emerald-400" />
                  Campus Map
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="relative aspect-video w-full bg-[#0f172a] p-8">
                <svg
                  viewBox={viewBox}
                  className="w-full h-full drop-shadow-xl"
                  style={{ filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.1))' }}
                >
                  {/* Background Grid (Optional) */}
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeOpacity="0.05" />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {/* Connecting Paths (Roads - stylistic representation) */}
                  <path
                     d="M 140 210 L 500 340"
                     stroke="white"
                     strokeWidth="2"
                     strokeOpacity="0.1"
                     fill="none"
                     strokeDasharray="4 4"
                  />

                  {/* Blocks */}
                  {manifest.blocks.map((block) => {
                    const isActive = currentBlockId === block.id;
                    return (
                      <g
                        key={block.id}
                        onClick={() => {
                          setBlock(block.id);
                          setIsOpen(false);
                        }}
                        className="cursor-pointer group"
                      >
                        <motion.path
                          d={block.svgPath}
                          fill={isActive ? '#10b981' : '#1e293b'}
                          stroke={isActive ? '#34d399' : '#475569'}
                          strokeWidth={isActive ? 3 : 2}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: 1.05, fill: isActive ? '#059669' : '#334155' }}
                          transition={{ duration: 0.3 }}
                        />
                        
                        {/* Label */}
                        <text
                          x={block.svgAnchor?.x}
                          y={block.svgAnchor?.y}
                          fill="white"
                          fontSize="12"
                          fontWeight={isActive ? "bold" : "normal"}
                          textAnchor="middle"
                          dy="-10"
                          className="pointer-events-none select-none drop-shadow-md"
                        >
                          {block.short || block.label}
                        </text>

                        {/* Active Indicator Pulse & Radar */}
                        {isActive && block.svgAnchor && (
                          <g transform={`translate(${block.svgAnchor.x}, ${block.svgAnchor.y})`}>
                            {/* Radar Cone */}
                            <motion.path
                              d="M 0 0 L -20 -40 A 45 45 0 0 1 20 -40 Z"
                              fill="#10b981"
                              fillOpacity="0.3"
                              animate={{ rotate: radarRotation }}
                              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                            />
                            
                            <motion.circle
                              r="6"
                              fill="#34d399"
                              animate={{
                                scale: [1, 1.5, 1],
                                opacity: [1, 0.5, 1],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            />
                          </g>
                        )}
                      </g>
                    );
                  })}
                </svg>
                
                <div className="absolute bottom-4 left-4 text-xs text-white/40">
                  Click on a highlighted zone to fast-travel.
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
