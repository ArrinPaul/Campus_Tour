/**
 * Custom Cursor Component
 * Context-aware cursor that changes based on what the user is hovering over
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';

type CursorState =
  | 'default'
  | 'pointer'
  | 'grab'
  | 'grabbing'
  | 'zoom-in'
  | 'zoom-out'
  | 'move'
  | 'hotspot'
  | 'info'
  | 'loading';

interface CursorStyle {
  size: number;
  color: string;
  borderColor: string;
  icon?: React.ReactNode;
  scale?: number;
  blur?: number;
}

const CURSOR_STYLES: Record<CursorState, CursorStyle> = {
  default: {
    size: 20,
    color: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  pointer: {
    size: 40,
    color: 'rgba(56, 189, 248, 0.2)',
    borderColor: 'rgba(56, 189, 248, 0.8)',
    scale: 1.2,
  },
  grab: {
    size: 30,
    color: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  grabbing: {
    size: 25,
    color: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.8)',
    scale: 0.9,
  },
  'zoom-in': {
    size: 50,
    color: 'rgba(34, 197, 94, 0.2)',
    borderColor: 'rgba(34, 197, 94, 0.8)',
  },
  'zoom-out': {
    size: 50,
    color: 'rgba(239, 68, 68, 0.2)',
    borderColor: 'rgba(239, 68, 68, 0.8)',
  },
  move: {
    size: 40,
    color: 'rgba(255, 255, 255, 0.15)',
    borderColor: 'rgba(255, 255, 255, 0.7)',
  },
  hotspot: {
    size: 60,
    color: 'rgba(56, 189, 248, 0.15)',
    borderColor: 'rgba(56, 189, 248, 0.9)',
    scale: 1,
    blur: 8,
  },
  info: {
    size: 50,
    color: 'rgba(168, 85, 247, 0.2)',
    borderColor: 'rgba(168, 85, 247, 0.8)',
  },
  loading: {
    size: 40,
    color: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
};

// CSS selectors that trigger cursor states
const CURSOR_TRIGGERS: Record<string, CursorState> = {
  '[data-cursor="pointer"]': 'pointer',
  '[data-cursor="grab"]': 'grab',
  '[data-cursor="zoom-in"]': 'zoom-in',
  '[data-cursor="zoom-out"]': 'zoom-out',
  '[data-cursor="hotspot"]': 'hotspot',
  '[data-cursor="info"]': 'info',
  button: 'pointer',
  a: 'pointer',
  '[role="button"]': 'pointer',
  '.hotspot': 'hotspot',
  '.poi-marker': 'info',
  '.clickable': 'pointer',
};

export const CustomCursor: React.FC = () => {
  const { isTouchDevice } = useResponsiveLayout();
  const [cursorState, setCursorState] = useState<CursorState>('default');
  const [isVisible, setIsVisible] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  // Smooth cursor position
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 400 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  // Update cursor position
  const updateCursorPosition = useCallback(
    (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    },
    [cursorX, cursorY]
  );

  // Detect what the cursor is hovering over
  const detectCursorState = useCallback((target: EventTarget | null) => {
    if (!target || !(target instanceof Element)) {
      setCursorState('default');
      return;
    }

    // Check each trigger selector
    for (const [selector, state] of Object.entries(CURSOR_TRIGGERS)) {
      if (target.matches(selector) || target.closest(selector)) {
        setCursorState(state);
        return;
      }
    }

    setCursorState('default');
  }, []);

  // Handle mouse events
  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      updateCursorPosition(e);
      if (!isDragging) {
        detectCursorState(e.target);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      // Check if it's on the canvas/viewer
      const target = e.target as Element;
      if (target.tagName === 'CANVAS' || target.closest('.panorama-viewer')) {
        setCursorState('grabbing');
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isTouchDevice, isDragging, updateCursorPosition, detectCursorState]);

  // Hide native cursor
  useEffect(() => {
    if (isTouchDevice) return;

    document.body.style.cursor = 'none';

    // Also hide cursor on all clickable elements
    const style = document.createElement('style');
    style.id = 'custom-cursor-style';
    style.textContent = `
      *, *::before, *::after {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.body.style.cursor = '';
      const existingStyle = document.getElementById('custom-cursor-style');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [isTouchDevice]);

  // Don't render on touch devices
  if (isTouchDevice) return null;

  const style = CURSOR_STYLES[cursorState];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={cursorRef}
          className="fixed pointer-events-none z-[9999] mix-blend-difference"
          style={{
            x: smoothX,
            y: smoothY,
            translateX: '-50%',
            translateY: '-50%',
          }}
        >
          {/* Outer ring */}
          <motion.div
            animate={{
              width: style.size,
              height: style.size,
              backgroundColor: style.color,
              borderColor: style.borderColor,
              scale: style.scale ?? 1,
              filter: style.blur ? `blur(${style.blur}px)` : 'none',
            }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="rounded-full border-2"
          />

          {/* Center dot */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-white rounded-full"
            style={{ transform: 'translate(-50%, -50%)' }}
            animate={{
              scale: cursorState === 'grabbing' ? 0.5 : 1,
              opacity: cursorState === 'loading' ? 0 : 1,
            }}
          />

          {/* Loading spinner */}
          {cursorState === 'loading' && (
            <motion.div
              className="absolute top-1/2 left-1/2 w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              style={{ transform: 'translate(-50%, -50%)' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
          )}

          {/* Hotspot pulse effect */}
          {cursorState === 'hotspot' && (
            <motion.div
              className="absolute top-1/2 left-1/2 rounded-full border border-sky-400/50"
              style={{ transform: 'translate(-50%, -50%)' }}
              animate={{
                width: [60, 80, 60],
                height: [60, 80, 60],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomCursor;
