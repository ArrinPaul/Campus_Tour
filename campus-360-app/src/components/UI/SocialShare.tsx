import React from 'react';
import { Facebook, Twitter, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * @interface SocialShareProps
 * @property {string} shareUrl - The URL to be shared.
 * @property {string} shareTitle - The title/text to accompany the shared URL.
 */
interface SocialShareProps {
  shareUrl: string;
  shareTitle: string;
}

/**
 * SocialShare component provides buttons for sharing the virtual tour on various social media platforms.
 * It currently supports Facebook, Twitter, and LinkedIn.
 *
 * @param {SocialShareProps} props - The props for the SocialShare component.
 * @returns {React.FC} A functional component displaying social media sharing buttons.
 */
export const SocialShare: React.FC<SocialShareProps> = ({ shareUrl, shareTitle }) => {
  const encodedShareUrl = encodeURIComponent(shareUrl);
  const encodedShareTitle = encodeURIComponent(shareTitle);

  /**
   * Opens a new window to share the URL on Facebook.
   */
  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`, '_blank');
  };

  /**
   * Opens a new window to share the URL and title on Twitter.
   */
  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodedShareUrl}&text=${encodedShareTitle}`,
      '_blank'
    );
  };

  /**
   * Opens a new window to share the article on LinkedIn.
   */
  const shareOnLinkedin = () => {
    window.open(
      `https://www.linkedin.com/shareArticle?mini=true&url=${encodedShareUrl}&title=${encodedShareTitle}`,
      '_blank'
    );
  };

  return (
    <div className="flex gap-2">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={shareOnFacebook}
        className="p-1.5 rounded-full bg-white/10 hover:bg-blue-600 text-white transition-all"
        aria-label="Share on Facebook"
      >
        <Facebook size={16} />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={shareOnTwitter}
        className="p-1.5 rounded-full bg-white/10 hover:bg-sky-500 text-white transition-all"
        aria-label="Share on Twitter"
      >
        <Twitter size={16} />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={shareOnLinkedin}
        className="p-1.5 rounded-full bg-white/10 hover:bg-blue-700 text-white transition-all"
        aria-label="Share on LinkedIn"
      >
        <Linkedin size={16} />
      </motion.button>
    </div>
  );
};
