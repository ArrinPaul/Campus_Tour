/**
 * Responsive Layout Wrapper Component
 * Optimizes UI layout for landscape/portrait and different device sizes
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Maximize2 } from 'lucide-react';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  showOrientationHint?: boolean;
  preferredOrientation?: 'landscape' | 'portrait' | 'any';
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  showOrientationHint = true,
  preferredOrientation = 'landscape',
}) => {
  const { orientation, isMobile, isTablet, isSmallScreen, isTouchDevice } = useResponsiveLayout();

  const shouldShowHint =
    showOrientationHint &&
    (isMobile || isTablet) &&
    preferredOrientation !== 'any' &&
    orientation !== preferredOrientation;

  // Add body classes for global CSS targeting
  useEffect(() => {
    document.body.classList.toggle('is-mobile', isMobile);
    document.body.classList.toggle('is-tablet', isTablet);
    document.body.classList.toggle('is-small-screen', isSmallScreen);
    document.body.classList.toggle('is-touch-device', isTouchDevice);
    document.body.classList.toggle('is-landscape', orientation === 'landscape');
    document.body.classList.toggle('is-portrait', orientation === 'portrait');

    return () => {
      document.body.classList.remove(
        'is-mobile',
        'is-tablet',
        'is-small-screen',
        'is-touch-device',
        'is-landscape',
        'is-portrait'
      );
    };
  }, [isMobile, isTablet, isSmallScreen, isTouchDevice, orientation]);

  return (
    <>
      {children}

      {/* Orientation Hint Overlay */}
      <AnimatePresence>
        {shouldShowHint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="text-center max-w-xs"
            >
              {/* Animated phone rotation icon */}
              <motion.div
                animate={{ rotate: preferredOrientation === 'landscape' ? 90 : -90 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut',
                }}
                className="w-24 h-24 mx-auto mb-6 border-4 border-white/50 rounded-2xl flex items-center justify-center"
              >
                <div className="w-4 h-4 bg-white/50 rounded-full absolute -top-2" />
                <RotateCcw size={32} className="text-white/70" />
              </motion.div>

              <h3 className="text-xl font-semibold text-white mb-3">
                {preferredOrientation === 'landscape'
                  ? 'Rotate for Best Experience'
                  : 'Portrait Mode Recommended'}
              </h3>

              <p className="text-white/60 text-sm mb-6">
                {preferredOrientation === 'landscape'
                  ? 'Rotate your device to landscape orientation for the best virtual tour experience.'
                  : 'Rotate your device to portrait orientation for optimal viewing.'}
              </p>

              {/* Dismiss button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  // Store preference to not show again this session
                  sessionStorage.setItem('orientation-hint-dismissed', 'true');
                }}
                className="px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-white/70 hover:text-white hover:bg-white/20 transition-colors text-sm"
              >
                Continue Anyway
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Mobile-optimized control bar positions
export const MobileUIPositions: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSmallScreen, orientation } = useResponsiveLayout();

  if (!isSmallScreen) {
    return <>{children}</>;
  }

  // In landscape mode on mobile, push controls to sides
  if (orientation === 'landscape') {
    return (
      <div className="mobile-landscape-layout">
        <style>{`
          .mobile-landscape-layout .bottom-controls {
            left: auto !important;
            right: 1rem !important;
            bottom: 50% !important;
            transform: translateY(50%) !important;
            flex-direction: column !important;
          }
          .mobile-landscape-layout .top-bar {
            top: 0.5rem !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
          }
          .mobile-landscape-layout .mini-map {
            bottom: 0.5rem !important;
            left: 0.5rem !important;
            transform: scale(0.8) !important;
            transform-origin: bottom left !important;
          }
        `}</style>
        {children}
      </div>
    );
  }

  // Portrait mode - stack controls at bottom
  return (
    <div className="mobile-portrait-layout">
      <style>{`
        .mobile-portrait-layout .bottom-controls {
          bottom: 1rem !important;
          padding-bottom: env(safe-area-inset-bottom, 0) !important;
        }
        .mobile-portrait-layout .nav-arrows {
          bottom: 5rem !important;
        }
        .mobile-portrait-layout .mini-map {
          top: 4rem !important;
          bottom: auto !important;
          right: 0.5rem !important;
          left: auto !important;
          transform: scale(0.7) !important;
          transform-origin: top right !important;
        }
      `}</style>
      {children}
    </div>
  );
};

// Fullscreen button for mobile
export const FullscreenButton: React.FC = () => {
  const { isTouchDevice } = useResponsiveLayout();
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.warn('Fullscreen not supported:', err);
    }
  };

  // Only show on touch devices
  if (!isTouchDevice) return null;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.7 }}
      onClick={toggleFullscreen}
      className={`fixed bottom-32 left-6 z-40 p-3 backdrop-blur-md rounded-full border transition-all ${
        isFullscreen
          ? 'bg-green-500/20 border-green-500/50 text-green-400'
          : 'bg-black/40 border-white/10 text-white/70 hover:text-white hover:bg-black/60'
      }`}
      title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
    >
      <Maximize2 size={20} />
    </motion.button>
  );
};

export default ResponsiveLayout;
