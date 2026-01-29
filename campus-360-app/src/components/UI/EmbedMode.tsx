/**
 * Embed Mode Component
 * iframe support for embedding the tour on external websites
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Copy, Check, X, ExternalLink, Settings, Eye } from 'lucide-react';
import { generateEmbedCode } from '../../hooks/useEmbedMode';

// Note: Import useEmbedMode directly from '../../hooks/useEmbedMode' where needed

interface EmbedOptions {
  width: string;
  height: string;
  showControls: boolean;
  showNavigation: boolean;
  autoplay: boolean;
  responsive: boolean;
}

const DEFAULT_EMBED_OPTIONS: EmbedOptions = {
  width: '800',
  height: '600',
  showControls: true,
  showNavigation: true,
  autoplay: false,
  responsive: true,
};

// Embed Code Generator Panel
interface EmbedPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmbedPanel: React.FC<EmbedPanelProps> = ({ isOpen, onClose }) => {
  const [options, setOptions] = useState<EmbedOptions>(DEFAULT_EMBED_OPTIONS);
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const embedCode = generateEmbedCode(options);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error('Failed to copy embed code');
    }
  };

  const updateOption = <K extends keyof EmbedOptions>(key: K, value: EmbedOptions[K]) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

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
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-2xl bg-zinc-900/95 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-full">
                  <Code size={20} className="text-purple-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Embed Tour</h2>
                  <p className="text-white/60 text-sm">Add this tour to your website</p>
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
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Options */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <Settings size={14} />
                  Embed Options
                </div>

                {/* Responsive Toggle */}
                <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <div>
                    <span className="text-white text-sm">Responsive</span>
                    <p className="text-white/50 text-xs">Auto-resize to container</p>
                  </div>
                  <button
                    onClick={() => updateOption('responsive', !options.responsive)}
                    className={`w-10 h-6 rounded-full transition-colors ${
                      options.responsive ? 'bg-sky-500' : 'bg-white/20'
                    }`}
                  >
                    <motion.div
                      className="w-4 h-4 bg-white rounded-full m-1"
                      animate={{ x: options.responsive ? 16 : 0 }}
                    />
                  </button>
                </label>

                {/* Fixed Size Options */}
                {!options.responsive && (
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-1">
                      <label className="text-white/60 text-xs">Width (px)</label>
                      <input
                        type="number"
                        value={options.width}
                        onChange={(e) => updateOption('width', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-sky-500/50"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="text-white/60 text-xs">Height (px)</label>
                      <input
                        type="number"
                        value={options.height}
                        onChange={(e) => updateOption('height', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-sky-500/50"
                      />
                    </div>
                  </div>
                )}

                {/* Show Controls */}
                <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <span className="text-white text-sm">Show controls</span>
                  <button
                    onClick={() => updateOption('showControls', !options.showControls)}
                    className={`w-10 h-6 rounded-full transition-colors ${
                      options.showControls ? 'bg-sky-500' : 'bg-white/20'
                    }`}
                  >
                    <motion.div
                      className="w-4 h-4 bg-white rounded-full m-1"
                      animate={{ x: options.showControls ? 16 : 0 }}
                    />
                  </button>
                </label>

                {/* Show Navigation */}
                <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <span className="text-white text-sm">Show navigation</span>
                  <button
                    onClick={() => updateOption('showNavigation', !options.showNavigation)}
                    className={`w-10 h-6 rounded-full transition-colors ${
                      options.showNavigation ? 'bg-sky-500' : 'bg-white/20'
                    }`}
                  >
                    <motion.div
                      className="w-4 h-4 bg-white rounded-full m-1"
                      animate={{ x: options.showNavigation ? 16 : 0 }}
                    />
                  </button>
                </label>

                {/* Autoplay */}
                <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <span className="text-white text-sm">Autoplay guided tour</span>
                  <button
                    onClick={() => updateOption('autoplay', !options.autoplay)}
                    className={`w-10 h-6 rounded-full transition-colors ${
                      options.autoplay ? 'bg-sky-500' : 'bg-white/20'
                    }`}
                  >
                    <motion.div
                      className="w-4 h-4 bg-white rounded-full m-1"
                      animate={{ x: options.autoplay ? 16 : 0 }}
                    />
                  </button>
                </label>
              </div>

              {/* Embed Code */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-white/70 text-sm flex items-center gap-2">
                    <Code size={14} />
                    Embed Code
                  </label>
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1"
                  >
                    <Eye size={12} />
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                  </button>
                </div>
                <div className="relative">
                  <pre className="bg-zinc-800 rounded-xl p-4 text-sm text-green-400 overflow-x-auto whitespace-pre-wrap break-all font-mono">
                    {embedCode}
                  </pre>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCopy}
                  className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-colors ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-purple-500 hover:bg-purple-600 text-white'
                  }`}
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  {copied ? 'Copied to clipboard!' : 'Copy embed code'}
                </motion.button>
              </div>

              {/* Preview */}
              <AnimatePresence>
                {showPreview && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-2 overflow-hidden"
                  >
                    <label className="text-white/70 text-sm">Preview</label>
                    <div
                      className="bg-zinc-800 rounded-xl p-4"
                      style={{ aspectRatio: options.responsive ? '16/9' : 'auto' }}
                    >
                      <div className="w-full h-full bg-zinc-700 rounded-lg flex items-center justify-center text-white/50 text-sm">
                        <div className="text-center">
                          <ExternalLink size={32} className="mx-auto mb-2 opacity-50" />
                          <p>Tour preview would appear here</p>
                          <p className="text-xs mt-1 text-white/30">
                            {options.responsive
                              ? 'Responsive (16:9)'
                              : `${options.width}×${options.height}px`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Embed Button Component
export const EmbedButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.55 }}
        onClick={() => setIsOpen(true)}
        className="fixed top-20 right-36 z-40 p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white/70 hover:text-white hover:bg-black/60 transition-all"
        title="Embed this tour"
      >
        <Code size={20} />
      </motion.button>

      <EmbedPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

// Embed mode styles (can be added to CSS)
export const EmbedModeStyles = `
  body.is-embedded .top-bar,
  body.is-embedded .bottom-controls,
  body.is-embedded .sidebar {
    display: none !important;
  }

  body.is-embedded[data-controls="true"] .bottom-controls {
    display: flex !important;
  }

  body.is-embedded[data-nav="true"] .nav-arrows {
    display: flex !important;
  }
`;

export default EmbedPanel;
