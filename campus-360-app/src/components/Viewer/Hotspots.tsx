import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { useTourState } from '../../hooks/useTourState';
import type { Hotspot } from '../../hooks/useTourDataStore';
import { ChevronUp, ChevronDown } from 'lucide-react';

export const Hotspots: React.FC = () => {
  const {
    manifest,
    currentImageId,
    currentBlockId,
    setImage,
    setBlock,
    nextImage,
    previousImage,
    isMapOpen,
  } = useTourState();

  // Generate automatic navigation hotspots for all images
  const navigationHotspots = useMemo((): Hotspot[] => {
    // Disabled as requested: Navigation moved to bottom controls
    return [];
  }, []);

  // Don't show hotspots when map is open
  if (isMapOpen) return null;

  if (!manifest || !currentBlockId || !currentImageId) return null;

  const currentBlock = manifest.blocks.find((b) => b.id === currentBlockId);
  const currentImage = currentBlock?.labs.find((l) => l.id === currentImageId);

  // Combine manual hotspots from manifest with auto-generated navigation hotspots
  // Filter out any manual hotspots that overlap with auto-generated ones
  const manualHotspots =
    currentImage?.hotspots?.filter((h) => !navigationHotspots.some((nh) => nh.id === h.id)) || [];

  const allHotspots = [...navigationHotspots, ...manualHotspots];

  if (allHotspots.length === 0) return null;

  return (
    <group>
      {allHotspots.map((hotspot, index) => (
        <HotspotMarker
          key={`${hotspot.id}-${index}`}
          hotspot={hotspot}
          isBackward={'action' in hotspot && hotspot.action === 'prev'}
          onClick={() => {
            if ('action' in hotspot) {
              if (hotspot.action === 'next') {
                nextImage();
              } else if (hotspot.action === 'prev') {
                previousImage();
              }
            } else {
              if (hotspot.targetBlockId) {
                setBlock(hotspot.targetBlockId);
              }
              if (hotspot.id) {
                setImage(hotspot.id);
              }
            }
          }}
        />
      ))}
    </group>
  );
};

const HotspotMarker = ({
  hotspot,
  onClick,
  isBackward = false,
}: {
  hotspot: Hotspot;
  onClick: () => void;
  isBackward?: boolean;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      const t = state.clock.getElapsedTime();
      groupRef.current.position.y = hotspot.y + Math.sin(t * 2) * 0.8;
    }
  });

  return (
    <group
      position={[hotspot.x, hotspot.y, hotspot.z]}
      ref={groupRef}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
        setHovered(true);
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
        setHovered(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <Billboard
        follow={true}
        lockX={false}
        lockY={false}
        lockZ={false} // Ensure it faces camera
      >
        {/* 3D Marker - Glowing Circle */}
        <mesh>
          <circleGeometry args={[5, 32]} />
          <meshBasicMaterial
            color={hovered ? '#38bdf8' : '#0ea5e9'}
            transparent
            opacity={hovered ? 0.9 : 0.6}
            side={THREE.DoubleSide}
            depthTest={false} // Always visible
          />
        </mesh>

        {/* Outer Ring for extra visibility */}
        <mesh>
          <ringGeometry args={[5.5, 6, 32]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
            depthTest={false}
          />
        </mesh>

        {/* Label */}
        <Html position={[0, -8, 0]} center pointerEvents="none" zIndexRange={[100, 0]}>
          <div
            className={`transition-all duration-300 flex flex-col items-center gap-1 ${
              hovered ? 'scale-110 opacity-100' : 'scale-100 opacity-90'
            }`}
          >
            <div className="p-2 bg-sky-500/30 rounded-full border border-sky-400/60 backdrop-blur-md animate-bounce shadow-[0_0_15px_rgba(14,165,233,0.5)]">
              {isBackward ? (
                <ChevronDown className="w-5 h-5 text-sky-300" />
              ) : (
                <ChevronUp className="w-5 h-5 text-sky-300" />
              )}
            </div>
            {hotspot.text && (
              <div className="bg-black/80 text-white px-3 py-1 rounded-full backdrop-blur-md text-sm font-semibold border border-sky-500/30 shadow-lg whitespace-nowrap tracking-wide">
                {hotspot.text}
              </div>
            )}
          </div>
        </Html>
      </Billboard>
    </group>
  );
};
