/**
 * QR Code Generator Component
 * Generate QR codes for current location sharing
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Download, Copy, Check, X, Share2, Smartphone, Settings } from 'lucide-react';
import { generateShareUrl, drawQRCode, downloadCanvasAsPng, shareUrl } from '../../utils/qrCode';

interface QRCodeOptions {
  size: number;
  fgColor: string;
  bgColor: string;
  includeCamera: boolean;
  includeLogo: boolean;
}

const DEFAULT_QR_OPTIONS: QRCodeOptions = {
  size: 256,
  fgColor: '#000000',
  bgColor: '#ffffff',
  includeCamera: true,
  includeLogo: false,
};

// QR Code Panel Component
interface QRCodePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodePanel: React.FC<QRCodePanelProps> = ({ isOpen, onClose }) => {
  const [options, setOptions] = useState<QRCodeOptions>(DEFAULT_QR_OPTIONS);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const currentShareUrl = generateShareUrl(options.includeCamera);

  // Draw QR code when options or URL change
  useEffect(() => {
    if (isOpen && canvasRef.current) {
      drawQRCode(canvasRef.current, currentShareUrl, {
        size: options.size,
        fgColor: options.fgColor,
        bgColor: options.bgColor,
      });
    }
  }, [isOpen, currentShareUrl, options.size, options.fgColor, options.bgColor]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    downloadCanvasAsPng(canvasRef.current, `campus-tour-qr-${Date.now()}.png`);
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(currentShareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error('Failed to copy URL');
    }
  };

  const handleShare = async () => {
    await shareUrl(
      currentShareUrl,
      'Campus Virtual Tour',
      'Check out this view from the campus tour!'
    );
  };

  const updateOption = <K extends keyof QRCodeOptions>(key: K, value: QRCodeOptions[K]) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  const sizePresets = [128, 256, 512];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-md bg-zinc-900/95 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-500/20 rounded-full">
                  <QrCode size={20} className="text-sky-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">QR Code</h2>
                  <p className="text-white/60 text-sm">Share this location</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} className="text-white/70" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* QR Code Display */}
              <div className="flex justify-center">
                <div className="p-4 bg-white rounded-2xl shadow-lg">
                  <canvas ref={canvasRef} className="rounded-lg" />
                </div>
              </div>

              {/* URL Display */}
              <div className="space-y-2">
                <label className="text-white/60 text-sm">Share URL</label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 truncate">
                    {currentShareUrl}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopyUrl}
                    className={`p-2 rounded-lg transition-colors ${
                      copied ? 'bg-green-500' : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                  </motion.button>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Settings size={14} />
                  Options
                </div>

                {/* Size Presets */}
                <div className="flex gap-2">
                  {sizePresets.map((size) => (
                    <button
                      key={size}
                      onClick={() => updateOption('size', size)}
                      className={`flex-1 py-2 rounded-lg text-sm transition-colors ${
                        options.size === size
                          ? 'bg-sky-500 text-white'
                          : 'bg-white/5 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      {size}px
                    </button>
                  ))}
                </div>

                {/* Include Camera Toggle */}
                <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Smartphone size={16} className="text-white/60" />
                    <span className="text-white text-sm">Include camera angle</span>
                  </div>
                  <button
                    onClick={() => updateOption('includeCamera', !options.includeCamera)}
                    className={`w-10 h-6 rounded-full transition-colors ${
                      options.includeCamera ? 'bg-sky-500' : 'bg-white/20'
                    }`}
                  >
                    <motion.div
                      className="w-4 h-4 bg-white rounded-full m-1"
                      animate={{ x: options.includeCamera ? 16 : 0 }}
                    />
                  </button>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownload}
                  className="py-3 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center gap-2 text-white transition-colors"
                >
                  <Download size={18} />
                  Download
                </motion.button>

                {'share' in navigator && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleShare}
                    className="py-3 bg-sky-500 hover:bg-sky-600 rounded-xl flex items-center justify-center gap-2 text-white transition-colors"
                  >
                    <Share2 size={18} />
                    Share
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// QR Code Button Component
export const QRCodeButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => setIsOpen(true)}
        className="fixed top-20 right-24 z-40 p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white/70 hover:text-white hover:bg-black/60 transition-all"
        title="Generate QR Code"
      >
        <QrCode size={20} />
      </motion.button>

      <QRCodePanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default QRCodePanel;
