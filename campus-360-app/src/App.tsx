import { useEffect, Suspense } from 'react';
import { Scene } from './components/Viewer/Scene';
import { Canvas } from '@react-three/fiber';
import { Controls } from './components/Viewer/Controls';
import { Loader } from './components/UI/Loader';
import { TopBar } from './components/UI/TopBar';
import { BottomControls } from './components/UI/BottomControls';
import { Compass } from './components/UI/Compass';
import { MapOverlay } from './components/UI/MapOverlay';
import { TransitionOverlay } from './components/UI/TransitionOverlay';
import { AmbientAudio } from './components/UI/AmbientAudio';
import { GameOverlay } from './components/Game/GameComponents';
import { HelpOverlay } from './components/UI/HelpOverlay';
import { useTourState } from './hooks/useTourState';
import { XR } from '@react-three/xr';
import { xrStore } from './utils/xr';

function App() {
  const { setManifest, setBlock, setImage, setIdle, currentBlockId, currentImageId } =
    useTourState();

  // Load manifest on mount
  useEffect(() => {
    fetch('/manifest.json')
      .then((res) => res.json())
      .then((data) => {
        setManifest(data);

        const params = new URLSearchParams(window.location.search);
        const blockId = params.get('block');
        const imageId = params.get('view');

        if (blockId && imageId) {
          setBlock(blockId);
          setImage(imageId);
        } else if (data.blocks?.length > 0) {
          const firstBlock = data.blocks[0];
          setBlock(firstBlock.id);
          if (firstBlock.labs?.length > 0) {
            setImage(firstBlock.labs[0].id);
          }
        }
      })
      .catch((err) => console.error('Failed to load manifest:', err));
  }, [setManifest, setBlock, setImage]);

  // Sync state to URL
  useEffect(() => {
    if (currentBlockId && currentImageId) {
      const params = new URLSearchParams(window.location.search);
      params.set('block', currentBlockId);
      params.set('view', currentImageId);
      window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
    }
  }, [currentBlockId, currentImageId]);

  // Idle detection
  useEffect(() => {
    let timeout: number;
    const resetIdle = () => {
      setIdle(false);
      clearTimeout(timeout);
      timeout = window.setTimeout(() => setIdle(true), 5000);
    };

    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('keydown', resetIdle);
    window.addEventListener('click', resetIdle);
    resetIdle();

    return () => {
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('keydown', resetIdle);
      window.removeEventListener('click', resetIdle);
      clearTimeout(timeout);
    };
  }, [setIdle]);

  return (
    <div className="w-screen h-screen bg-black relative overflow-hidden">
      {/* 3D Canvas - Full Screen */}
      <div className="absolute inset-0 w-full h-full" style={{ width: '100vw', height: '100vh' }}>
        <Canvas
          camera={{ fov: 75, position: [0, 0, 0.1] }}
          style={{ width: '100%', height: '100%', display: 'block' }}
          gl={{ preserveDrawingBuffer: true }}
        >
          <XR store={xrStore}>
            <Suspense fallback={null}>
              <Scene />
              <Controls />
            </Suspense>
          </XR>
        </Canvas>
      </div>

      {/* UI Layer */}
      <Loader />
      <TransitionOverlay />
      <AmbientAudio />
      <GameOverlay />
      <HelpOverlay />
      <TopBar />
      <BottomControls />
      <Compass />
      <MapOverlay />
    </div>
  );
}

export default App;
