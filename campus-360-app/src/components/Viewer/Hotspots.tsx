import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
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
  const navigationHotspots = useMemo(() => {
    if (!manifest || !currentBlockId || !currentImageId) return [];

    const currentBlock = manifest.blocks.find((b) => b.id === currentBlockId);
    if (!currentBlock?.labs) return [];

    const currentIndex = currentBlock.labs.findIndex((l) => l.id === currentImageId);
    if (currentIndex === -1) return [];

    const hotspots: Array<Hotspot & { action: 'next' | 'prev' }> = [];

    // Add "Move Forward" hotspot if there's a next image
    const nextIndex = currentIndex + 1;
    if (nextIndex < currentBlock.labs.length) {
      hotspots.push({
        id: currentBlock.labs[nextIndex].id,
        x: 0,
        y: -20,
        z: -45,
        text: 'Move Forward',
        action: 'next',
      });
    }

    // Add "Go Back" hotspot if there's a previous image
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      hotspots.push({
        id: currentBlock.labs[prevIndex].id,
        x: 0,
        y: -20,
        z: 45,
        text: 'Go Back',
        action: 'prev',
      });
    }

    return hotspots;
  }, [manifest, currentBlockId, currentImageId]);

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
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      const t = state.clock.getElapsedTime();
      meshRef.current.position.y = hotspot.y + Math.sin(t * 2) * 0.8;
    }
  });

  return (
    <group
      position={[hotspot.x, hotspot.y, hotspot.z]}
      ref={meshRef}
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
      {/* 3D Marker - Smaller Glowing Circle */}
      <mesh>
        <circleGeometry args={[5, 32]} />
        <meshBasicMaterial
          color={hovered ? '#34d399' : '#10b981'}
          transparent
          opacity={hovered ? 0.85 : 0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Label */}
      <Html position={[0, -6, 0]} center pointerEvents="none">
        <div
          className={`transition-all duration-300 flex flex-col items-center gap-1 ${
            hovered ? 'scale-110 opacity-100' : 'scale-100 opacity-80'
          }`}
        >
          <div className="p-1.5 bg-emerald-500/20 rounded-full border border-emerald-400/40 backdrop-blur-sm animate-bounce">
            {isBackward ? (
              <ChevronDown className="w-4 h-4 text-emerald-400" />
            ) : (
              <ChevronUp className="w-4 h-4 text-emerald-400" />
            )}
          </div>
          {hotspot.text && hovered && (
            <div className="bg-black/70 text-white px-2.5 py-0.5 rounded-full backdrop-blur-md text-xs font-medium border border-white/20 shadow-lg whitespace-nowrap">
              {hotspot.text}
            </div>
          )}
        </div>
      </Html>

      {/* LookAt Camera Constraint - simplified by using Billboard if needed, but Circle geometry + rotation works */}
      <mesh rotation={[0, 0, 0]}>
        {/* This is just a placeholder. For better facing, we might use sprite or lookAt in useFrame */}
      </mesh>
    </group>
  );
};
