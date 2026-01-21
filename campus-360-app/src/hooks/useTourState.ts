import { useTourDataStore } from './useTourDataStore';
import { useCameraControlsStore } from './useCameraControlsStore';
import { useUIStateStore } from './useUIStateStore';

// Define a combined interface for consumers who need the entire state
export type TourState = ReturnType<typeof useTourDataStore> &
  ReturnType<typeof useCameraControlsStore> &
  ReturnType<typeof useUIStateStore>;

export const useTourState = (): TourState => {
  return {
    ...useTourDataStore(),
    ...useCameraControlsStore(),
    ...useUIStateStore(),
  };
};
