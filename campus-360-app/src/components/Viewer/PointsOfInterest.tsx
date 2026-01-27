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
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg border-2 ${
              isActive
                ? 'bg-emerald-500 border-white text-white scale-110'
                : 'bg-white/90 border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white hover:border-white'
            }`}
          >
            {isActive ? <X size={20} /> : <Info size={24} />}
          </button>

          {/* Pulse Ring */}
          {!isActive && (
            <div className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping pointer-events-none" />
          )}

          {/* Content Modal (Attached to marker) */}
          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                className="absolute top-14 left-1/2 -translate-x-1/2 w-80 bg-white rounded-xl shadow-2xl overflow-hidden z-50 pointer-events-auto"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking content
              >
                {poi.image && (
                  <div className="h-40 w-full overflow-hidden relative">
                    <img src={poi.image} alt={poi.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                )}

                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{poi.title}</h3>

                  <p className="text-sm text-gray-600 leading-relaxed mb-4">{poi.description}</p>

                  {poi.video && (
                    <div className="mt-4 rounded-lg overflow-hidden bg-black aspect-video">
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
                        <a
                          href={poi.video}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-xs font-semibold text-emerald-600 hover:text-emerald-700 uppercase tracking-wider"
                        >
                          Watch Video External →
                        </a>
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
