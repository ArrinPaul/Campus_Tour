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
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTourState } from '../../hooks/useTourState';
// VR store not available in @react-three/xr v5

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
    nextImage,
    previousImage,
  } = useTourState();

  return (
    <div className="fixed bottom-3 xs:bottom-4 sm:bottom-5 md:bottom-6 lg:bottom-8 left-0 right-0 z-40 flex items-center justify-center px-2 xs:px-3 sm:px-4 md:px-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="flex items-center gap-1.5 xs:gap-2 sm:gap-2.5 md:gap-3 lg:gap-4 max-w-full overflow-x-auto scrollbar-hide"
      >
        {/* Main Controls */}
        <div className="flex items-center gap-0.5 xs:gap-1 sm:gap-1.5 md:gap-2 p-1 xs:p-1.5 sm:p-2 md:p-2.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 shrink-0">
          <button
            onClick={() => setMapOpen(true)}
            className="p-1.5 xs:p-2 sm:p-2.5 md:p-3 lg:p-3.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
            title="Open Map"
          >
            <Layers className="w-4 h-4 xs:w-[18px] xs:h-[18px] sm:w-5 sm:h-5 md:w-[22px] md:h-[22px]" />
          </button>

          <button
            onClick={() => setGyroEnabled(!isGyroEnabled)}
            className={`p-1.5 xs:p-2 sm:p-2.5 md:p-3 lg:p-3.5 rounded-full transition-all ${
              isGyroEnabled
                ? 'bg-white text-black'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
            title="Gyroscope Control"
          >
            <Smartphone className="w-4 h-4 xs:w-[18px] xs:h-[18px] sm:w-5 sm:h-5 md:w-[22px] md:h-[22px]" />
          </button>

          {/* Hide VR button on small screens */}
          <button
            onClick={() => console.log('VR not supported in this version')}
            className="hidden md:flex p-3 lg:p-3.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
            title="Enter VR Mode"
          >
            <Glasses className="w-5 h-5 md:w-[22px] md:h-[22px]" />
          </button>

          <button
            onClick={() => setAudioEnabled(!isAudioEnabled)}
            className={`p-1.5 xs:p-2 sm:p-2.5 md:p-3 lg:p-3.5 rounded-full transition-all ${
              isAudioEnabled
                ? 'bg-white text-black'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
            title="Toggle Audio"
          >
            {isAudioEnabled ? <Volume2 className="w-4 h-4 xs:w-[18px] xs:h-[18px] sm:w-5 sm:h-5 md:w-[22px] md:h-[22px]" /> : <VolumeX className="w-4 h-4 xs:w-[18px] xs:h-[18px] sm:w-5 sm:h-5 md:w-[22px] md:h-[22px]" />}
          </button>

          <div className="w-px h-4 xs:h-5 sm:h-6 md:h-7 bg-white/10" />

          {/* Hide zoom on small screens - use pinch instead */}
          <button
            onClick={() => zoomCamera('out')}
            className="hidden sm:flex p-2.5 md:p-3 lg:p-3.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5 md:w-[22px] md:h-[22px]" />
          </button>

          <button
            onClick={() => setAutoRotation(!isAutoRotating)}
            className="p-2.5 xs:p-3 sm:p-3.5 md:p-4 lg:p-5 rounded-full bg-white text-black hover:bg-white/90 transition-all shadow-lg"
            title={isAutoRotating ? 'Pause' : 'Play'}
          >
            {isAutoRotating ? (
              <Pause strokeWidth={2.5} className="w-4 h-4 xs:w-[18px] xs:h-[18px] sm:w-5 sm:h-5 md:w-[22px] md:h-[22px] lg:w-6 lg:h-6" />
            ) : (
              <Play strokeWidth={2.5} className="w-4 h-4 xs:w-[18px] xs:h-[18px] sm:w-5 sm:h-5 md:w-[22px] md:h-[22px] lg:w-6 lg:h-6 ml-0.5" />
            )}
          </button>

          {/* Hide zoom on small screens - use pinch instead */}
          <button
            onClick={() => zoomCamera('in')}
            className="hidden sm:flex p-2.5 md:p-3 lg:p-3.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5 md:w-[22px] md:h-[22px]" />
          </button>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-0.5 xs:gap-1 sm:gap-1.5 md:gap-2 p-1 xs:p-1.5 sm:p-2 md:p-2.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 shrink-0">
          <button
            onClick={previousImage}
            className="p-1.5 xs:p-2 sm:p-2.5 md:p-3 lg:p-3.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
            title="Backward"
          >
            <ChevronLeft className="w-4 h-4 xs:w-[18px] xs:h-[18px] sm:w-5 sm:h-5 md:w-[22px] md:h-[22px]" />
          </button>

          <button
            onClick={nextImage}
            className="p-1.5 xs:p-2 sm:p-2.5 md:p-3 lg:p-3.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
            title="Forward"
          >
            <ChevronRight className="w-4 h-4 xs:w-[18px] xs:h-[18px] sm:w-5 sm:h-5 md:w-[22px] md:h-[22px]" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
