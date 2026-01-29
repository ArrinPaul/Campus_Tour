/**
 * Asset URL Helper
 * Simple helper to get asset URLs for local/Vercel deployment
 */

/**
 * Get image URL from public folder
 */
export const getStorageImageUrl = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `/${cleanPath}`;
};

/**
 * Get thumbnail URL
 */
export const getThumbnailUrl = (thumbnailFile: string): string => {
  return `/exported/thumbnails/${thumbnailFile}`;
};

/**
 * Get audio file URL
 */
export const getAudioUrl = (audioFile: string): string => {
  return `/assets/audio/${audioFile}`;
};
