import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import { Info, X } from 'lucide-react';
import { useTourState } from '../../hooks/useTourState';
import type { POI } from '../../hooks/useTourDataStore';
import { AnimatePresence, motion } from 'framer-motion';

export const PointsOfInterest: React.FC = () => {
  const { manifest, currentImageId, currentBlockId } = useTourState();
  const [activePoiId, setActivePoiId] = useState<string | null>(null);

  if (!manifest || !currentBlockId || !currentImageId) return null;

  const currentBlock = manifest.blocks.find((b) => b.id === currentBlockId);
  const currentImage = currentBlock?.labs.find((l) => l.id === currentImageId);

  if (!currentImage?.pois) return null;

  return (
    <group>
      {currentImage.pois.map((poi, index) => (
        <POIMarker
          key={`${poi.id}-${index}`}
          poi={poi}
          isActive={activePoiId === poi.id}
          onOpen={() => setActivePoiId(poi.id)}
          onClose={() => setActivePoiId(null)}
        />
      ))}
    </group>
  );
};

const POIMarker = ({
  poi,
  isActive,
  onOpen,
  onClose,
}: {
  poi: POI;
  isActive: boolean;
  onOpen: () => void;
  onClose: () => void;
}) => {
  return (
    <group position={[poi.x, poi.y, poi.z]}>
      {/* 3D Icon */}
      <Html center zIndexRange={[100, 0]}>
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isActive) {
                onClose();
              } else {
                onOpen();
              }
            }}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.4)] border-2 ${
              isActive
                ? 'bg-emerald-500 border-white text-white scale-110'
                : 'bg-[#0d1829]/90 border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white hover:border-white'
            }`}
          >
            {isActive ? <X size={18} /> : <Info size={20} />}
          </button>

          {/* Pulse Ring */}
          {!isActive && (
            <div className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping pointer-events-none opacity-50" />
          )}

          {/* Content Modal (Attached to marker) */}
          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                className="absolute top-16 left-1/2 -translate-x-1/2 w-96 bg-[#0d1829]/95 backdrop-blur-xl border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden z-50 pointer-events-auto flex flex-col max-h-[70vh]"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking content
              >
                {poi.image && (
                  <div className="h-48 w-full shrink-0 relative">
                    <img src={poi.image} alt={poi.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d1829] to-transparent opacity-80" />
                  </div>
                )}

                <div className="p-6 overflow-y-auto custom-scrollbar">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <Info size={18} className="text-emerald-400" />
                    {poi.title}
                  </h3>

                  <p className="text-sm text-gray-300 leading-relaxed mb-5 border-l-2 border-emerald-500/50 pl-3">
                    {poi.description}
                  </p>

                  {poi.video && (
                    <div className="mt-2 rounded-xl overflow-hidden bg-black aspect-video ring-1 ring-white/10 shadow-lg">
                      {poi.video.includes('youtube.com') || poi.video.includes('youtu.be') ? (
                        <iframe
                          className="w-full h-full"
                          src={poi.video
                            .replace('watch?v=', 'embed/')
                            .replace('youtu.be/', 'youtube.com/embed/')}
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-[#1a2332]">
                          <a
                            href={poi.video}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                          >
                            Watch External Video
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Html>
    </group>
  );
};
