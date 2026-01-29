/**
 * One-Hand Mode Component
 * Clusters all controls on one side for single-hand operation
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useAccessibilityStore } from '../../hooks/useAccessibilityStore';
import { useTourState } from '../../hooks/useTourState';
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Map,
  Volume2,
  VolumeX,
  Camera,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { useCameraControlsStore } from '../../hooks/useCameraControlsStore';
import { useUIStateStore } from '../../hooks/useUIStateStore';

export const OneHandModeControls: React.FC = () => {
  const { oneHandMode, handPreference, highContrastMode } = useAccessibilityStore();
  const { navigateToLink, previousImage, nextImage } = useTourState();
  const { zoomCamera } = useCameraControlsStore();
  const { isAudioEnabled, setAudioEnabled, isMapOpen, setMapOpen } = useUIStateStore();

  if (!oneHandMode) return null;

  const isLeftHand = handPreference === 'left';

  // Large button styles for accessibility
  const buttonClass = `
    w-16 h-16 rounded-2xl flex items-center justify-center
    transition-all duration-200 shadow-lg
    ${highContrastMode 
      ? 'bg-white text-black border-4 border-yellow-400 hover:bg-yellow-400' 
      : 'bg-slate-800/90 text-white border border-white/20 hover:bg-slate-700/90 active:scale-95'
    }
  `;

  const smallButtonClass = `
    w-12 h-12 rounded-xl flex items-center justify-center
    transition-all duration-200 shadow-md
    ${highContrastMode 
      ? 'bg-white text-black border-3 border-yellow-400 hover:bg-yellow-400' 
      : 'bg-slate-800/80 text-white border border-white/20 hover:bg-slate-700/80 active:scale-95'
    }
  `;

  const handleScreenshot = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `campus-tour-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: isLeftHand ? -100 : 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: isLeftHand ? -100 : 100 }}
        className={`fixed top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3 p-3 
          ${isLeftHand ? 'left-4' : 'right-4'}
          ${highContrastMode ? 'bg-black border-4 border-white' : 'bg-slate-900/80 backdrop-blur-md border border-white/10'}
          rounded-3xl shadow-2xl
        `}
        role="toolbar"
        aria-label="One-hand navigation controls"
      >
        {/* Navigation Controls */}
        <div className="flex flex-col items-center gap-1">
          <span className={`text-xs font-bold mb-1 ${highContrastMode ? 'text-yellow-400' : 'text-white/60'}`}>
            NAV
          </span>
          <button
            onClick={() => navigateToLink('up')}
            className={buttonClass}
            aria-label="Navigate up"
          >
            <ChevronUp className="w-8 h-8" />
          </button>
          <div className="flex gap-1">
            <button
              onClick={() => navigateToLink('left')}
              className={buttonClass}
              aria-label="Navigate left"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={() => navigateToLink('right')}
              className={buttonClass}
              aria-label="Navigate right"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
          <button
            onClick={() => navigateToLink('down')}
            className={buttonClass}
            aria-label="Navigate down"
          >
            <ChevronDown className="w-8 h-8" />
          </button>
        </div>

        {/* Divider */}
        <div className={`w-full h-0.5 ${highContrastMode ? 'bg-yellow-400' : 'bg-white/20'}`} />

        {/* Quick Actions */}
        <div className="flex flex-col items-center gap-2">
          <span className={`text-xs font-bold mb-1 ${highContrastMode ? 'text-yellow-400' : 'text-white/60'}`}>
            QUICK
          </span>
          
          {/* Zoom Controls */}
          <div className="flex gap-1">
            <button
              onClick={() => zoomCamera('in')}
              className={smallButtonClass}
              aria-label="Zoom in"
            >
              <ZoomIn className="w-6 h-6" />
            </button>
            <button
              onClick={() => zoomCamera('out')}
              className={smallButtonClass}
              aria-label="Zoom out"
            >
              <ZoomOut className="w-6 h-6" />
            </button>
          </div>

          {/* Map Toggle */}
          <button
            onClick={() => setMapOpen(!isMapOpen)}
            className={smallButtonClass}
            aria-label={isMapOpen ? 'Close map' : 'Open map'}
            aria-pressed={isMapOpen}
          >
            <Map className="w-6 h-6" />
          </button>

          {/* Audio Toggle */}
          <button
            onClick={() => setAudioEnabled(!isAudioEnabled)}
            className={smallButtonClass}
            aria-label={isAudioEnabled ? 'Mute audio' : 'Enable audio'}
            aria-pressed={isAudioEnabled}
          >
            {isAudioEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
          </button>

          {/* Screenshot */}
          <button
            onClick={handleScreenshot}
            className={smallButtonClass}
            aria-label="Take screenshot"
          >
            <Camera className="w-6 h-6" />
          </button>
        </div>

        {/* Divider */}
        <div className={`w-full h-0.5 ${highContrastMode ? 'bg-yellow-400' : 'bg-white/20'}`} />

        {/* Scene Navigation */}
        <div className="flex flex-col items-center gap-2">
          <span className={`text-xs font-bold mb-1 ${highContrastMode ? 'text-yellow-400' : 'text-white/60'}`}>
            SCENE
          </span>
          <div className="flex gap-1">
            <button
              onClick={previousImage}
              className={smallButtonClass}
              aria-label="Previous scene"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className={smallButtonClass}
              aria-label="Next scene"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
