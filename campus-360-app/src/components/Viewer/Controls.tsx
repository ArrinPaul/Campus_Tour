import { useRef, useEffect } from 'react';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, DeviceOrientationControls } from '@react-three/drei';
import * as THREE from 'three';
import { useTourState } from '../../hooks/useTourState';

// Smooth interpolation helper (lerp)
const lerp = (start: number, end: number, factor: number) => {
  return start + (end - start) * factor;
};

// Damping factor for smooth camera movement (0-1, lower = smoother but slower)
const DAMPING_FACTOR = 0.08;
const SMOOTH_ROTATION_SPEED = 0.025; // Reduced for smoother/slower rotation

export const Controls: React.FC = () => {
  const { camera, gl } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const {
    isIdle,
    cameraRotation,
    cameraZoom,
    isAutoRotating,
    isGyroEnabled,
    activeRotation,
    setCameraFov,
    setCameraYaw,
    cameraFov,
  } = useTourState();

  // Target rotation values for smooth interpolation
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const isInitialized = useRef(false);

  const fovChanged = useRef(false);
  const targetFov = useRef(75);

  // Initialize rotation tracking
  useEffect(() => {
    if (!isInitialized.current) {
      currentRotation.current = { x: camera.rotation.x, y: camera.rotation.y };
      targetRotation.current = { x: camera.rotation.x, y: camera.rotation.y };
      isInitialized.current = true;
    }
  }, [camera]);

  useEffect(() => {
    fovChanged.current = true;
    targetFov.current = cameraFov;
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

  // Auto-rotate, Manual Continuous Rotation, Keyboard logic with SMOOTH TRANSITIONS
  useFrame((state, delta) => {
    // Sync Yaw to Store for Map Radar
    setCameraYaw(camera.rotation.y);

    // Smooth FOV interpolation for zoom
    if (fovChanged.current) {
      const currentFov = (state.camera as THREE.PerspectiveCamera).fov;
      const newFov = lerp(currentFov, targetFov.current, DAMPING_FACTOR * 2);

      if (Math.abs(newFov - targetFov.current) > 0.1) {
        (state.camera as THREE.PerspectiveCamera).fov = newFov;
        state.camera.updateProjectionMatrix();
      } else {
        (state.camera as THREE.PerspectiveCamera).fov = targetFov.current;
        state.camera.updateProjectionMatrix();
        fovChanged.current = false;
      }
    }

    // Calculate target rotation based on input
    let rotated = false;
    const smoothSpeed = SMOOTH_ROTATION_SPEED * Math.min(delta * 60, 2); // Frame-rate independent

    if (activeRotation) {
      switch (activeRotation) {
        case 'up':
          targetRotation.current.x += smoothSpeed;
          break;
        case 'down':
          targetRotation.current.x -= smoothSpeed;
          break;
        case 'left':
          targetRotation.current.y += smoothSpeed;
          break;
        case 'right':
          targetRotation.current.y -= smoothSpeed;
          break;
      }
      rotated = true;
    }

    const keys = keysPressed.current;
    if (keys.has('arrowup')) {
      targetRotation.current.x += smoothSpeed;
      rotated = true;
    }
    if (keys.has('arrowdown')) {
      targetRotation.current.x -= smoothSpeed;
      rotated = true;
    }
    if (keys.has('arrowleft')) {
      targetRotation.current.y += smoothSpeed;
      rotated = true;
    }
    if (keys.has('arrowright')) {
      targetRotation.current.y -= smoothSpeed;
      rotated = true;
    }

    // Apply smooth interpolation to rotation
    if (rotated) {
      // Clamp vertical rotation to prevent flipping
      targetRotation.current.x = Math.max(
        -Math.PI / 2 + 0.1,
        Math.min(Math.PI / 2 - 0.1, targetRotation.current.x)
      );

      // Smooth interpolation
      currentRotation.current.x = lerp(
        currentRotation.current.x,
        targetRotation.current.x,
        DAMPING_FACTOR
      );
      currentRotation.current.y = lerp(
        currentRotation.current.y,
        targetRotation.current.y,
        DAMPING_FACTOR
      );

      // Apply rotation to camera
      camera.rotation.x = currentRotation.current.x;
      camera.rotation.y = currentRotation.current.y;
    } else {
      // Sync current rotation with actual camera rotation (for OrbitControls interaction)
      currentRotation.current.x = camera.rotation.x;
      currentRotation.current.y = camera.rotation.y;
      targetRotation.current.x = camera.rotation.x;
      targetRotation.current.y = camera.rotation.y;
    }

    // Auto-rotate with smooth easing
    if (!rotated && isAutoRotating) {
      const autoRotateSpeed = 0.003 * Math.min(delta * 60, 2);
      targetRotation.current.y -= autoRotateSpeed;
      currentRotation.current.y = lerp(
        currentRotation.current.y,
        targetRotation.current.y,
        DAMPING_FACTOR
      );
      camera.rotation.y = currentRotation.current.y;
    }

    if (controlsRef.current) {
      controlsRef.current.autoRotate =
        isIdle && !isAutoRotating && !rotated && !activeRotation && !isGyroEnabled;
      controlsRef.current.autoRotateSpeed = 0.5;
      controlsRef.current.enableDamping = true;
      controlsRef.current.dampingFactor = 0.05;
      controlsRef.current.update();
    }
  });

  if (isGyroEnabled) {
    return <DeviceOrientationControls />;
  }

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={false}
      minDistance={10}
      maxDistance={200}
      enablePan={false}
      rotateSpeed={-0.3}
      enableDamping={true}
      dampingFactor={0.05}
    />
  );
};
