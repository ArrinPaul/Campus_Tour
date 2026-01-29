import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTourState } from '../../hooks/useTourState';

type TransitionType = 'fade' | 'zoom' | 'blur' | 'slide';

interface TransitionOverlayProps {
  type?: TransitionType;
}

const transitionVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  zoom: {
    initial: { opacity: 0, scale: 1.2 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
  blur: {
    initial: { opacity: 0, filter: 'blur(20px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, filter: 'blur(20px)' },
  },
  slide: {
    initial: { opacity: 0, x: '100%' },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: '-100%' },
  },
};

export const TransitionOverlay: React.FC<TransitionOverlayProps> = ({ type = 'zoom' }) => {
  const { isTransitioning } = useTourState();

  const variants = transitionVariants[type];

  return (
    <AnimatePresence mode="wait">
      {isTransitioning && (
        <motion.div
          key="transition-overlay"
          initial={variants.initial}
          animate={variants.animate}
          exit={variants.exit}
          transition={{
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1], // Custom easing for smooth feel
          }}
          className="fixed inset-0 z-[999] pointer-events-none overflow-hidden"
        >
          {/* Gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-radial from-zinc-900/95 via-black to-black" />

          {/* Animated circles for visual interest */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-64 h-64 rounded-full border border-sky-500/30"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.1, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute w-48 h-48 rounded-full border border-sky-400/20"
              animate={{
                scale: [1.2, 0.8, 1.2],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.3,
              }}
            />
          </motion.div>

          {/* Loading indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
              <motion.div
                className="w-2 h-2 rounded-full bg-sky-400"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              />
              <span className="text-white/70 text-sm font-medium">Loading view...</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
