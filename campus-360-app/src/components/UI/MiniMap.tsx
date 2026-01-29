import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from 'lucide-react';
import { useTourState } from '../../hooks/useTourState';

// Compact campus layout for mini-map
const MINI_LAYOUT: Record<string, { x: number; y: number }> = {
  gatetologo: { x: 20, y: 15 },
  block1: { x: 28, y: 28 },
  block2: { x: 40, y: 35 },
  devdan: { x: 52, y: 42 },
  block6: { x: 64, y: 49 },
  block3: { x: 76, y: 56 },
  block4: { x: 70, y: 70 },
  block5: { x: 58, y: 77 },
  archi: { x: 80, y: 84 },
  out: { x: 45, y: 84 },
};

const HIDDEN_BLOCKS = ['outside'];

export const MiniMap: React.FC = () => {
  const { manifest, currentBlockId, setBlock, setMapOpen, currentYaw } = useTourState();

  const processedBlocks = useMemo(() => {
    if (!manifest) return [];
    return manifest.blocks
      .filter((block) => !HIDDEN_BLOCKS.includes(block.id))
      .map((block) => ({
        ...block,
        pos: MINI_LAYOUT[block.id] || { x: 50, y: 50 },
      }));
  }, [manifest]);

  const currentPos = useMemo(() => {
    if (!currentBlockId) return { x: 50, y: 50 };
    return MINI_LAYOUT[currentBlockId] || { x: 50, y: 50 };
  }, [currentBlockId]);

  if (!manifest) return null;

  // Convert camera yaw to compass direction (rotate the indicator)
  const compassRotation = (currentYaw * 180) / Math.PI;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, duration: 0.3 }}
      className="fixed bottom-24 right-6 z-30"
    >
      <div
        className="relative w-32 h-32 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 overflow-hidden cursor-pointer group hover:border-sky-500/50 transition-all"
        onClick={() => setMapOpen(true)}
        title="Click to open full map"
      >
        {/* Background grid */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <pattern id="miniGrid" width="16" height="16" patternUnits="userSpaceOnUse">
                <path
                  d="M 16 0 L 0 0 0 16"
                  fill="none"
                  stroke="rgba(14,165,233,0.3)"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#miniGrid)" />
          </svg>
        </div>

        {/* Building dots */}
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {processedBlocks.map((block) => {
            const isActive = currentBlockId === block.id;
            return (
              <g
                key={block.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setBlock(block.id);
                }}
                className="cursor-pointer"
              >
                <circle
                  cx={block.pos.x}
                  cy={block.pos.y}
                  r={isActive ? 5 : 3}
                  fill={isActive ? '#0ea5e9' : '#64748b'}
                  stroke={isActive ? '#38bdf8' : 'transparent'}
                  strokeWidth={isActive ? 2 : 0}
                  className="transition-all duration-200 hover:fill-sky-400"
                  style={{
                    filter: isActive ? 'drop-shadow(0 0 6px rgba(14,165,233,0.8))' : 'none',
                  }}
                />
              </g>
            );
          })}

          {/* Direction indicator (triangle pointing in camera direction) */}
          <g
            transform={`translate(${currentPos.x}, ${currentPos.y}) rotate(${-compassRotation})`}
            className="transition-transform duration-150"
          >
            <polygon
              points="0,-10 4,-4 -4,-4"
              fill="#38bdf8"
              stroke="#0ea5e9"
              strokeWidth="1"
              style={{
                filter: 'drop-shadow(0 0 4px rgba(56,189,248,0.8))',
              }}
            />
          </g>
        </svg>

        {/* Expand hint on hover */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-1 px-2 py-0.5 bg-black/60 rounded text-[10px] text-white/70">
            <Navigation size={10} />
            <span>Expand</span>
          </div>
        </div>

        {/* Label */}
        <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/50 rounded text-[10px] text-white/70 font-medium">
          Map
        </div>
      </div>
    </motion.div>
  );
};
