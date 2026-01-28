import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Navigation, MousePointer2 } from 'lucide-react';
import { useTourState } from '../../hooks/useTourState';

// Well-spaced campus layout - original style but organized properly
interface BuildingLayout {
  x: number; // Center X position
  y: number; // Center Y position
  w: number; // Width
  h: number; // Height
  labelX: number; // Label X position
  labelY: number; // Label Y position
  displayLabel: string;
}

const CAMPUS_LAYOUT: Record<string, BuildingLayout> = {
  // Continuous diagonal staircase layout - all buildings in same inclined line
  gatetologo: { x: 120, y: 80, w: 75, h: 70, labelX: 320, labelY: 80, displayLabel: 'Entrance' },
  block1: { x: 150, y: 160, w: 75, h: 70, labelX: 350, labelY: 160, displayLabel: 'Block 1' },
  block2: { x: 230, y: 200, w: 75, h: 70, labelX: 430, labelY: 200, displayLabel: 'Block 2' },
  devdan: { x: 310, y: 240, w: 75, h: 70, labelX: 510, labelY: 240, displayLabel: 'Devdan' },
  block6: { x: 390, y: 280, w: 75, h: 70, labelX: 590, labelY: 280, displayLabel: 'Block 6' },
  block3: { x: 470, y: 320, w: 75, h: 70, labelX: 670, labelY: 320, displayLabel: 'Block 3' },
  block4: { x: 430, y: 400, w: 75, h: 70, labelX: 630, labelY: 400, displayLabel: 'Block 4' },
  block5: { x: 350, y: 440, w: 75, h: 70, labelX: 550, labelY: 440, displayLabel: 'Block 5' },
  archi: { x: 490, y: 480, w: 75, h: 70, labelX: 690, labelY: 480, displayLabel: 'Architecture' },
  out: { x: 270, y: 480, w: 75, h: 70, labelX: 470, labelY: 480, displayLabel: 'Outdoor' },
};

// Blocks to hide from the map
const HIDDEN_BLOCKS = ['outside'];

// Generate building rectangle path
const generateBlockPath = (layout: BuildingLayout): string => {
  const halfW = layout.w / 2;
  const halfH = layout.h / 2;
  return `M ${layout.x - halfW} ${layout.y - halfH} L ${layout.x + halfW} ${layout.y - halfH} L ${layout.x + halfW} ${layout.y + halfH} L ${layout.x - halfW} ${layout.y + halfH} Z`;
};

