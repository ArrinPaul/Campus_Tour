import { useTourDataStore } from './useTourDataStore';
import { useCameraControlsStore } from './useCameraControlsStore';
import { useUIStateStore } from './useUIStateStore';

export const useTourState = () => {
  return {
    ...useTourDataStore(),
    ...useCameraControlsStore(),
    ...useUIStateStore(),
  };
};
