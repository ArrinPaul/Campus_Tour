import React, { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Cpu, Gauge } from 'lucide-react';
import { usePerformanceStore } from '../../hooks/usePerformanceStore';

// Component to track FPS inside Canvas
export const FPSTracker: React.FC = () => {
  const frameCount = useRef(0);
  const lastTime = useRef(0);
  const initialized = useRef(false);
  const setCurrentFPS = usePerformanceStore((s) => s.setCurrentFPS);

  useFrame(() => {
    // Initialize on first frame
    if (!initialized.current) {
      lastTime.current = performance.now();
      initialized.current = true;
      return;
    }

    frameCount.current++;
    const now = performance.now();
    const delta = now - lastTime.current;

    // Update FPS every second
    if (delta >= 1000) {
      const fps = Math.round((frameCount.current * 1000) / delta);
      setCurrentFPS(fps);
      frameCount.current = 0;
      lastTime.current = now;
    }
  });

  return null;
};

// UI Component for displaying FPS and performance info
export const FPSCounter: React.FC = () => {
  const { showFPSCounter, currentFPS, settings, mode } = usePerformanceStore();
  const [memoryUsage, setMemoryUsage] = useState<number | null>(null);

  // Track memory usage if available
  useEffect(() => {
    if (!showFPSCounter) return;

    const updateMemory = () => {
      const perf = performance as Performance & {
        memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number };
      };
      if (perf.memory) {
        const usedMB = Math.round(perf.memory.usedJSHeapSize / 1024 / 1024);
        setMemoryUsage(usedMB);
      }
    };

    updateMemory();
    const interval = setInterval(updateMemory, 2000);
    return () => clearInterval(interval);
  }, [showFPSCounter]);

  // Determine FPS color based on performance
  const getFPSColor = () => {
    if (currentFPS >= 55) return 'text-green-400';
    if (currentFPS >= 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getFPSBgColor = () => {
    if (currentFPS >= 55) return 'bg-green-500/20';
    if (currentFPS >= 30) return 'bg-yellow-500/20';
    return 'bg-red-500/20';
  };

  return (
    <AnimatePresence>
      {showFPSCounter && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="fixed top-20 right-6 z-50"
        >
          <div className="bg-black/60 backdrop-blur-md rounded-lg border border-white/10 p-3 min-w-[160px]">
            {/* FPS Display */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Activity size={14} className={getFPSColor()} />
                <span className="text-xs text-white/60 uppercase tracking-wider">FPS</span>
              </div>
              <div className={`px-2 py-0.5 rounded ${getFPSBgColor()}`}>
                <span className={`text-lg font-bold tabular-nums ${getFPSColor()}`}>
                  {currentFPS}
                </span>
              </div>
            </div>

            {/* Quality Mode */}
            <div className="flex items-center justify-between mb-2 pt-2 border-t border-white/10">
              <div className="flex items-center gap-2">
                <Gauge size={14} className="text-sky-400" />
                <span className="text-xs text-white/60 uppercase tracking-wider">Quality</span>
              </div>
              <span className="text-sm text-white/80 capitalize">
                {mode === 'auto' ? `Auto (${settings.textureQuality})` : settings.textureQuality}
              </span>
            </div>

            {/* Memory Usage (if available) */}
            {memoryUsage !== null && (
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <Cpu size={14} className="text-purple-400" />
                  <span className="text-xs text-white/60 uppercase tracking-wider">Memory</span>
                </div>
                <span className="text-sm text-white/80">{memoryUsage} MB</span>
              </div>
            )}

            {/* Geometry Info */}
            <div className="mt-2 pt-2 border-t border-white/10 text-[10px] text-white/40">
              Sphere: {settings.sphereSegments.width}×{settings.sphereSegments.height} segments
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
