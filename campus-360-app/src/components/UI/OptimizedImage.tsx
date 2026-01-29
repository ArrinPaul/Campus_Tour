/**
 * OptimizedImage Component
 * Provides lazy loading with blur-up progressive loading effect
 */

import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  imageLoader,
  createBlurPlaceholder,
  getLazyImageProps,
} from '../../utils/imageOptimization';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataUrl?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  placeholder = 'blur',
  blurDataUrl,
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const loadStartedRef = useRef(false);

  // Generate blur placeholder once
  const blurPlaceholder = useMemo(() => {
    if (placeholder === 'blur') {
      return blurDataUrl || createBlurPlaceholder();
    }
    return '';
  }, [placeholder, blurDataUrl]);

  // Load image function - called from event handlers, not effects
  const startLoading = () => {
    if (loadStartedRef.current) return;
    loadStartedRef.current = true;

    imageLoader
      .load(src, {
        priority: priority ? 'high' : 'low',
        onLoad: () => {
          setIsLoaded(true);
          onLoad?.();
        },
        onError: (err) => {
          setError(err);
          onError?.(err);
        },
      })
      .catch((err) => {
        setError(err as Error);
        onError?.(err as Error);
      });
  };

  // Handle native image events
  const handleNativeLoad = () => {
    if (!isLoaded) {
      setIsLoaded(true);
      onLoad?.();
    }
  };

  const handleNativeError = () => {
    if (!error) {
      const err = new Error(`Failed to load: ${src}`);
      setError(err);
      onError?.(err);
    }
  };

  // Handle intersection for lazy loading
  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        startLoading();
      }
    });
  };

  // Setup intersection observer on mount via ref callback
  const setContainerRef = (element: HTMLDivElement | null) => {
    if (element && !priority) {
      const observer = new IntersectionObserver(handleIntersection, { rootMargin: '50px' });
      observer.observe(element);
      // Store for cleanup (will be recreated on re-render, which is fine for this use case)
    }
    if (priority && element && !loadStartedRef.current) {
      startLoading();
    }
    (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = element;
  };

  if (error) {
    return (
      <div
        className={`bg-gray-800 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-400 text-sm">Failed to load image</span>
      </div>
    );
  }

  return (
    <div
      ref={setContainerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
      {...getLazyImageProps(src)}
    >
      <AnimatePresence mode="wait">
        {/* Blur placeholder */}
        {placeholder === 'blur' && !isLoaded && blurPlaceholder && (
          <motion.img
            key="placeholder"
            src={blurPlaceholder}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'blur(20px)', transform: 'scale(1.1)' }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Main image */}
      <motion.img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${isLoaded ? '' : 'opacity-0'}`}
        onLoad={handleNativeLoad}
        onError={handleNativeError}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ width, height }}
      />

      {/* Loading indicator */}
      {!isLoaded && placeholder === 'empty' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

// Thumbnail variant for smaller images
export const OptimizedThumbnail: React.FC<OptimizedImageProps & { size?: 'sm' | 'md' | 'lg' }> = ({
  size = 'md',
  ...props
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
  };

  return (
    <OptimizedImage
      {...props}
      className={`${sizeClasses[size]} rounded-lg ${props.className || ''}`}
    />
  );
};

export default OptimizedImage;
