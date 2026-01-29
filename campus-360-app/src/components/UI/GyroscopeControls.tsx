/**
 * Gyroscope Controls Component
 * UI for enabling/disabling gyroscope and device motion controls
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, RotateCcw, AlertCircle, Check, X, Move } from 'lucide-react';
import { useDeviceMotion } from '../../hooks/useDeviceMotion';

export const GyroscopeControls: React.FC = () => {
  const { isSupported, isEnabled, hasPermission, requestPermission, enable, disable, recenter } =
    useDeviceMotion();

  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
  const [showRecenterHint, setShowRecenterHint] = useState(false);
  const wasEnabledRef = useRef(false);

  // Show recenter hint after enabling - track with effect + ref
  useEffect(() => {
    if (isEnabled && !wasEnabledRef.current) {
      wasEnabledRef.current = true;
      // Use requestAnimationFrame to defer setState outside the synchronous effect body
      const showTimer = requestAnimationFrame(() => {
        setShowRecenterHint(true);
      });
      const hideTimer = setTimeout(() => setShowRecenterHint(false), 3000);
      return () => {
        cancelAnimationFrame(showTimer);
        clearTimeout(hideTimer);
      };
    } else if (!isEnabled) {
      wasEnabledRef.current = false;
    }
  }, [isEnabled]);

  // Don't render if not supported
  if (!isSupported) {
    return null;
  }

  const handleToggle = async () => {
    if (isEnabled) {
      disable();
    } else {
      // Check if permission is needed
      if (hasPermission === null || hasPermission === false) {
        setShowPermissionPrompt(true);
      } else {
        await enable();
      }
    }
  };

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    if (granted) {
      await enable();
    }
    setShowPermissionPrompt(false);
  };

  return (
    <>
      {/* Gyroscope Toggle Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        onClick={handleToggle}
        className={`fixed bottom-32 right-6 z-40 p-3 backdrop-blur-md rounded-full border transition-all ${
          isEnabled
            ? 'bg-sky-500/20 border-sky-500/50 text-sky-400'
            : 'bg-black/40 border-white/10 text-white/70 hover:text-white hover:bg-black/60'
        }`}
        title={isEnabled ? 'Disable gyroscope' : 'Enable gyroscope'}
      >
        <motion.div
          animate={isEnabled ? { rotate: [0, 10, -10, 0] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Smartphone size={20} />
        </motion.div>
      </motion.button>

      {/* Recenter Button (only when gyro is enabled) */}
      <AnimatePresence>
        {isEnabled && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onClick={recenter}
            className="fixed bottom-32 right-20 z-40 p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white/70 hover:text-white hover:bg-black/60 transition-all"
            title="Recenter view"
          >
            <RotateCcw size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Recenter Hint Toast */}
      <AnimatePresence>
        {showRecenterHint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-44 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-black/80 backdrop-blur-md rounded-lg text-white text-sm"
          >
            <Move size={14} className="text-sky-400" />
            <span>Move your device to look around</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Permission Prompt Modal */}
      <AnimatePresence>
        {showPermissionPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setShowPermissionPrompt(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-zinc-900/90 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 text-center border-b border-white/10">
                <div className="w-16 h-16 mx-auto mb-4 bg-sky-500/20 rounded-full flex items-center justify-center">
                  <Smartphone size={32} className="text-sky-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Enable Gyroscope</h3>
                <p className="text-white/60 text-sm">
                  Move your device to look around the virtual tour. This requires access to your
                  device's motion sensors.
                </p>
              </div>

              {/* Info */}
              <div className="p-4 bg-amber-500/10 border-b border-white/10 flex items-start gap-3">
                <AlertCircle size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-amber-200/80 text-sm">
                  Your device will ask for permission. Tap "Allow" to enable gyroscope controls.
                </p>
              </div>

              {/* Actions */}
              <div className="p-4 flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowPermissionPrompt(false)}
                  className="flex-1 py-3 bg-white/10 rounded-xl text-white/70 hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                >
                  <X size={18} />
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRequestPermission}
                  className="flex-1 py-3 bg-sky-500 rounded-xl text-white hover:bg-sky-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Check size={18} />
                  Enable
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GyroscopeControls;
