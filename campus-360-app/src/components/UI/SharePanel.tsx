/**
 * Share Panel Component
 * Enhanced sharing with deep links, social media, and copy link functionality
 * Similar to social media share dialogs
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Share2,
  Link,
  Copy,
  Check,
  X,
  ExternalLink,
  Camera,
} from 'lucide-react';
import { useDeepLink } from '../../hooks/useDeepLink';

// Social media icons as custom SVG components for better brand accuracy
const TwitterXIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

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
      setTimeout(() => setCopied(false), 2500);
    }
  }, [copyShareableUrl, includeCamera]);

  const handleNativeShare = useCallback(async () => {
    await shareUrl('Campus Virtual Tour', 'Check out this amazing virtual campus tour!');
  }, [shareUrl]);

  const socialLinks = [
    {
      name: 'X',
      icon: TwitterXIcon,
      color: 'bg-black hover:bg-zinc-800',
      getUrl: () =>
        `https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out this virtual campus tour!')}&url=${encodeURIComponent(shareableUrl)}`,
    },
    {
      name: 'Facebook',
      icon: FacebookIcon,
      color: 'bg-[#1877F2] hover:bg-[#166FE5]',
      getUrl: () =>
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareableUrl)}`,
    },
    {
      name: 'LinkedIn',
      icon: LinkedInIcon,
      color: 'bg-[#0A66C2] hover:bg-[#004182]',
      getUrl: () =>
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareableUrl)}`,
    },
    {
      name: 'WhatsApp',
      icon: WhatsAppIcon,
      color: 'bg-[#25D366] hover:bg-[#128C7E]',
      getUrl: () =>
        `https://wa.me/?text=${encodeURIComponent('Check out this virtual campus tour! ' + shareableUrl)}`,
    },
    {
      name: 'Telegram',
      icon: TelegramIcon,
      color: 'bg-[#0088cc] hover:bg-[#006699]',
      getUrl: () =>
        `https://t.me/share/url?url=${encodeURIComponent(shareableUrl)}&text=${encodeURIComponent('Check out this virtual campus tour!')}`,
    },
    {
      name: 'Email',
      icon: EmailIcon,
      color: 'bg-zinc-600 hover:bg-zinc-500',
      getUrl: () =>
        `mailto:?subject=${encodeURIComponent('Campus Virtual Tour')}&body=${encodeURIComponent('Check out this amazing virtual campus tour!\n\n' + shareableUrl)}`,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-[95%] xs:max-w-sm sm:max-w-md bg-zinc-900/95 backdrop-blur-xl rounded-t-2xl sm:rounded-2xl border border-white/10 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-3 xs:p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 xs:gap-3">
                <div className="p-1.5 xs:p-2 bg-sky-500/20 rounded-lg xs:rounded-xl">
                  <Share2 className="w-4 h-4 xs:w-[18px] xs:h-[18px] text-sky-400" />
                </div>
                <div>
                  <h2 className="text-sm xs:text-base font-semibold text-white">Share</h2>
                  <p className="text-white/50 text-[10px] xs:text-xs">Share this virtual tour view</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 xs:p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-4 h-4 xs:w-[18px] xs:h-[18px] text-white/70" />
              </button>
            </div>

            {/* Content */}
            <div className="p-3 xs:p-4 sm:p-5 space-y-3 xs:space-y-4 sm:space-y-5">
              {/* Social Share Grid */}
              <div>
                <p className="text-white/60 text-[10px] xs:text-xs font-medium mb-2 xs:mb-3 uppercase tracking-wide">Share to</p>
                <div className="grid grid-cols-6 gap-1.5 xs:gap-2">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.name}
                      href={social.getUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex flex-col items-center gap-1 xs:gap-1.5 p-2 xs:p-2.5 sm:p-3 ${social.color} rounded-lg xs:rounded-xl text-white transition-all`}
                      title={`Share on ${social.name}`}
                    >
                      <social.icon />
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Native Share Button (Mobile) */}
              {'share' in navigator && (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleNativeShare}
                  className="w-full py-2.5 xs:py-3 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-lg xs:rounded-xl text-white text-sm xs:text-base font-medium flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4 xs:w-[18px] xs:h-[18px]" />
                  More sharing options...
                </motion.button>
              )}

              {/* Include Camera Toggle */}
              <label className="flex items-center justify-between p-2.5 xs:p-3 bg-white/5 rounded-lg xs:rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-2 xs:gap-3">
                  <Camera className="w-4 h-4 xs:w-[16px] xs:h-[16px] text-white/60" />
                  <div>
                    <span className="text-white text-xs xs:text-sm">Include camera angle</span>
                    <p className="text-white/40 text-[10px] xs:text-xs">Share your exact view position</p>
                  </div>
                </div>
                <button
                  onClick={() => setIncludeCamera(!includeCamera)}
                  className={`w-9 h-5 xs:w-11 xs:h-6 rounded-full transition-colors ${
                    includeCamera ? 'bg-sky-500' : 'bg-white/20'
                  }`}
                >
                  <motion.div
                    className="w-4 h-4 xs:w-5 xs:h-5 bg-white rounded-full shadow-md"
                    animate={{ x: includeCamera ? 17 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </label>

              {/* Copy Link Section */}
              <div>
                <p className="text-white/60 text-[10px] xs:text-xs font-medium mb-1.5 xs:mb-2 uppercase tracking-wide flex items-center gap-1 xs:gap-1.5">
                  <Link className="w-3 h-3 xs:w-3.5 xs:h-3.5" />
                  Or copy link
                </p>
                <div className="flex gap-1.5 xs:gap-2">
                  <div className="flex-1 bg-white/5 border border-white/10 rounded-lg xs:rounded-xl px-2 xs:px-3 py-2 xs:py-2.5 overflow-hidden">
                    <p className="text-white/70 text-[10px] xs:text-xs sm:text-sm truncate font-mono">{shareableUrl}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopy}
                    className={`px-2.5 xs:px-3 sm:px-4 rounded-lg xs:rounded-xl flex items-center gap-1.5 xs:gap-2 font-medium transition-all ${
                      copied
                        ? 'bg-green-500 text-white'
                        : 'bg-sky-500 hover:bg-sky-400 text-white'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
                        <span className="text-xs xs:text-sm hidden xs:inline">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
                        <span className="text-xs xs:text-sm hidden xs:inline">Copy</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Mobile swipe indicator */}
            <div className="sm:hidden pb-3 xs:pb-4 flex justify-center">
              <div className="w-8 xs:w-10 h-1 rounded-full bg-white/20" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SharePanel;