export const MapOverlay: React.FC = () => {
  const { manifest, currentBlockId, setBlock, isMapOpen, setMapOpen } = useTourState();

  // Process blocks with improved layout
  const processedBlocks = useMemo(() => {
    if (!manifest) return [];

    return manifest.blocks
      .filter((block) => !HIDDEN_BLOCKS.includes(block.id))
      .map((block) => {
        const layout = CAMPUS_LAYOUT[block.id];
        if (layout) {
          return {
            ...block,
            layout,
            svgPath: generateBlockPath(layout),
            anchorX: layout.x,
            anchorY: layout.y,
            labelX: layout.labelX,
            labelY: layout.labelY,
            displayLabel: layout.displayLabel,
          };
        }
        return null;
      })
      .filter(Boolean);
  }, [manifest]);

  if (!manifest) return null;

  const viewBox = '0 0 900 600';

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
              className="relative w-full max-w-[95vw] h-[90vh] flex flex-col bg-gradient-to-br from-[#0d1829]/95 via-[#152035]/90 to-[#0a0e1a]/95 rounded-2xl border border-sky-500/30 overflow-hidden shadow-[0_0_60px_rgba(14,165,233,0.3),0_20px_80px_rgba(0,0,0,0.8)]"
              style={{
                backdropFilter: 'blur(20px)',
                boxShadow:
                  '0 0 60px rgba(14,165,233,0.3), 0 20px 80px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.1)',
              }}
              initial={{ scale: 0.95, y: 20, rotateX: 15 }}
              animate={{ scale: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.95, y: 20, rotateX: 15 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-sky-500/30 flex justify-between items-center bg-gradient-to-r from-[#152035]/80 to-[#1a2a45]/80 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-3 drop-shadow-[0_2px_8px_rgba(14,165,233,0.5)]">
                    <Navigation
                      size={22}
                      className="text-sky-400 drop-shadow-[0_0_10px_rgba(14,165,233,0.8)]"
                    />
                    Campus Navigation Map
                  </h2>
                  <p className="text-sm text-gray-300/90 mt-1 drop-shadow-sm">
                    Select a building to jump to that location
                  </p>
                </div>
                <button
                  onClick={() => setMapOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-full text-white/60 hover:text-white transition-all backdrop-blur-sm border border-white/10 hover:border-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Map Container */}
              <div
                className="relative w-full h-full bg-gradient-to-br from-[#0a0e1a] via-[#0d1520] to-[#0a0e1a] overflow-hidden flex items-center justify-center"
                style={{
                  perspective: '1200px',
                  perspectiveOrigin: '50% 50%',
                }}
              >
                <div
                  className="w-full h-full"
                  style={{
                    transform: 'rotateX(10deg) rotateY(0deg)',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.3s ease-out',
                  }}
                >
                  <svg
                    viewBox={viewBox}
                    className="w-full h-full p-6"
                    preserveAspectRatio="xMidYMid meet"
                    style={{
                      filter: 'drop-shadow(0 10px 40px rgba(14, 165, 233, 0.15))',
                      maxHeight: '100%',
                    }}
                  >
                    {/* Background Pattern */}
                    <defs>
                      <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                        <path
                          d="M 50 0 L 0 0 0 50"
                          fill="none"
                          stroke="rgba(14, 165, 233, 0.08)"
                          strokeWidth="1"
                        />
                      </pattern>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                      <linearGradient id="buildingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(14, 165, 233, 0.4)" />
                        <stop offset="100%" stopColor="rgba(14, 165, 233, 0.1)" />
                      </linearGradient>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" opacity="0.3" />

                    {/* Buildings */}
                    {processedBlocks.map((block: any) => {
                      const isActive = currentBlockId === block.id;
                      if (!block.layout) return null;

                      return (
                        <g
                          key={block.id}
                          onClick={() => {
                            setBlock(block.id);
                            setMapOpen(false);
                          }}
                          className="cursor-pointer group"
                        >
                          {/* Building Shape */}
                          <motion.path
                            d={block.svgPath}
                            fill={isActive ? 'url(#buildingGradient)' : 'rgba(30, 58, 77, 0.5)'}
                            stroke={isActive ? '#0ea5e9' : '#64748b'}
                            strokeWidth={isActive ? 3 : 2}
                            filter={isActive ? 'url(#glow)' : 'none'}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{
                              fill: isActive
                                ? 'url(#buildingGradient)'
                                : 'rgba(14, 165, 233, 0.35)',
                              stroke: '#0ea5e9',
                              strokeWidth: 3,
                              filter: 'url(#glow)',
                              scale: 1.05,
                            }}
                            transition={{ duration: 0.2 }}
                            style={{
                              filter: isActive
                                ? 'drop-shadow(0 0 20px rgba(14, 165, 233, 0.8)) drop-shadow(0 5px 15px rgba(14, 165, 233, 0.4))'
                                : 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5))',
                            }}
                          />

                          {/* Dashed line from anchor to label */}
                          <line
                            x1={block.anchorX + 40}
                            y1={block.anchorY}
                            x2={block.labelX - 10}
                            y2={block.labelY}
                            stroke={isActive ? '#0ea5e9' : '#64748b'}
                            strokeWidth="2"
                            strokeDasharray="5 4"
                            className="opacity-60 group-hover:opacity-100 transition-opacity"
                            style={{
                              filter: isActive
                                ? 'drop-shadow(0 0 4px rgba(14, 165, 233, 0.6))'
                                : 'none',
                            }}
                          />

                          {/* Anchor Point on building */}
                          <motion.circle
                            cx={block.anchorX}
                            cy={block.anchorY}
                            r={isActive ? 6 : 5}
                            fill={isActive ? '#0ea5e9' : '#64748b'}
                            stroke={isActive ? '#38bdf8' : '#475569'}
                            strokeWidth="2.5"
                            className="group-hover:fill-sky-400 transition-colors"
                            style={{
                              filter: isActive
                                ? 'drop-shadow(0 0 10px rgba(14, 165, 233, 1)) drop-shadow(0 0 20px rgba(14, 165, 233, 0.5))'
                                : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5))',
                            }}
                          />

                          {/* Label text */}
                          <text
                            x={block.labelX}
                            y={block.labelY}
                            fill={isActive ? '#38bdf8' : '#94a3b8'}
                            fontSize="14"
                            fontWeight={isActive ? '700' : '500'}
                            textAnchor="start"
                            dominantBaseline="middle"
                            className="pointer-events-none select-none group-hover:fill-sky-300 transition-colors"
                            style={{
                              filter: isActive
                                ? 'drop-shadow(0 0 8px rgba(56, 189, 248, 0.8)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8))'
                                : 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.7))',
                              textShadow: isActive ? '0 0 20px rgba(56, 189, 248, 0.5)' : 'none',
                            }}
                          >
                            {block.displayLabel}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Floating Instructions */}
                <div className="absolute bottom-6 left-6 flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-[#152035]/95 to-[#1a2a45]/95 backdrop-blur-xl rounded-full border border-sky-500/30 text-xs text-gray-300 shadow-[0_0_30px_rgba(14,165,233,0.2),0_8px_20px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.1)]">
                  <MousePointer2
                    size={14}
                    className="text-sky-400 drop-shadow-[0_0_8px_rgba(14,165,233,0.8)]"
                  />
                  <span className="font-medium drop-shadow-sm">
                    Click highlighted buildings to teleport
                  </span>
                </div>

                {/* Legend */}
                <div className="absolute top-4 right-4 flex flex-col gap-3 px-5 py-4 bg-gradient-to-br from-[#152035]/95 to-[#1a2a45]/95 backdrop-blur-xl rounded-xl border border-sky-500/30 text-xs text-gray-300 shadow-[0_0_30px_rgba(14,165,233,0.2),0_8px_20px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.1)]">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-sm bg-gradient-to-br from-sky-500/40 to-sky-600/30 border-2 border-sky-400 shadow-[0_0_10px_rgba(14,165,233,0.6)]" />
                    <span className="font-medium">Current location</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-sm bg-slate-700/50 border-2 border-slate-500 shadow-[0_2px_8px_rgba(0,0,0,0.4)]" />
                    <span className="font-medium">Available buildings</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
