/**
 * QR Code Utilities
 * Functions for generating QR codes and share URLs
 */

/**
 * Generate a shareable URL for the current view
 */
export const generateShareUrl = (includeCamera: boolean = true): string => {
  const params = new URLSearchParams(window.location.search);
  const baseUrl = window.location.origin + window.location.pathname;

  const shareParams = new URLSearchParams();
  const block = params.get('block');
  const view = params.get('view');

  if (block) shareParams.set('block', block);
  if (view) shareParams.set('view', view);

  if (includeCamera) {
    const yaw = params.get('yaw');
    const pitch = params.get('pitch');
    const fov = params.get('fov');
    if (yaw) shareParams.set('yaw', yaw);
    if (pitch) shareParams.set('pitch', pitch);
    if (fov) shareParams.set('fov', fov);
  }

  return `${baseUrl}${shareParams.toString() ? '?' + shareParams.toString() : ''}`;
};

/**
 * Generate a deterministic QR-like matrix pattern
 * Note: For production, use a proper QR library like 'qrcode'
 */
export const generateQRMatrix = (data: string, size: number = 25): boolean[][] => {
  const matrix: boolean[][] = [];

  // Create a deterministic pattern based on data hash
  const hash = data.split('').reduce((acc, char) => {
    return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
  }, 0);

  for (let y = 0; y < size; y++) {
    matrix[y] = [];
    for (let x = 0; x < size; x++) {
      // Position detection patterns (corners)
      const inTopLeft = x < 7 && y < 7;
      const inTopRight = x >= size - 7 && y < 7;
      const inBottomLeft = x < 7 && y >= size - 7;

      if (inTopLeft || inTopRight || inBottomLeft) {
        // Draw finder patterns
        const localX = inTopRight ? x - (size - 7) : x;
        const localY = inBottomLeft ? y - (size - 7) : y;
        const isEdge = localX === 0 || localX === 6 || localY === 0 || localY === 6;
        const isInner = localX >= 2 && localX <= 4 && localY >= 2 && localY <= 4;
        matrix[y][x] = isEdge || isInner;
      } else {
        // Data area - create pseudo-random pattern based on hash and position
        const seed = (hash + x * 31 + y * 17) >>> 0;
        matrix[y][x] = seed % 3 !== 0;
      }
    }
  }

  return matrix;
};

/**
 * Draw QR code on a canvas element
 */
export const drawQRCode = (
  canvas: HTMLCanvasElement,
  data: string,
  options: {
    size: number;
    fgColor: string;
    bgColor: string;
  }
): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const { size, fgColor, bgColor } = options;
  const moduleCount = 25;
  const moduleSize = size / moduleCount;

  canvas.width = size;
  canvas.height = size;

  // Draw background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);

  // Generate and draw QR matrix
  const matrix = generateQRMatrix(data, moduleCount);

  ctx.fillStyle = fgColor;
  for (let y = 0; y < moduleCount; y++) {
    for (let x = 0; x < moduleCount; x++) {
      if (matrix[y][x]) {
        ctx.fillRect(x * moduleSize, y * moduleSize, moduleSize, moduleSize);
      }
    }
  }

  // Add quiet zone effect
  ctx.strokeStyle = bgColor;
  ctx.lineWidth = moduleSize;
  ctx.strokeRect(0, 0, size, size);
};

/**
 * Download canvas as PNG
 */
export const downloadCanvasAsPng = (canvas: HTMLCanvasElement, filename: string): void => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
};

/**
 * Check if Web Share API is available
 */
export const canShare = (): boolean => {
  return typeof navigator !== 'undefined' && 'share' in navigator;
};

/**
 * Share using Web Share API
 */
export const shareUrl = async (url: string, title: string, text: string): Promise<boolean> => {
  if (!canShare()) return false;

  try {
    await navigator.share({ title, text, url });
    return true;
  } catch {
    return false;
  }
};
