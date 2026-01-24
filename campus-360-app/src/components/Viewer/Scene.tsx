import React, { useMemo, Suspense } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { useTourState } from '../../hooks/useTourState';
import type { Manifest } from '../../hooks/useTourDataStore';
import { Hotspots } from './Hotspots';
import { PointsOfInterest } from './PointsOfInterest';

const SceneContent: React.FC<{ panoramaUrl: string }> = ({ panoramaUrl }) => {
  const texture = useLoader(THREE.TextureLoader, panoramaUrl);

  const material = useMemo(() => {
    const clonedTexture = texture.clone();
    clonedTexture.mapping = THREE.EquirectangularReflectionMapping;
    clonedTexture.colorSpace = THREE.SRGBColorSpace;
    clonedTexture.needsUpdate = true;
    const mat = new THREE.MeshBasicMaterial({ map: clonedTexture, side: THREE.BackSide });
    return mat;
  }, [texture]);

  return (
    <>
      <mesh scale={[-1, 1, 1]} material={material}>
        <sphereGeometry args={[500, 60, 40]} />
      </mesh>
      <Hotspots />
      <PointsOfInterest />
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

  return (
    <Suspense fallback={null}>
      <SceneContent panoramaUrl={currentImage.panorama} />
    </Suspense>
  );
};
