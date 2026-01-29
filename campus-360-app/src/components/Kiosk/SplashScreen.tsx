/**
 * Splash Screen Component
 * "Tap to Begin" screen for kiosk/digital board displays
 */

import { motion } from 'framer-motion';
import { Hand, ChevronRight, MapPin, Compass, Eye } from 'lucide-react';
import { useSessionStore } from '../../hooks/useSessionStore';

export const SplashScreen: React.FC = () => {
  const startSession = useSessionStore((state) => state.startSession);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-zinc-950 flex flex-col items-center justify-center"
      onClick={startSession}
    >
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black" />
        <motion.div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-sky-500/5 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-8 max-w-2xl">
        {/* Logo/Title */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center">
              <Compass className="w-6 h-6 text-sky-400" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-3 tracking-tight">
            Campus 360°
          </h1>
          <p className="text-lg md:text-xl text-white/50">
            Virtual Campus Tour
          </p>
        </motion.div>

        {/* Tap to Begin Button */}
        <motion.button
          onClick={startSession}
          className="group relative mt-16 px-10 py-5 bg-sky-500 hover:bg-sky-600 text-white text-xl font-semibold rounded-2xl shadow-lg shadow-sky-500/25 transition-all"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="relative flex items-center gap-3">
            <Hand className="w-6 h-6" />
            Tap to Begin
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </span>
        </motion.button>

        {/* Subtle touch indicator */}
        <motion.p
          className="mt-8 text-white/30 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Touch anywhere to start
        </motion.p>

        {/* Features */}
        <motion.div
          className="mt-16 flex items-center justify-center gap-8 text-white/40"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="flex items-center gap-2 text-sm">
            <Eye className="w-4 h-4 text-sky-400/60" />
            <span>360° Views</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-white/20" />
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-sky-400/60" />
            <span>Interactive Map</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-white/20" />
          <div className="flex items-center gap-2 text-sm">
            <Compass className="w-4 h-4 text-sky-400/60" />
            <span>Self-Guided</span>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        className="absolute bottom-8 text-white/20 text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Swipe to look around • Pinch to zoom • Press M for map
      </motion.div>
    </motion.div>
  );
};
