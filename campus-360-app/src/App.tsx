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
import { OfflineIndicator, InstallPrompt, UpdatePrompt } from './components/UI/PWAComponents';
import { SplashScreen } from './components/Kiosk/SplashScreen';
import { AttractMode } from './components/Kiosk/AttractMode';
import { useSessionStore } from './hooks/useSessionStore';
import { useActivityTracker } from './hooks/useActivityTracker';
import { AnimatePresence } from 'framer-motion';
import { WeatherWidget } from './components/Live/WeatherWidget';
import { UpcomingEventsWidget } from './components/Live/EventCalendar';
import { AnalyticsDashboard } from './components/Admin/AnalyticsDashboard';
import { useAnalyticsStore } from './hooks/useAnalyticsStore';
import { HighContrastProvider, HighContrastStyles } from './components/Accessibility/HighContrastMode';
import { OneHandModeControls } from './components/Accessibility/OneHandMode';
import { FeatureToolbar } from './components/UI/FeatureToolbar';
import { useFeatureSettingsStore } from './hooks/useFeatureSettingsStore';
import { TimeOfDayOverlay, TimeIndicator } from './components/Effects/TimeOfDayOverlay';

function App() {
  const { setManifest, setBlock, setImage, setIdle, currentBlockId, currentImageId } =
    useTourState();

  // Kiosk mode session management
  const { isSessionActive, isAttractMode, showSplashScreen } = useSessionStore();
  
  // Feature settings (all features off by default, user must enable)
  const {
    showWeather,
    setShowWeather,
    showEvents,
    setShowEvents,
    showAnalytics,
    setShowAnalytics,
    timeOfDay,
    setTimeOfDay,
    kioskModeEnabled,
  } = useFeatureSettingsStore();
  
  useActivityTracker(); // Track user activity for inactivity detection

  // Analytics tracking
  const { startSession, endSession, trackLocationEnter } = useAnalyticsStore();

  // Start analytics session when tour session starts
  useEffect(() => {
    if (isSessionActive) {
      startSession();
    } else {
      endSession();
    }
  }, [isSessionActive, startSession, endSession]);

  // Track location changes
  useEffect(() => {
    if (currentImageId && isSessionActive) {
      trackLocationEnter(currentImageId, currentImageId);
    }
  }, [currentImageId, isSessionActive, trackLocationEnter]);

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
      {/* Kiosk Mode Components - Only shown when kiosk mode is enabled */}
      {kioskModeEnabled && (
        <>
          <AnimatePresence>{showSplashScreen && <SplashScreen />}</AnimatePresence>
          {isAttractMode && <AttractMode />}
        </>
      )}

      <div className="absolute inset-0 w-full h-full" style={{ width: '100vw', height: '100vh' }}>
        <Canvas
          camera={{ fov: 75, position: [0, 0, 0.1] }}
          style={{ width: '100%', height: '100%', display: 'block' }}
          gl={{ preserveDrawingBuffer: true }}
        >
          <XR>
            <Suspense fallback={null}>
              <Scene />
              <Controls />
            </Suspense>
          </XR>
        </Canvas>
      </div>

      <Loader />
      <TransitionOverlay />
      <AmbientAudio />
      <GameOverlay />
      <HelpOverlay />
      <TopBar />
      <BottomControls />
      <Compass />
      <MapOverlay />

      <OfflineIndicator />
      <InstallPrompt />
      <UpdatePrompt />

      {/* Time of Day Effect */}
      <AnimatePresence>
        {timeOfDay !== 'auto' && <TimeOfDayOverlay timeOfDay={timeOfDay} />}
      </AnimatePresence>
      <TimeIndicator timeOfDay={timeOfDay} />

      {/* Conditional Features - Only shown when enabled by user */}
      <AnimatePresence>
        {showWeather && (
          <div className="fixed top-20 left-6 z-30">
            <WeatherWidget />
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEvents && <UpcomingEventsWidget />}
      </AnimatePresence>

      <AnimatePresence>
        {showAnalytics && <AnalyticsDashboard onClose={() => setShowAnalytics(false)} />}
      </AnimatePresence>

      {/* One-Hand Mode Controls (only when enabled in accessibility) */}
      <OneHandModeControls />
      
      {/* Unified Feature Toolbar */}
      <FeatureToolbar
        showWeather={showWeather}
        setShowWeather={setShowWeather}
        showEvents={showEvents}
        setShowEvents={setShowEvents}
        showAnalytics={showAnalytics}
        setShowAnalytics={setShowAnalytics}
        timeOfDay={timeOfDay}
        setTimeOfDay={setTimeOfDay}
      />
    </div>
  );
}

function AppWithProviders() {
  return (
    <HighContrastProvider>
      <HighContrastStyles />
      <App />
    </HighContrastProvider>
  );
}

export default AppWithProviders;
