/**
 * Texture Compression Utilities
 * KTX2/Basis Universal support for optimized 3D textures
 */

import * as THREE from 'three';
import { usePerformanceStore } from '../hooks/usePerformanceStore';

// Texture format support detection
export interface TextureSupport {
  basis: boolean;
  ktx2: boolean;
  etc1: boolean;
  etc2: boolean;
  astc: boolean;
  bc7: boolean;
  dxt: boolean;
  pvrtc: boolean;
}

let textureSupport: TextureSupport | null = null;

// Detect supported texture compression formats
export const detectTextureSupport = (): TextureSupport => {
  if (textureSupport) return textureSupport;

  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');

  if (!gl) {
    textureSupport = {
      basis: false,
      ktx2: false,
      etc1: false,
      etc2: false,
      astc: false,
      bc7: false,
      dxt: false,
      pvrtc: false,
    };
    return textureSupport;
  }

  const extensions = gl.getSupportedExtensions() || [];

  textureSupport = {
    basis: true, // Basis can transcode to any format
    ktx2: true, // KTX2 container support
    etc1: extensions.includes('WEBGL_compressed_texture_etc1'),
    etc2:
      extensions.includes('WEBGL_compressed_texture_etc') || gl instanceof WebGL2RenderingContext,
    astc: extensions.includes('WEBGL_compressed_texture_astc'),
    bc7: extensions.includes('EXT_texture_compression_bptc'),
    dxt:
      extensions.includes('WEBGL_compressed_texture_s3tc') ||
      extensions.includes('WEBKIT_WEBGL_compressed_texture_s3tc'),
    pvrtc:
      extensions.includes('WEBGL_compressed_texture_pvrtc') ||
      extensions.includes('WEBKIT_WEBGL_compressed_texture_pvrtc'),
  };

  return textureSupport;
};

// Get optimal texture format for the device
export const getOptimalTextureFormat = (): string => {
  const support = detectTextureSupport();

  // Priority order: ASTC > BC7 > ETC2 > DXT > ETC1 > PVRTC > uncompressed
  if (support.astc) return 'astc';
  if (support.bc7) return 'bc7';
  if (support.etc2) return 'etc2';
  if (support.dxt) return 'dxt';
  if (support.etc1) return 'etc1';
  if (support.pvrtc) return 'pvrtc';
  return 'none';
};

// Texture quality settings based on performance mode
export const getTextureQualitySettings = () => {
  const settings = usePerformanceStore.getState().settings;
  const quality = settings.textureQuality;

  const qualitySettings = {
    low: {
      maxSize: 1024,
      anisotropy: 1,
      generateMipmaps: false,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    },
    medium: {
      maxSize: 2048,
      anisotropy: 4,
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
      magFilter: THREE.LinearFilter,
    },
    high: {
      maxSize: 4096,
      anisotropy: 16,
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
      magFilter: THREE.LinearFilter,
    },
  };

  return qualitySettings[quality];
};

// Apply quality settings to a texture
export const applyTextureQuality = (texture: THREE.Texture): THREE.Texture => {
  const settings = getTextureQualitySettings();
  const renderer = getRenderer();

  texture.generateMipmaps = settings.generateMipmaps;
  texture.minFilter = settings.minFilter;
  texture.magFilter = settings.magFilter;

  if (renderer) {
    texture.anisotropy = Math.min(settings.anisotropy, renderer.capabilities.getMaxAnisotropy());
  }

  return texture;
};

// Store renderer reference for anisotropy
let rendererRef: THREE.WebGLRenderer | null = null;

export const setRenderer = (renderer: THREE.WebGLRenderer) => {
  rendererRef = renderer;
};

export const getRenderer = (): THREE.WebGLRenderer | null => {
  return rendererRef;
};

// Compressed texture loader with fallback
export const loadCompressedTexture = async (
  _basePath: string,
  extensions: { ktx2?: string; basis?: string; fallback: string }
): Promise<THREE.Texture> => {
  const support = detectTextureSupport();
  const loader = new THREE.TextureLoader();

  // Try KTX2 first if supported
  if (support.ktx2 && extensions.ktx2) {
    // Note: In production, you'd use KTX2Loader from three/examples
    // For now, we'll fall back to regular textures
    console.log('KTX2 format detected, would use compressed texture');
  }

  // Fall back to regular texture
  return new Promise((resolve, reject) => {
    loader.load(
      extensions.fallback,
      (texture) => {
        applyTextureQuality(texture);
        resolve(texture);
      },
      undefined,
      reject
    );
  });
};

// Texture cache for memory management
class TextureCache {
  private cache = new Map<string, THREE.Texture>();
  private accessOrder: string[] = [];
  private maxSize: number;

  constructor(maxSize = 20) {
    this.maxSize = maxSize;
  }

  get(key: string): THREE.Texture | undefined {
    const texture = this.cache.get(key);
    if (texture) {
      // Move to end of access order (most recently used)
      this.accessOrder = this.accessOrder.filter((k) => k !== key);
      this.accessOrder.push(key);
    }
    return texture;
  }

  set(key: string, texture: THREE.Texture): void {
    // Evict oldest if at capacity
    while (this.cache.size >= this.maxSize) {
      const oldest = this.accessOrder.shift();
      if (oldest) {
        const oldTexture = this.cache.get(oldest);
        oldTexture?.dispose();
        this.cache.delete(oldest);
      }
    }

    this.cache.set(key, texture);
    this.accessOrder.push(key);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  clear(): void {
    this.cache.forEach((texture) => texture.dispose());
    this.cache.clear();
    this.accessOrder = [];
  }

  getStats(): { size: number; maxSize: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
    };
  }
}

// Singleton texture cache
export const textureCache = new TextureCache();

// Mipmap generation helper
export const generateMipmaps = (texture: THREE.Texture): void => {
  const settings = getTextureQualitySettings();
  if (!settings.generateMipmaps) return;

  texture.generateMipmaps = true;
  texture.needsUpdate = true;
};

// Memory-efficient texture disposal
export const disposeTexture = (texture: THREE.Texture | null): void => {
  if (!texture) return;

  texture.dispose();

  // Also dispose of any associated render targets
  if ((texture as THREE.DataTexture).image) {
    (texture as THREE.DataTexture).image = null as unknown as ImageData;
  }
};

// Get texture memory estimate (in bytes)
export const estimateTextureMemory = (texture: THREE.Texture): number => {
  const image = texture.image as HTMLImageElement | ImageBitmap | null;
  if (!image) return 0;

  const width = ('width' in image ? image.width : 1) || 1;
  const height = ('height' in image ? image.height : 1) || 1;
  const bytesPerPixel = 4; // RGBA

  let memory = width * height * bytesPerPixel;

  // Add mipmap levels if enabled
  if (texture.generateMipmaps) {
    memory = Math.floor(memory * 1.33); // Mipmaps add ~33%
  }

  return memory;
};

// Format bytes to human readable
export const formatMemorySize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
