import { useEffect, Suspense } from 'react';
import { Scene } from './components/Viewer/Scene';
import { Canvas } from '@react-three/fiber';
import { Controls } from './components/Viewer/Controls';
import { Overlay } from './components/UI/Overlay';
import { Loader } from './components/UI/Loader';
import { Navbar } from './components/UI/Navbar';
import { ArrowControls } from './components/UI/ArrowControls';
import { LocationBar } from './components/UI/LocationBar';
import { Landing } from './components/UI/Landing';
import { useTourState } from './hooks/useTourState';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const { 
    setManifest, 
    setBlock, 
    setImage, 
    setIdle, 
    currentBlockId, 
    currentImageId,
    isTourStarted 
  } = useTourState();

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
      <AnimatePresence mode="wait">
        {!isTourStarted ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Landing />
          </motion.div>
        ) : (
          <motion.div
            key="tour"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full"
          >
            {/* 3D Canvas - Full Screen */}
            <Canvas camera={{ fov: 75, position: [0, 0, 0.1] }}>
              <Suspense fallback={null}>
                <Scene />
                <Controls />
              </Suspense>
            </Canvas>

            {/* UI Layer */}
            <Loader />
            <Navbar />
            <LocationBar />
            <ArrowControls />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
