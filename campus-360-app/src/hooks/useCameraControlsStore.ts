import { create } from 'zustand';

interface CameraControlsState {
  cameraRotation: { direction: 'up' | 'down' | 'left' | 'right' | null };
  cameraZoom: { direction: 'in' | 'out' | null };
  cameraFov: number;
  isAutoRotating: boolean;
  isGyroEnabled: boolean;
  activeRotation: 'up' | 'down' | 'left' | 'right' | null;
  rotateCamera: (direction: 'up' | 'down' | 'left' | 'right') => void;
  zoomCamera: (direction: 'in' | 'out') => void;
  setCameraFov: (fov: number) => void;
  setAutoRotation: (isRotating: boolean) => void;
  setGyroEnabled: (isEnabled: boolean) => void;
  startRotation: (direction: 'up' | 'down' | 'left' | 'right') => void;
  stopRotation: () => void;
}

export const useCameraControlsStore = create<CameraControlsState>((set) => ({
  cameraRotation: { direction: null },
  cameraZoom: { direction: null },
  cameraFov: 75,
  isAutoRotating: false,
  isGyroEnabled: false,
  activeRotation: null,
  rotateCamera: (direction) => {
    set({ cameraRotation: { direction } });
    setTimeout(() => set({ cameraRotation: { direction: null } }), 100);
  },
  zoomCamera: (direction) => {
    set({ cameraZoom: { direction } });
    setTimeout(() => set({ cameraZoom: { direction: null } }), 100);
  },
  setCameraFov: (fov) => set({ cameraFov: fov }),
  setAutoRotation: (isRotating) => set({ isAutoRotating: isRotating, isGyroEnabled: false }),
  setGyroEnabled: (isEnabled) => set({ isGyroEnabled: isEnabled, isAutoRotating: false }),
  startRotation: (direction) => set({ activeRotation: direction, isAutoRotating: false }),
  stopRotation: () => set({ activeRotation: null }),
}));
