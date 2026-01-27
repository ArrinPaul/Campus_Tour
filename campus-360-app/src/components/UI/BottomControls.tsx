import React from 'react';
import {
  Layers,
  Smartphone,
  Glasses,
  Volume2,
  VolumeX,
  Pause,
  Play,
  ZoomOut,
  ZoomIn,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTourState } from '../../hooks/useTourState';
import { xrStore } from '../../utils/xr';

export const BottomControls: React.FC = () => {
  const {
    zoomCamera,
    isAutoRotating,
    setAutoRotation,
    isGyroEnabled,
    setGyroEnabled,
    isAudioEnabled,
    setAudioEnabled,
    setMapOpen,
  } = useTourState();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      style={{ left: '50%', x: '-50%' }}
      className="fixed bottom-6 z-40"
    >
      <div className="flex items-center gap-2 p-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10">
        <button
          onClick={() => setMapOpen(true)}
          className="p-3 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
          title="Open Map"
        >
          <Layers size={20} />
        </button>

        <button
          onClick={() => setGyroEnabled(!isGyroEnabled)}
          className={`p-3 rounded-full transition-all ${
            isGyroEnabled
              ? 'bg-white text-black'
              : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
          title="Gyroscope Control"
        >
          <Smartphone size={20} />
        </button>

        <button
          onClick={() => xrStore.enterVR()}
          className="p-3 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
          title="Enter VR Mode"
        >
          <Glasses size={20} />
        </button>

        <button
          onClick={() => setAudioEnabled(!isAudioEnabled)}
          className={`p-3 rounded-full transition-all ${
            isAudioEnabled
              ? 'bg-white text-black'
              : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
          title="Toggle Audio"
        >
          {isAudioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>

        <div className="w-px h-6 bg-white/10" />

        <button
          onClick={() => zoomCamera('out')}
          className="p-3 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
          title="Zoom Out"
        >
          <ZoomOut size={20} />
        </button>

        <button
          onClick={() => setAutoRotation(!isAutoRotating)}
          className="p-4 rounded-full bg-white text-black hover:bg-white/90 transition-all shadow-lg"
          title={isAutoRotating ? 'Pause' : 'Play'}
        >
          {isAutoRotating ? (
            <Pause size={22} strokeWidth={2.5} />
          ) : (
            <Play size={22} strokeWidth={2.5} className="ml-0.5" />
          )}
        </button>

        <button
          onClick={() => zoomCamera('in')}
          className="p-3 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
          title="Zoom In"
        >
          <ZoomIn size={20} />
        </button>
      </div>
    </motion.div>
  );
};
