import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTourState } from '../../hooks/useTourState';

export const NavArrows: React.FC = () => {
  const { nextImage, previousImage } = useTourState();

  return (
    <>
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        whileHover={{ scale: 1.1, x: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={previousImage}
        className="fixed left-6 top-1/2 -translate-y-1/2 z-40 p-4 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-black/50 transition-all shadow-lg"
      >
        <ChevronLeft size={24} />
      </motion.button>

      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        whileHover={{ scale: 1.1, x: 2 }}
        whileTap={{ scale: 0.95 }}
        onClick={nextImage}
        className="fixed right-6 top-1/2 -translate-y-1/2 z-40 p-4 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-black/50 transition-all shadow-lg"
      >
        <ChevronRight size={24} />
      </motion.button>
    </>
  );
};
