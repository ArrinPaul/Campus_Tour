import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../../hooks/useGameStore';
import { Trophy, Star } from 'lucide-react';

// Collectible Item Component (3D)
export const Collectible: React.FC<{ id: string; position: [number, number, number] }> = ({
  id,
  position,
}) => {
  const { foundItems, collectItem, isGameActive } = useGameStore();
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const isCollected = foundItems.includes(id);

  useFrame((state) => {
    if (meshRef.current && !isCollected) {
      meshRef.current.rotation.y += 0.02;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 2) * 0.2;
    }
  });

  if (!isGameActive || isCollected) return null;

  return (
    <group
      ref={meshRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        collectItem(id);
      }}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
        setHovered(true);
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
        setHovered(false);
      }}
    >
      <mesh scale={hovered ? 1.2 : 1}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.5} />
      </mesh>

      {/* Sparkle Effect */}
      <Html center>
        <div className={`transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-yellow-400/20 p-2 rounded-full blur-xl absolute inset-0" />
          <Star className="text-yellow-300 w-8 h-8 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
        </div>
      </Html>
    </group>
  );
};

// Game UI Overlay
export const GameOverlay: React.FC = () => {
  const { foundItems, totalItems, isGameActive, setGameActive } = useGameStore();
  const [showWinModal, setShowWinModal] = useState(false);

  React.useEffect(() => {
    if (foundItems.length === totalItems && totalItems > 0) {
      setShowWinModal(true);
    }
  }, [foundItems, totalItems]);

  if (!isGameActive) return null;

  return (
    <>
      {/* Score Counter */}
      <div className="fixed top-24 right-6 z-40 bg-black/60 backdrop-blur-md border border-yellow-500/30 text-yellow-400 px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg">
        <Trophy size={18} />
        <span>
          {foundItems.length} / {totalItems}
        </span>
      </div>

      {/* Win Modal */}
      {showWinModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-1 rounded-2xl max-w-sm w-full shadow-2xl animate-bounce-in">
            <div className="bg-black/90 rounded-xl p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
              <Trophy size={64} className="text-yellow-400 mx-auto mb-4 drop-shadow-lg" />
              <h2 className="text-3xl font-bold text-white mb-2">You Won!</h2>
              <p className="text-yellow-100 mb-6">You found all the hidden items on campus!</p>
              <button
                onClick={() => {
                  setShowWinModal(false);
                  setGameActive(false);
                }}
                className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg"
              >
                Awesome!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
