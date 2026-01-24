import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTourState } from '../../hooks/useTourState';

export const TransitionOverlay: React.FC = () => {
  const { isTransitioning } = useTourState();

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed inset-0 z-[999] bg-black pointer-events-none"
        />
      )}
    </AnimatePresence>
  );
};
