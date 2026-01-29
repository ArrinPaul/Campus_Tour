/**
 * Onboarding & Tooltips Component
 * First-time user guide with interactive walkthrough
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronLeft,
  Mouse,
  Smartphone,
  Map,
  Keyboard,
  Camera,
  Bookmark,
  Settings,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  highlight?: string; // CSS selector to highlight
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right';
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Campus Virtual Tour! 🎓',
    description:
      'Explore our campus in stunning 360° panoramic views. This quick guide will show you how to navigate and use all the features.',
    icon: <Sparkles size={32} className="text-sky-400" />,
    position: 'center',
  },
  {
    id: 'navigation',
    title: 'Look Around',
    description:
      'Click and drag to look around in any direction. On mobile, simply swipe with your finger. Use pinch gestures or scroll wheel to zoom in and out.',
    icon: <Mouse size={32} className="text-sky-400" />,
    position: 'center',
  },
  {
    id: 'hotspots',
    title: 'Navigate Between Locations',
    description:
      'Look for glowing markers in the scene - click them to move to a new location. The arrows at the bottom also let you navigate between views.',
    icon: <ChevronRight size={32} className="text-sky-400" />,
    position: 'bottom',
  },
  {
    id: 'minimap',
    title: 'Mini-map & Full Map',
    description:
      'The mini-map in the corner shows your current location. Click it to open the full campus map where you can jump to any building instantly.',
    icon: <Map size={32} className="text-sky-400" />,
    position: 'right',
  },
  {
    id: 'keyboard',
    title: 'Keyboard Shortcuts',
    description:
      'Use arrow keys to rotate the view, +/- to zoom, F for fullscreen, M for map, and H for help. Press Escape to close any overlay.',
    icon: <Keyboard size={32} className="text-sky-400" />,
    position: 'center',
  },
  {
    id: 'bookmarks',
    title: 'Save Your Favorites',
    description:
      'Found a great view? Tap the heart icon to bookmark it. Access your saved places and recent history anytime from the bookmarks panel.',
    icon: <Bookmark size={32} className="text-sky-400" />,
    position: 'right',
  },
  {
    id: 'photo',
    title: 'Photo Mode',
    description:
      'Capture beautiful screenshots of the campus. Use the camera button to enter photo mode, frame your shot, and save or share it.',
    icon: <Camera size={32} className="text-sky-400" />,
    position: 'bottom',
  },
  {
    id: 'settings',
    title: 'Performance Settings',
    description:
      'If the tour feels slow, try lowering the graphics quality in settings. You can also enable the FPS counter to monitor performance.',
    icon: <Settings size={32} className="text-sky-400" />,
    position: 'left',
  },
  {
    id: 'help',
    title: "You're All Set! 🎉",
    description:
      'Press H anytime to see all controls, or click the help button for guidance. Enjoy exploring the campus!',
    icon: <HelpCircle size={32} className="text-sky-400" />,
    position: 'center',
  },
];

export const Onboarding: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Check if user has completed onboarding
  useEffect(() => {
    const completed = localStorage.getItem('onboarding-completed');
    if (completed !== 'true') {
      // Show onboarding after a short delay for first-time users
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Listen for manual trigger to show onboarding
  useEffect(() => {
    const handleShowOnboarding = () => {
      setCurrentStep(0);
      setIsVisible(true);
    };

    window.addEventListener('show-onboarding', handleShowOnboarding);
    return () => window.removeEventListener('show-onboarding', handleShowOnboarding);
  }, []);

  // Define handleComplete first since it's used by other callbacks
  const handleComplete = useCallback(() => {
    setIsVisible(false);
    localStorage.setItem('onboarding-completed', 'true');
  }, []);

  const handleSkip = useCallback(() => {
    handleComplete();
  }, [handleComplete]);

  const handleNext = useCallback(() => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  }, [currentStep, handleComplete]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  // Keyboard navigation
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'Escape') {
        handleSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, handleNext, handlePrevious, handleSkip]);

  const step = ONBOARDING_STEPS[currentStep];
  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleSkip} />

          {/* Content Card */}
          <motion.div
            key={step.id}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-lg mx-4"
          >
            <div className="bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              {/* Progress bar */}
              <div className="h-1 bg-white/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-sky-400 to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-4">
                <span className="text-sm text-white/40">
                  Step {currentStep + 1} of {ONBOARDING_STEPS.length}
                </span>
                <button
                  onClick={handleSkip}
                  className="text-sm text-white/40 hover:text-white transition-colors"
                >
                  Skip tour
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-8 text-center">
                <motion.div
                  key={`icon-${step.id}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
                  className="w-20 h-20 mx-auto mb-6 bg-sky-500/20 rounded-2xl flex items-center justify-center"
                >
                  {step.icon}
                </motion.div>

                <h2 className="text-2xl font-bold text-white mb-3">{step.title}</h2>
                <p className="text-white/60 leading-relaxed max-w-md mx-auto">{step.description}</p>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between px-6 pb-6">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    currentStep === 0
                      ? 'text-white/20 cursor-not-allowed'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <ChevronLeft size={18} />
                  Back
                </button>

                {/* Dots indicator */}
                <div className="flex items-center gap-2">
                  {ONBOARDING_STEPS.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentStep(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentStep
                          ? 'w-6 bg-sky-400'
                          : index < currentStep
                            ? 'bg-sky-400/50'
                            : 'bg-white/20'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
                >
                  {currentStep === ONBOARDING_STEPS.length - 1 ? "Let's Go!" : 'Next'}
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Mobile hint */}
            <div className="flex items-center justify-center gap-2 mt-4 text-white/30 text-sm">
              <Smartphone size={14} />
              <span>Works great on mobile too!</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Tooltip component for individual UI elements
interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
  delay = 500,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-[300] px-3 py-2 text-sm text-white bg-zinc-800 rounded-lg shadow-lg whitespace-nowrap pointer-events-none ${positionClasses[position]}`}
          >
            {content}
            {/* Arrow */}
            <div
              className={`absolute w-2 h-2 bg-zinc-800 rotate-45 ${
                position === 'top'
                  ? 'bottom-[-4px] left-1/2 -translate-x-1/2'
                  : position === 'bottom'
                    ? 'top-[-4px] left-1/2 -translate-x-1/2'
                    : position === 'left'
                      ? 'right-[-4px] top-1/2 -translate-y-1/2'
                      : 'left-[-4px] top-1/2 -translate-y-1/2'
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Button to restart onboarding
export const OnboardingTrigger: React.FC = () => {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent('show-onboarding'));
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
    >
      <Sparkles size={16} />
      Show Tour Guide
    </button>
  );
};

export default Onboarding;
