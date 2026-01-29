/**
 * Inactivity Warning Component
 * Shows countdown warning before resetting session
 */

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X } from 'lucide-react';
import { useSessionStore } from '../../hooks/useSessionStore';

export const InactivityWarning: React.FC = () => {
  const {
    inactivityWarningShown,
    secondsUntilReset,
    updateCountdown,
    hideWarning,
    recordActivity,
    resetToAttractMode,
  } = useSessionStore();

  // Countdown timer
  useEffect(() => {
    if (!inactivityWarningShown) return;

    const interval = setInterval(() => {
      updateCountdown(secondsUntilReset - 1);

      if (secondsUntilReset <= 1) {
        clearInterval(interval);
        resetToAttractMode();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [inactivityWarningShown, secondsUntilReset, updateCountdown, resetToAttractMode]);

  const handleContinue = () => {
    hideWarning();
    recordActivity();
  };

  return (
    <AnimatePresence>
      {inactivityWarningShown && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={handleContinue}
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            className="bg-slate-800 rounded-3xl p-12 max-w-2xl mx-4 shadow-2xl border-2 border-yellow-500/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleContinue}
              className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Warning Icon */}
            <div className="flex justify-center mb-8">
              <motion.div
                className="bg-yellow-500/20 p-8 rounded-full"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Clock className="w-20 h-20 text-yellow-500" />
              </motion.div>
            </div>

            {/* Title */}
            <h2 className="text-4xl font-bold text-white text-center mb-4">Are you still there?</h2>

            {/* Message */}
            <p className="text-xl text-white/80 text-center mb-8">Your session will end in</p>

            {/* Countdown */}
            <motion.div
              className="text-8xl font-bold text-center mb-8"
              animate={{
                scale: secondsUntilReset <= 10 ? [1, 1.1, 1] : 1,
                color: secondsUntilReset <= 10 ? '#ef4444' : '#eab308',
              }}
              transition={{
                duration: 0.5,
              }}
            >
              {secondsUntilReset}s
            </motion.div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              className="w-full py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-2xl font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95"
            >
              Continue Exploring
            </button>

            {/* Helper Text */}
            <p className="text-center text-white/60 mt-6 text-lg">
              Tap or touch anywhere to stay active
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
