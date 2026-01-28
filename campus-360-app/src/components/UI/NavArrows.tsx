import React, { useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTourState } from '../../hooks/useTourState';

export const NavArrows: React.FC = () => {
  const { nextImage, previousImage } = useTourState();

  // Keyboard navigation handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't navigate if user is typing in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Use Page Up/Down or Space for navigation to avoid conflict with camera controls
      switch (e.key) {
        case 'PageDown':
        case ' ': // Space bar
          e.preventDefault();
          nextImage();
          break;
        case 'PageUp':
        case 'Backspace':
          e.preventDefault();
          previousImage();
          break;
        case 'n': // N for next
        case 'N':
          nextImage();
          break;
        case 'p': // P for previous
        case 'P':
          previousImage();
          break;
      }
    },
    [nextImage, previousImage]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      style={{ left: '50%', x: '-50%' }}
      className="fixed bottom-24 z-40"
    >
      <div className="flex items-center gap-1 p-1 rounded-full bg-black/30 backdrop-blur-md border border-white/10">
        <motion.button
          onClick={previousImage}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1 px-2 py-1 rounded-full text-white/70 hover:text-sky-400 hover:bg-sky-500/10 transition-all"
          title="Previous (P or Page Up)"
        >
          <ChevronLeft size={14} />
          <span className="text-[10px] font-semibold uppercase tracking-wider">Backward</span>
        </motion.button>

        <div className="w-px h-4 bg-white/10" />

        <motion.button
          onClick={nextImage}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1 px-2 py-1 rounded-full text-white/70 hover:text-sky-400 hover:bg-sky-500/10 transition-all"
          title="Next (N or Space)"
        >
          <span className="text-[10px] font-semibold uppercase tracking-wider">Forward</span>
          <ChevronRight size={14} />
        </motion.button>
      </div>
    </motion.div>
  );
};
