import React from 'react';
import { motion } from 'framer-motion';
import { Navigation } from 'lucide-react';
import { useTourState } from '../../hooks/useTourState';

export const Compass: React.FC = () => {
  const { currentYaw } = useTourState();

  // Convert yaw (radians) to degrees for CSS rotation
  // Three.js rotation.y is usually counter-clockwise in radians
  const rotationDegrees = (currentYaw * 180) / Math.PI;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-24 right-6 z-30 hidden md:block"
    >
      <div className="relative w-16 h-16 rounded-full bg-black/40 backdrop-blur-md border border-white/20 shadow-xl flex items-center justify-center">
        {/* Cardinal Directions */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white/80">
          N
        </div>
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white/40">
          S
        </div>
        <div className="absolute left-1 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white/40">
          W
        </div>
        <div className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white/40">
          E
        </div>

        {/* Rotating Needle */}
        <div
          className="w-full h-full flex items-center justify-center transition-transform duration-100 ease-out"
          style={{ transform: `rotate(${rotationDegrees}deg)` }}
        >
          <Navigation size={24} className="text-emerald-400 fill-emerald-400/20" />
        </div>
      </div>
    </motion.div>
  );
};
