import React, { useMemo, Suspense, useEffect } from 'react';
import { useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useTourState } from '../../hooks/useTourState';
import { usePerformanceStore } from '../../hooks/usePerformanceStore';
import type { Manifest } from '../../hooks/useTourDataStore';
import { Hotspots } from './Hotspots';
import { SceneGameItems } from './SceneGameItems';
import { FPSTracker } from '../UI/FPSCounter';
import { setRenderer, getTextureQualitySettings } from '../../utils/textureCompression';
import { getStorageImageUrl } from '../../lib/assets';

const SceneContent: React.FC<{ panoramaUrl: string }> = ({ panoramaUrl }) => {
  const texture = useLoader(THREE.TextureLoader, panoramaUrl);
  const { currentImageId } = useTourState();
  const { settings } = usePerformanceStore();
  const { gl } = useThree();

  // Register renderer for texture compression utilities
  useEffect(() => {
    setRenderer(gl);
  }, [gl]);

  const material = useMemo(() => {
    const clonedTexture = texture.clone();
    clonedTexture.mapping = THREE.EquirectangularReflectionMapping;
    clonedTexture.colorSpace = THREE.SRGBColorSpace;

    // Apply texture quality settings
    const qualitySettings = getTextureQualitySettings();
    clonedTexture.generateMipmaps = qualitySettings.generateMipmaps;
    clonedTexture.minFilter = qualitySettings.minFilter;
    clonedTexture.magFilter = qualitySettings.magFilter;
    clonedTexture.anisotropy = Math.min(
      qualitySettings.anisotropy,
      gl.capabilities.getMaxAnisotropy()
    );

    clonedTexture.needsUpdate = true;
    const mat = new THREE.MeshBasicMaterial({ map: clonedTexture, side: THREE.BackSide });
    return mat;
  }, [texture, gl, settings.textureQuality]);

  // Use performance settings for sphere geometry
  const sphereArgs: [number, number, number] = useMemo(
    () => [500, settings.sphereSegments.width, settings.sphereSegments.height],
    [settings.sphereSegments]
  );

  return (
    <>
      <mesh scale={[-1, 1, 1]} material={material}>
        <sphereGeometry args={sphereArgs} />
      </mesh>
      <Hotspots />
      {currentImageId && <SceneGameItems currentImageId={currentImageId} />}
      <FPSTracker />
    </>
  );
};

export const Scene: React.FC = () => {
  const { currentImageId, manifest } = useTourState();

  const currentImage = useMemo(() => {
    if (!manifest || !currentImageId) return null;
    for (const block of (manifest as Manifest).blocks) {
      const found = block.labs?.find((lab) => lab.id === currentImageId);
      if (found) return found;
    }
    return null;
  }, [manifest, currentImageId]);

  if (!currentImage || !currentImage.panorama) return null;

  // Get panorama URL from Firebase Storage or local fallback
  const panoramaUrl = getStorageImageUrl(currentImage.panorama);

  return (
    <Suspense fallback={null}>
      <SceneContent panoramaUrl={panoramaUrl} />
    </Suspense>
  );
};
