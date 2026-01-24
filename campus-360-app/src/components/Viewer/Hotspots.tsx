import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useTourState } from '../../hooks/useTourState';
import { ChevronUp } from 'lucide-react';

export const Hotspots: React.FC = () => {
  const { manifest, currentImageId, currentBlockId, setImage, setBlock } = useTourState();

  if (!manifest || !currentBlockId || !currentImageId) return null;

  const currentBlock = manifest.blocks.find((b) => b.id === currentBlockId);
  const currentImage = currentBlock?.labs.find((l) => l.id === currentImageId);

  if (!currentImage?.hotspots) return null;

  return (
    <group>
      {currentImage.hotspots.map((hotspot, index) => (
        <HotspotMarker
          key={`${hotspot.id}-${index}`}
          hotspot={hotspot}
          onClick={() => {
            if (hotspot.targetBlockId) {
              setBlock(hotspot.targetBlockId);
            }
            if (hotspot.id) {
               setImage(hotspot.id);
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
}: {
  hotspot: any;
  onClick: () => void;
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      const t = state.clock.getElapsedTime();
      meshRef.current.position.y = hotspot.y + Math.sin(t * 2) * 2;
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
      {/* 3D Marker - Glowing Sphere or Arrow */}
      <mesh>
        <circleGeometry args={[8, 32]} />
        <meshBasicMaterial
          color={hovered ? '#34d399' : '#10b981'}
          transparent
          opacity={hovered ? 0.9 : 0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Label */}
      <Html position={[0, -12, 0]} center pointerEvents="none">
        <div
          className={`transition-all duration-300 flex flex-col items-center gap-1 ${
            hovered ? 'scale-110 opacity-100' : 'scale-100 opacity-80'
          }`}
        >
          {hotspot.text && (
            <div className="bg-black/60 text-white px-3 py-1.5 rounded-full backdrop-blur-md text-sm font-medium border border-white/20 shadow-xl whitespace-nowrap">
              {hotspot.text}
            </div>
          )}
          <div className="p-2 bg-white/10 rounded-full border border-white/30 backdrop-blur-sm animate-bounce">
             <ChevronUp className="w-5 h-5 text-emerald-400" />
          </div>
        </div>
      </Html>
      
      {/* LookAt Camera Constraint - simplified by using Billboard if needed, but Circle geometry + rotation works */}
      <mesh rotation={[0, 0, 0]}>
         {/* This is just a placeholder. For better facing, we might use sprite or lookAt in useFrame */}
      </mesh>
    </group>
  );
};
