import React, { useEffect, useRef } from 'react';
import { useTourState } from '../../hooks/useTourState';

export const AmbientAudio: React.FC = () => {
  const { isAudioEnabled } = useTourState();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio
    const audio = new Audio('/assets/audio/ambient.mp3'); // Placeholder path
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isAudioEnabled) {
      audioRef.current.play().catch((e) => {
        console.warn('Audio play failed (user interaction required):', e);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isAudioEnabled]);

  return null;
};
