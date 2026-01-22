import { useRef, useEffect } from 'react';
import { OrbitControls as OrbitControlsImpl } from 'three/examples/jsm/controls/OrbitControls';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useTourState } from '../../hooks/useTourState';

export const Controls: React.FC = () => {
  const { camera, gl } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const {
    isIdle,
    cameraRotation,
    cameraZoom,
    isAutoRotating,
    activeRotation,
    setCameraFov,
    cameraFov,
  } = useTourState();

  const fovChanged = useRef(false);
  useEffect(() => {
    fovChanged.current = true;
  }, [cameraFov]);

  // Listen to camera rotation triggers from UI buttons
  useEffect(() => {
    if (!cameraRotation.direction) return;

    const speed = 0.1;
    switch (cameraRotation.direction) {
      case 'up':
        camera.rotateX(speed);
        break;
      case 'down':
        camera.rotateX(-speed);
        break;
      case 'left':
        camera.rotateY(speed);
        break;
      case 'right':
        camera.rotateY(-speed);
        break;
    }
  }, [cameraRotation, camera]);

  // Listen to camera zoom triggers from UI buttons
  useEffect(() => {
    if (!cameraZoom.direction) return;

    const zoomSpeed = 5;
    let newFov = cameraFov;

    if (cameraZoom.direction === 'in') {
      newFov = Math.max(30, cameraFov - zoomSpeed);
    } else if (cameraZoom.direction === 'out') {
      newFov = Math.min(100, cameraFov + zoomSpeed);
    }

    if (newFov !== cameraFov) {
      setCameraFov(newFov);
    }
  }, [cameraZoom, cameraFov, setCameraFov]);

  // Handle mouse wheel zoom
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const zoomSpeed = 0.05;
      let newFov = cameraFov + e.deltaY * zoomSpeed;

      newFov = Math.max(30, Math.min(100, newFov));

      if (newFov !== cameraFov) {
        setCameraFov(newFov);
      }
    };

    const canvas = gl.domElement;
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [cameraFov, gl, setCameraFov]);

  // Keyboard state tracking for continuous movement
  const keysPressed = useRef<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase());
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Auto-rotate, Manual Continuous Rotation, and Keyboard logic
  useFrame((state) => {
    if (fovChanged.current) {
      if ((state.camera as THREE.PerspectiveCamera).fov !== cameraFov) {
        (state.camera as THREE.PerspectiveCamera).fov = cameraFov;
        state.camera.updateProjectionMatrix();
      }
      fovChanged.current = false;
    }

    const rotationSpeed = 0.02;

    let rotated = false;

    if (activeRotation) {
      switch (activeRotation) {
        case 'up':
          camera.rotateX(rotationSpeed);
          break;
        case 'down':
          camera.rotateX(-rotationSpeed);
          break;
        case 'left':
          camera.rotateY(rotationSpeed);
          break;
        case 'right':
          camera.rotateY(-rotationSpeed);
          break;
      }
      rotated = true;
    }

    const keys = keysPressed.current;
    if (keys.has('arrowup') || keys.has('w')) {
      camera.rotateX(rotationSpeed);
      rotated = true;
    }
    if (keys.has('arrowdown') || keys.has('s')) {
      camera.rotateX(-rotationSpeed);
      rotated = true;
    }
    if (keys.has('arrowleft') || keys.has('a')) {
      camera.rotateY(rotationSpeed);
      rotated = true;
    }
    if (keys.has('arrowright') || keys.has('d')) {
      camera.rotateY(-rotationSpeed);
      rotated = true;
    }

    if (!rotated && isAutoRotating) {
      camera.rotateY(-0.005);
    }

    if (controlsRef.current) {
      controlsRef.current.autoRotate = isIdle && !isAutoRotating && !rotated && !activeRotation;
      controlsRef.current.autoRotateSpeed = 0.5;
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={false}
      minDistance={10}
      maxDistance={200}
      enablePan={false}
      rotateSpeed={-0.5}
    />
  );
};
