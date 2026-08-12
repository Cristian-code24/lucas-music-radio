import { useRef, useCallback, useEffect, useState } from 'react';
import { PLAYER_STATUS, prefersReducedMotion } from '../utils/helpers';

/**
 * Audio visualizer hook using Web Audio API
 * Falls back to animated visualization if CORS blocks analysis
 */
export default function useAudioVisualizer(audioElement, status) {
  const [useFallback, setUseFallback] = useState(false);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const dataArrayRef = useRef(null);
  const connectedRef = useRef(false);

  // Initialize Web Audio API context and analyser
  const initializeAnalyser = useCallback(() => {
    if (!audioElement || connectedRef.current) return;

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) {
        console.warn('[Visualizer] Web Audio API not supported');
        setUseFallback(true);
        return;
      }

      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      try {
        const source = ctx.createMediaElementSource(audioElement);
        source.connect(analyser);
        analyser.connect(ctx.destination);

        sourceRef.current = source;
        connectedRef.current = true;
        setUseFallback(false);
      } catch (err) {
        // CORS or already-connected error
        console.warn('[Visualizer] Cannot create media source (likely CORS):', err.message);
        ctx.close();
        setUseFallback(true);
        return;
      }

      audioContextRef.current = ctx;
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;
    } catch (err) {
      console.warn('[Visualizer] Failed to initialize Web Audio:', err);
      setUseFallback(true);
    }
  }, [audioElement]);

  // Get current frequency data
  const getFrequencyData = useCallback(() => {
    if (!analyserRef.current || !dataArrayRef.current || useFallback) {
      return null;
    }

    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    return dataArrayRef.current;
  }, [useFallback]);

  // Resume AudioContext (required by browsers after user gesture)
  const resumeContext = useCallback(() => {
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  }, []);

  // Try to connect when audio element becomes available and playing
  useEffect(() => {
    if (status === PLAYER_STATUS.PLAYING && audioElement && !connectedRef.current) {
      initializeAnalyser();
    }

    if (status === PLAYER_STATUS.PLAYING) {
      resumeContext();
    }
  }, [status, audioElement, initializeAnalyser, resumeContext]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
      connectedRef.current = false;
    };
  }, []);

  return {
    getFrequencyData,
    analyser: analyserRef.current,
    useFallback,
    isReducedMotion: prefersReducedMotion(),
    bufferLength: analyserRef.current?.frequencyBinCount || 128,
  };
}
