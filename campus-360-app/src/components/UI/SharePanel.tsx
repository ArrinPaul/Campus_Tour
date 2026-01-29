/**
 * Share Panel Component
 * Enhanced sharing with deep links, QR codes, and embed options
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Share2,
  Link,
  Copy,
  Check,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  MessageCircle,
  Camera,
  X,
  ExternalLink,
} from 'lucide-react';
import { useDeepLink } from '../../hooks/useDeepLink';

interface SharePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SharePanel: React.FC<SharePanelProps> = ({ isOpen, onClose }) => {
  const { getShareableUrl, copyShareableUrl, shareUrl } = useDeepLink();
  const [copied, setCopied] = useState(false);
  const [includeCamera, setIncludeCamera] = useState(true);

  const shareableUrl = getShareableUrl(includeCamera);

  const handleCopy = useCallback(async () => {
    const success = await copyShareableUrl(includeCamera);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [copyShareableUrl, includeCamera]);

  const handleNativeShare = useCallback(async () => {
    await shareUrl('Campus Virtual Tour', 'Check out this amazing view!');
  }, [shareUrl]);

  const socialLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-[#1DA1F2]',
      getUrl: () =>
        `https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out this virtual campus tour!')}&url=${encodeURIComponent(shareableUrl)}`,
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-[#4267B2]',
      getUrl: () =>
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareableUrl)}`,
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-[#0077B5]',
      getUrl: () =>
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareableUrl)}`,
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-[#25D366]',
      getUrl: () =>
        `https://wa.me/?text=${encodeURIComponent('Check out this virtual campus tour! ' + shareableUrl)}`,
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'bg-gray-600',
      getUrl: () =>
        `mailto:?subject=${encodeURIComponent('Campus Virtual Tour')}&body=${encodeURIComponent('Check out this amazing view!\n\n' + shareableUrl)}`,
    },
  ];

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
            className="w-full max-w-md bg-zinc-900/95 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-500/20 rounded-full">
                  <Share2 size={20} className="text-sky-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Share This View</h2>
                  <p className="text-white/60 text-sm">Share your current location</p>
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
              {/* Include Camera Toggle */}
              <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <Camera size={18} className="text-white/70" />
                  <div>
                    <span className="text-white text-sm">Include camera angle</span>
                    <p className="text-white/50 text-xs">Share exact view position</p>
                  </div>
                </div>
                <button
                  onClick={() => setIncludeCamera(!includeCamera)}
                  className={`w-10 h-6 rounded-full transition-colors ${
                    includeCamera ? 'bg-sky-500' : 'bg-white/20'
                  }`}
                >
                  <motion.div
                    className="w-4 h-4 bg-white rounded-full m-1"
                    animate={{ x: includeCamera ? 16 : 0 }}
                  />
                </button>
              </label>

              {/* URL Display */}
              <div className="space-y-2">
                <label className="text-white/70 text-sm flex items-center gap-2">
                  <Link size={14} />
                  Shareable Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareableUrl}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-sky-500/50"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopy}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                      copied ? 'bg-green-500 text-white' : 'bg-sky-500 hover:bg-sky-600 text-white'
                    }`}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </motion.button>
                </div>
              </div>

              {/* Native Share Button (Mobile) */}
              {'share' in navigator && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNativeShare}
                  className="w-full py-3 bg-gradient-to-r from-sky-500 to-purple-500 rounded-xl text-white font-medium flex items-center justify-center gap-2"
                >
                  <ExternalLink size={18} />
                  Share via...
                </motion.button>
              )}

              {/* Social Share Buttons */}
              <div className="space-y-2">
                <label className="text-white/70 text-sm">Share on social media</label>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.name}
                      href={social.getUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-3 ${social.color} rounded-xl text-white transition-opacity hover:opacity-90`}
                      title={`Share on ${social.name}`}
                    >
                      <social.icon size={20} />
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Share Button Component
export const ShareButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => setIsOpen(true)}
        className="fixed top-20 right-20 z-40 p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white/70 hover:text-white hover:bg-black/60 transition-all"
        title="Share this view"
      >
        <Share2 size={20} />
      </motion.button>

      <SharePanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default SharePanel;
