import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTourState } from '../../hooks/useTourState';
import type { Lab } from '../../hooks/useTourDataStore';

export const Overlay: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const timeoutRef = useRef<number | null>(null);
  const { manifest, currentBlockId, currentImageId } = useTourState();

  // Get current location info
  const currentBlock = manifest?.blocks?.find((b) => b.id === currentBlockId);
  const currentImage = currentBlock?.labs?.find((l: Lab) => l.id === currentImageId);

  useEffect(() => {
    const handleActivity = () => {
      setVisible(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        setVisible(false);
      }, 4000);
    };

    handleActivity();

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('keydown', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      <AnimatePresence>
        {visible && currentBlock && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-auto"
          >
            {/* Current Location Badge */}
            <div className="px-5 py-3 rounded-xl bg-slate-900/70 backdrop-blur-xl border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <div>
                  <p className="text-white font-medium text-sm">{currentBlock.name}</p>
                  {currentImage && (
                    <p className="text-white/50 text-xs mt-0.5">
                      View {currentBlock.labs?.findIndex((l: Lab) => l.id === currentImageId) + 1}{' '}
                      of {currentBlock.labs?.length}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
