/**
 * Screenshot/Photo Mode Component
 * Captures the current 360° view without UI elements
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Download, X, Share2, Check, Copy } from 'lucide-react';
import { useTourState } from '../../hooks/useTourState';

interface ScreenshotModeProps {
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

export const ScreenshotMode: React.FC<ScreenshotModeProps> = () => {
  const [isPhotoMode, setIsPhotoMode] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const { currentBlockId, currentImageId, manifest } = useTourState();

  // Get current location name for filename
  const getLocationName = useCallback(() => {
    if (!manifest || !currentBlockId || !currentImageId) return 'campus-tour';
    const block = manifest.blocks.find((b) => b.id === currentBlockId);
    const lab = block?.labs?.find((l) => l.id === currentImageId);
    const blockName = block?.name || block?.label || currentBlockId;
    const labName = lab?.name || currentImageId;
    return `${blockName}-${labName}`.replace(/\s+/g, '-').toLowerCase();
  }, [manifest, currentBlockId, currentImageId]);

  // Capture the canvas
  const captureScreenshot = useCallback(async () => {
    setIsCapturing(true);

    // Small delay to ensure UI is hidden
    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      // Find the canvas element
      const canvas = document.querySelector('canvas');
      if (!canvas) {
        console.error('Canvas not found');
        setIsCapturing(false);
        return;
      }

      // Get the image data
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      setCapturedImage(dataUrl);
    } catch (error) {
      console.error('Failed to capture screenshot:', error);
    }

    setIsCapturing(false);
  }, []);

  // Download the captured image
  const downloadImage = useCallback(() => {
    if (!capturedImage) return;

    const link = document.createElement('a');
    link.href = capturedImage;
    link.download = `${getLocationName()}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [capturedImage, getLocationName]);

  // Copy image to clipboard
  const copyToClipboard = useCallback(async () => {
    if (!capturedImage) return;

    try {
      // Convert data URL to blob
      const response = await fetch(capturedImage);
      const blob = await response.blob();

      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);

      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  }, [capturedImage]);

  // Share the image (if supported)
  const shareImage = useCallback(async () => {
    if (!capturedImage || !navigator.share) return;

    try {
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      const file = new File([blob], `${getLocationName()}.png`, { type: 'image/png' });

      await navigator.share({
        title: 'Campus Virtual Tour',
        text: 'Check out this view from the virtual campus tour!',
        files: [file],
      });
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Failed to share:', error);
      }
    }
  }, [capturedImage, getLocationName]);

  // Enter photo mode
  const enterPhotoMode = () => {
    setIsPhotoMode(true);
    setCapturedImage(null);
  };

  // Exit photo mode
  const exitPhotoMode = () => {
    setIsPhotoMode(false);
    setCapturedImage(null);
  };

  return (
    <>
      {/* Camera Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        onClick={enterPhotoMode}
        className="fixed bottom-6 right-24 z-40 p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white/70 hover:text-white hover:bg-black/60 transition-all group"
        title="Photo Mode"
      >
        <Camera size={20} className="group-hover:scale-110 transition-transform" />
      </motion.button>

      {/* Photo Mode Overlay */}
      <AnimatePresence>
        {isPhotoMode && !capturedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100]"
          >
            {/* Viewfinder frame */}
            <div className="absolute inset-4 border-2 border-white/30 rounded-lg pointer-events-none">
              {/* Corner marks */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white" />

              {/* Center crosshair */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-6 h-px bg-white/50" />
                <div className="w-px h-6 bg-white/50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exitPhotoMode}
                className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
              >
                <X size={24} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={captureScreenshot}
                disabled={isCapturing}
                className="p-6 bg-white rounded-full text-black hover:bg-white/90 transition-colors disabled:opacity-50"
              >
                {isCapturing ? (
                  <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera size={32} />
                )}
              </motion.button>
              <div className="w-12" /> {/* Spacer for symmetry */}
            </div>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-8 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full"
            >
              <p className="text-white text-sm">Adjust your view and tap the camera to capture</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Captured Image Preview */}
      <AnimatePresence>
        {capturedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={exitPhotoMode}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full"
            >
              {/* Image */}
              <img
                src={capturedImage}
                alt="Captured view"
                className="w-full rounded-lg shadow-2xl"
              />

              {/* Actions */}
              <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={downloadImage}
                  className="flex items-center gap-2 px-4 py-2 bg-sky-500 rounded-full text-white font-medium hover:bg-sky-600 transition-colors"
                >
                  <Download size={18} />
                  Download
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
                >
                  {showCopied ? <Check size={18} /> : <Copy size={18} />}
                  {showCopied ? 'Copied!' : 'Copy'}
                </motion.button>

                {'share' in navigator && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={shareImage}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
                  >
                    <Share2 size={18} />
                    Share
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCapturedImage(null)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
                >
                  <Camera size={18} />
                  Retake
                </motion.button>
              </div>

              {/* Close button */}
              <button
                onClick={exitPhotoMode}
                className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ScreenshotMode;
