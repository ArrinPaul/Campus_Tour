/**
 * Attract Mode Component
 * Auto-play promotional loop when kiosk is idle
 * Showcases key campus locations in a timed sequence
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTourState } from '../../hooks/useTourState';
import { useSessionStore } from '../../hooks/useSessionStore';
import { Hand } from 'lucide-react';
import type { Lab } from '../../hooks/useTourDataStore';

export const AttractMode: React.FC = () => {
  const { setImage, manifest } = useTourState();
  const startSession = useSessionStore((state) => state.startSession);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showOverlay, setShowOverlay] = useState(true);

  // Get all labs from all blocks for featured locations
  const allLabs: Lab[] = manifest?.blocks.flatMap((block) => block.labs) || [];

  // Featured locations for attract mode (entrance labs and key locations)
  const featuredLabs = allLabs
    .filter(
      (lab) =>
        lab.id.includes('entrance') ||
        lab.id.includes('main') ||
        lab.name?.toLowerCase().includes('gate') ||
        lab.name?.toLowerCase().includes('logo')
    )
    .slice(0, 8); // Limit to 8 locations

  // Fallback to first 8 labs if no featured ones found
  const displayLabs = featuredLabs.length > 0 ? featuredLabs : allLabs.slice(0, 8);

  // Auto-advance through featured locations
  useEffect(() => {
    if (displayLabs.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayLabs.length);
    }, 5000); // Change location every 5 seconds

    return () => clearInterval(interval);
  }, [displayLabs.length]);

  // Navigate to current featured location
  useEffect(() => {
    if (displayLabs[currentIndex]) {
      setImage(displayLabs[currentIndex].id);
    }
  }, [currentIndex, displayLabs, setImage]);

  // Fade overlay in and out
  useEffect(() => {
    const fadeInterval = setInterval(() => {
      setShowOverlay((prev) => !prev);
    }, 3000);

    return () => clearInterval(fadeInterval);
  }, []);

  if (displayLabs.length === 0) {
    return null;
  }

  return (
    <>
      {/* Tap to Start Overlay */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 pointer-events-none"
            onClick={startSession}
          >
            {/* Center Prompt */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="bg-black/60 backdrop-blur-md px-16 py-12 rounded-3xl border-2 border-white/20 pointer-events-auto cursor-pointer"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                onClick={startSession}
              >
                <div className="text-center">
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <Hand className="w-20 h-20 text-white mx-auto mb-6" />
                  </motion.div>
                  <h2 className="text-5xl font-bold text-white mb-4">Touch to Begin Tour</h2>
                  <p className="text-2xl text-white/80">Explore our campus in 360°</p>
                </div>
              </motion.div>
            </div>

            {/* Location Info Bar */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2">
              <motion.div
                className="bg-black/60 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/20"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <p className="text-white text-2xl font-semibold">
                  Now Viewing: {displayLabs[currentIndex]?.name || 'Campus'}
                </p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  {displayLabs.map((_: Lab, idx: number) => (
                    <div
                      key={idx}
                      className={`w-3 h-3 rounded-full transition-all ${
                        idx === currentIndex ? 'bg-white w-8' : 'bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Bottom Branding */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
              <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h1 className="text-6xl font-bold text-white mb-2">Campus 360° Virtual Tour</h1>
                <p className="text-xl text-white/70">Interactive • Immersive • Informative</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
