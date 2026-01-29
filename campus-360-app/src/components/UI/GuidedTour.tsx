/**
 * Guided Tour Component
 * Auto-play tour with controls, progress, and narration
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Square,
  Volume2,
  VolumeX,
  Clock,
  MapPin,
  ChevronRight,
  X,
  Settings,
  List,
} from 'lucide-react';
import { useGuidedTourStore, type GuidedTour } from '../../hooks/useGuidedTourStore';
import { useTourState } from '../../hooks/useTourState';

// Tour Selection Panel
export const TourSelector: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { tours, startTour } = useGuidedTourStore();
  const { setBlock, setImage } = useTourState();

  const handleStartTour = (tour: GuidedTour) => {
    startTour(tour);
    // Navigate to first stop
    if (tour.stops.length > 0) {
      const firstStop = tour.stops[0];
      setBlock(firstStop.blockId);
      setImage(firstStop.imageId);
    }
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-lg bg-zinc-900/95 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Guided Tours</h2>
            <p className="text-white/60 text-sm mt-1">Choose a tour to explore the campus</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} className="text-white/70" />
          </button>
        </div>

        {/* Tour List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {tours.map((tour) => (
            <motion.button
              key={tour.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleStartTour(tour)}
              className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-left transition-colors group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-white font-medium group-hover:text-sky-400 transition-colors">
                    {tour.name}
                  </h3>
                  <p className="text-white/60 text-sm mt-1">{tour.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-white/50 text-xs">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {tour.stops.length} stops
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />~{tour.estimatedDuration} min
                    </span>
                  </div>
                </div>
                <ChevronRight
                  size={20}
                  className="text-white/30 group-hover:text-sky-400 transition-colors mt-1"
                />
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Main Guided Tour Player
export const GuidedTourPlayer: React.FC = () => {
  const {
    activeTour,
    currentStopIndex,
    isPlaying,
    isPaused,
    progress,
    autoAdvance,
    showNarration,
    playbackSpeed,
    pauseTour,
    resumeTour,
    stopTour,
    nextStop,
    previousStop,
    goToStop,
    setAutoAdvance,
    setShowNarration,
    setPlaybackSpeed,
  } = useGuidedTourStore();

  const { setBlock, setImage } = useTourState();
  const [showSettings, setShowSettings] = useState(false);
  const [showStopsList, setShowStopsList] = useState(false);
  // Use a key-based approach to reset timer - when stop changes, the timer resets
  const [stopTimerState, setStopTimerState] = useState({ stopIndex: 0, timer: 0 });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const navigatedStopRef = useRef<string | null>(null);

  const currentStop = activeTour?.stops[currentStopIndex];
  const currentStopId = currentStop ? `${currentStop.blockId}-${currentStop.imageId}` : null;

  // Get current timer value (reset if stop changed)
  const stopTimer = stopTimerState.stopIndex === currentStopIndex ? stopTimerState.timer : 0;

  // Handle navigation when stop changes
  useEffect(() => {
    if (currentStop && currentStopId && currentStopId !== navigatedStopRef.current) {
      navigatedStopRef.current = currentStopId;
      setBlock(currentStop.blockId);
      setImage(currentStop.imageId);
    }
  }, [currentStop, currentStopId, setBlock, setImage]);

  // Auto-advance timer
  useEffect(() => {
    if (!isPlaying || isPaused || !currentStop || !autoAdvance) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const duration = (currentStop.duration * 1000) / playbackSpeed;
    const interval = 100;
    const stopIdx = currentStopIndex;

    timerRef.current = setInterval(() => {
      setStopTimerState((prev) => {
        // If stop changed, reset
        if (prev.stopIndex !== stopIdx) {
          return { stopIndex: stopIdx, timer: interval };
        }
        const newTime = prev.timer + interval;
        if (newTime >= duration) {
          nextStop();
          return { stopIndex: stopIdx, timer: 0 };
        }
        return { stopIndex: stopIdx, timer: newTime };
      });
    }, interval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, isPaused, currentStop, currentStopIndex, autoAdvance, playbackSpeed, nextStop]);

  // Don't render if no active tour
  if (!activeTour) return null;

  const stopProgress = currentStop
    ? (stopTimer / ((currentStop.duration * 1000) / playbackSpeed)) * 100
    : 0;

  return (
    <>
      {/* Tour Player Bar */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-[90vw] max-w-xl"
      >
        <div className="bg-zinc-900/95 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
          {/* Progress Bar */}
          <div className="h-1 bg-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-sky-500 to-purple-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Current Stop Info */}
          <AnimatePresence mode="wait">
            {showNarration && currentStop && (
              <motion.div
                key={currentStop.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="px-4 py-3 border-b border-white/10"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/50 text-xs">
                      Stop {currentStopIndex + 1} of {activeTour.stops.length}
                    </p>
                    <h3 className="text-white font-medium">{currentStop.name}</h3>
                  </div>
                  {autoAdvance && (
                    <div className="w-10 h-10 relative">
                      <svg className="w-full h-full -rotate-90">
                        <circle
                          cx="20"
                          cy="20"
                          r="16"
                          fill="none"
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="3"
                        />
                        <circle
                          cx="20"
                          cy="20"
                          r="16"
                          fill="none"
                          stroke="rgb(56, 189, 248)"
                          strokeWidth="3"
                          strokeDasharray={100}
                          strokeDashoffset={100 - stopProgress}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-xs text-white/70">
                        {Math.ceil(currentStop.duration - (stopTimer / 1000) * playbackSpeed)}s
                      </span>
                    </div>
                  )}
                </div>
                {currentStop.description && (
                  <p className="text-white/60 text-sm mt-1">{currentStop.description}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls */}
          <div className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-1">
              {/* Stop Button */}
              <button
                onClick={stopTour}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-red-400"
                title="Stop tour"
              >
                <Square size={18} />
              </button>

              {/* Narration Toggle */}
              <button
                onClick={() => setShowNarration(!showNarration)}
                className={`p-2 hover:bg-white/10 rounded-full transition-colors ${
                  showNarration ? 'text-sky-400' : 'text-white/50'
                }`}
                title={showNarration ? 'Hide narration' : 'Show narration'}
              >
                {showNarration ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
            </div>

            {/* Main Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={previousStop}
                disabled={currentStopIndex === 0}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                title="Previous stop"
              >
                <SkipBack size={20} />
              </button>

              <button
                onClick={isPlaying ? pauseTour : resumeTour}
                className="p-3 bg-sky-500 hover:bg-sky-600 rounded-full transition-colors text-white"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
              </button>

              <button
                onClick={nextStop}
                disabled={currentStopIndex === activeTour.stops.length - 1}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                title="Next stop"
              >
                <SkipForward size={20} />
              </button>
            </div>

            <div className="flex items-center gap-1">
              {/* Stops List */}
              <button
                onClick={() => setShowStopsList(!showStopsList)}
                className={`p-2 hover:bg-white/10 rounded-full transition-colors ${
                  showStopsList ? 'text-sky-400' : 'text-white/70'
                }`}
                title="Show all stops"
              >
                <List size={18} />
              </button>

              {/* Settings */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 hover:bg-white/10 rounded-full transition-colors ${
                  showSettings ? 'text-sky-400' : 'text-white/70'
                }`}
                title="Tour settings"
              >
                <Settings size={18} />
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-white/10 overflow-hidden"
              >
                <div className="p-4 space-y-4">
                  {/* Auto Advance */}
                  <label className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">Auto-advance</span>
                    <button
                      onClick={() => setAutoAdvance(!autoAdvance)}
                      className={`w-10 h-6 rounded-full transition-colors ${
                        autoAdvance ? 'bg-sky-500' : 'bg-white/20'
                      }`}
                    >
                      <motion.div
                        className="w-4 h-4 bg-white rounded-full m-1"
                        animate={{ x: autoAdvance ? 16 : 0 }}
                      />
                    </button>
                  </label>

                  {/* Playback Speed */}
                  <div className="space-y-2">
                    <span className="text-white/70 text-sm">Playback speed</span>
                    <div className="flex gap-2">
                      {[0.5, 1, 1.5, 2].map((speed) => (
                        <button
                          key={speed}
                          onClick={() => setPlaybackSpeed(speed)}
                          className={`flex-1 py-1.5 rounded-lg text-sm transition-colors ${
                            playbackSpeed === speed
                              ? 'bg-sky-500 text-white'
                              : 'bg-white/10 text-white/70 hover:bg-white/20'
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stops List Panel */}
          <AnimatePresence>
            {showStopsList && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-white/10 overflow-hidden"
              >
                <div className="p-2 max-h-48 overflow-y-auto">
                  {activeTour.stops.map((stop, index) => (
                    <button
                      key={stop.id}
                      onClick={() => goToStop(index)}
                      className={`w-full p-2 rounded-lg text-left transition-colors flex items-center gap-3 ${
                        index === currentStopIndex
                          ? 'bg-sky-500/20 text-sky-400'
                          : 'hover:bg-white/10 text-white/70'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                          index < currentStopIndex
                            ? 'bg-green-500/20 text-green-400'
                            : index === currentStopIndex
                              ? 'bg-sky-500 text-white'
                              : 'bg-white/10'
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span className="text-sm truncate">{stop.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};

// Button to trigger tour selector
export const GuidedTourButton: React.FC = () => {
  const [showSelector, setShowSelector] = useState(false);
  const { activeTour } = useGuidedTourStore();

  // Don't show button if a tour is active
  if (activeTour) return null;

  return (
    <>
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        onClick={() => setShowSelector(true)}
        className="fixed bottom-32 left-6 z-40 px-4 py-3 bg-gradient-to-r from-sky-500 to-purple-500 backdrop-blur-md rounded-full text-white font-medium shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2"
      >
        <Play size={18} />
        <span className="text-sm">Guided Tour</span>
      </motion.button>

      <AnimatePresence>
        {showSelector && <TourSelector onClose={() => setShowSelector(false)} />}
      </AnimatePresence>
    </>
  );
};

export default GuidedTourPlayer;
