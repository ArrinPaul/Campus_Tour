import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PerformanceMode = 'auto' | 'low' | 'medium' | 'high';

export interface PerformanceSettings {
  // Texture quality (affects sphere geometry segments)
  textureQuality: 'low' | 'medium' | 'high';
  // Sphere geometry segments
  sphereSegments: { width: number; height: number };
  // Enable/disable effects
  enableTransitionEffects: boolean;
  enableParticles: boolean;
  // Preload settings
  preloadCount: number;
  // Target FPS
  targetFPS: number;
}

const PERFORMANCE_PRESETS: Record<Exclude<PerformanceMode, 'auto'>, PerformanceSettings> = {
  low: {
    textureQuality: 'low',
    sphereSegments: { width: 32, height: 24 },
    enableTransitionEffects: false,
    enableParticles: false,
    preloadCount: 1,
    targetFPS: 30,
  },
  medium: {
    textureQuality: 'medium',
    sphereSegments: { width: 48, height: 32 },
    enableTransitionEffects: true,
    enableParticles: false,
    preloadCount: 2,
    targetFPS: 45,
  },
  high: {
    textureQuality: 'high',
    sphereSegments: { width: 60, height: 40 },
    enableTransitionEffects: true,
    enableParticles: true,
    preloadCount: 4,
    targetFPS: 60,
  },
};

interface PerformanceState {
  mode: PerformanceMode;
  settings: PerformanceSettings;
  currentFPS: number;
  showFPSCounter: boolean;
  isAutoDetecting: boolean;

  // Actions
  setMode: (mode: PerformanceMode) => void;
  setCurrentFPS: (fps: number) => void;
  toggleFPSCounter: () => void;
  autoDetectPerformance: () => void;
}

// Detect device capabilities
const detectDeviceCapabilities = (): PerformanceMode => {
  // Check for low-end device indicators
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  const hardwareConcurrency = navigator.hardwareConcurrency || 2;
  const deviceMemory = (navigator as { deviceMemory?: number }).deviceMemory || 4;

  // Check WebGL capabilities
  let maxTextureSize = 4096;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (gl) {
      maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    }
  } catch {
    // WebGL not available
  }

  // Scoring system
  let score = 0;

  // CPU cores
  if (hardwareConcurrency >= 8) score += 3;
  else if (hardwareConcurrency >= 4) score += 2;
  else score += 1;

  // Memory
  if (deviceMemory >= 8) score += 3;
  else if (deviceMemory >= 4) score += 2;
  else score += 1;

  // GPU (based on max texture size)
  if (maxTextureSize >= 16384) score += 3;
  else if (maxTextureSize >= 8192) score += 2;
  else score += 1;

  // Mobile penalty
  if (isMobile) score -= 2;

  // Determine mode
  if (score >= 7) return 'high';
  if (score >= 4) return 'medium';
  return 'low';
};

export const usePerformanceStore = create<PerformanceState>()(
  persist(
    (set, get) => ({
      mode: 'auto',
      settings: PERFORMANCE_PRESETS.medium,
      currentFPS: 60,
      showFPSCounter: false,
      isAutoDetecting: false,

      setMode: (mode) => {
        if (mode === 'auto') {
          const detected = detectDeviceCapabilities();
          set({
            mode: 'auto',
            settings: PERFORMANCE_PRESETS[detected as 'low' | 'medium' | 'high'],
          });
        } else {
          set({
            mode,
            settings: PERFORMANCE_PRESETS[mode],
          });
        }
      },

      setCurrentFPS: (fps) => {
        set({ currentFPS: fps });

        // Auto-adjust if in auto mode and FPS is consistently low
        const state = get();
        if (state.mode === 'auto' && fps < 25) {
          const currentQuality = state.settings.textureQuality;
          if (currentQuality === 'high') {
            set({ settings: PERFORMANCE_PRESETS.medium });
          } else if (currentQuality === 'medium') {
            set({ settings: PERFORMANCE_PRESETS.low });
          }
        }
      },

      toggleFPSCounter: () => set((state) => ({ showFPSCounter: !state.showFPSCounter })),

      autoDetectPerformance: () => {
        set({ isAutoDetecting: true });
        const detected = detectDeviceCapabilities();
        set({
          mode: 'auto',
          settings: PERFORMANCE_PRESETS[detected as 'low' | 'medium' | 'high'],
          isAutoDetecting: false,
        });
      },
    }),
    {
      name: 'performance-settings',
      partialize: (state) => ({
        mode: state.mode,
        showFPSCounter: state.showFPSCounter,
      }),
    }
  )
);

// Initialize auto-detection on first load
if (typeof window !== 'undefined') {
  const store = usePerformanceStore.getState();
  if (store.mode === 'auto') {
    store.autoDetectPerformance();
  }
}
