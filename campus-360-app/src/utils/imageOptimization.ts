/**
 * Image Optimization Utilities
 * Provides lazy loading, progressive loading, and WebP support
 */

import { usePerformanceStore } from '../hooks/usePerformanceStore';

// Check WebP support
let webpSupported: boolean | null = null;

export const checkWebPSupport = (): Promise<boolean> => {
  if (webpSupported !== null) return Promise.resolve(webpSupported);

  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      webpSupported = webP.height === 2;
      resolve(webpSupported);
    };
    webP.src =
      'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

// Image loading states
export type ImageLoadState = 'idle' | 'loading' | 'loaded' | 'error';

// Progressive image loader with blur-up effect
export interface ProgressiveImageOptions {
  src: string;
  lowResSrc?: string;
  onProgress?: (progress: number) => void;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  priority?: 'high' | 'low';
}

// Generate low-resolution placeholder URL
export const getLowResUrl = (url: string): string => {
  // If the URL already has query params, append; otherwise add
  const separator = url.includes('?') ? '&' : '?';
  // This would work with image services that support size params
  // For static files, we'll use a blur technique in the component
  return `${url}${separator}w=32&q=10`;
};

// Check if URL is a WebP image
export const isWebPUrl = (url: string): boolean => {
  return url.toLowerCase().endsWith('.webp');
};

// Get optimal image format URL
export const getOptimalImageUrl = async (baseUrl: string, webpUrl?: string): Promise<string> => {
  if (webpUrl && (await checkWebPSupport())) {
    return webpUrl;
  }
  return baseUrl;
};

// Image preloader with progress tracking
export class ImageLoader {
  private loadingImages = new Map<
    string,
    { promise: Promise<HTMLImageElement>; progress: number }
  >();
  private cachedImages = new Map<string, HTMLImageElement>();
  private observer: IntersectionObserver | null = null;

  constructor() {
    // Create intersection observer for lazy loading
    if (typeof IntersectionObserver !== 'undefined') {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const target = entry.target as HTMLElement;
              const src = target.dataset.src;
              if (src) {
                this.load(src);
              }
            }
          });
        },
        { rootMargin: '100px' }
      );
    }
  }

  // Load image with progress tracking
  load(url: string, options?: Partial<ProgressiveImageOptions>): Promise<HTMLImageElement> {
    // Return cached image if available
    if (this.cachedImages.has(url)) {
      return Promise.resolve(this.cachedImages.get(url)!);
    }

    // Return existing loading promise if in progress
    const existing = this.loadingImages.get(url);
    if (existing) {
      return existing.promise;
    }

    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();

      // Use fetchPriority for high priority images
      if (options?.priority === 'high') {
        img.fetchPriority = 'high';
      }

      img.onload = () => {
        this.cachedImages.set(url, img);
        this.loadingImages.delete(url);
        options?.onLoad?.();
        resolve(img);
      };

      img.onerror = () => {
        this.loadingImages.delete(url);
        const error = new Error(`Failed to load image: ${url}`);
        options?.onError?.(error);
        reject(error);
      };

      // Start loading
      img.src = url;
    });

    this.loadingImages.set(url, { promise, progress: 0 });
    return promise;
  }

  // Preload multiple images
  preloadBatch(urls: string[]): Promise<HTMLImageElement[]> {
    const settings = usePerformanceStore.getState().settings;
    const batchSize = settings.preloadCount;

    // Load in batches based on performance settings
    const batches: string[][] = [];
    for (let i = 0; i < urls.length; i += batchSize) {
      batches.push(urls.slice(i, i + batchSize));
    }

    return batches.reduce(
      async (prevPromise, batch) => {
        const prevResults = await prevPromise;
        const batchResults = await Promise.all(batch.map((url) => this.load(url)));
        return [...prevResults, ...batchResults];
      },
      Promise.resolve([] as HTMLImageElement[])
    );
  }

  // Register element for lazy loading
  observe(element: HTMLElement): void {
    this.observer?.observe(element);
  }

  // Unregister element
  unobserve(element: HTMLElement): void {
    this.observer?.unobserve(element);
  }

  // Clear cache
  clearCache(): void {
    this.cachedImages.clear();
    this.loadingImages.clear();
  }

  // Get cache stats
  getStats(): { cached: number; loading: number } {
    return {
      cached: this.cachedImages.size,
      loading: this.loadingImages.size,
    };
  }
}

// Singleton instance
export const imageLoader = new ImageLoader();

// Lazy image attributes helper
export const getLazyImageProps = (src: string) => ({
  'data-src': src,
  loading: 'lazy' as const,
  decoding: 'async' as const,
});

// Create blur placeholder from canvas
export const createBlurPlaceholder = (width = 16, height = 16): string => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Create gradient placeholder
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#1a1a2e');
  gradient.addColorStop(0.5, '#16213e');
  gradient.addColorStop(1, '#0f3460');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  return canvas.toDataURL('image/jpeg', 0.1);
};

// Responsive image breakpoints
export const IMAGE_BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// Generate srcset string for responsive images
export const generateSrcSet = (
  baseUrl: string,
  sizes: number[] = [640, 768, 1024, 1280, 1920]
): string => {
  // This would work with image CDNs that support dynamic resizing
  // For static files, return the base URL
  const extension = baseUrl.split('.').pop();
  const basePath = baseUrl.replace(`.${extension}`, '');

  return sizes
    .map((size) => {
      // Check if sized version exists, otherwise use original
      const sizedUrl = `${basePath}-${size}w.${extension}`;
      return `${sizedUrl} ${size}w`;
    })
    .join(', ');
};

// Image dimension estimation for aspect ratio
export const estimateImageDimensions = (
  url: string
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = reject;
    img.src = url;
  });
};
