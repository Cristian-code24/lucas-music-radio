import { useState, useRef, useCallback, useEffect } from 'react';
import { PLAYER_STATUS, clamp } from '../utils/helpers';
import radioConfig from '../config/radio';

/**
 * Core audio player hook
 * Manages audio playback, volume, mute, reconnection, and status
 */
export default function useAudioPlayer() {
  const [status, setStatus] = useState(PLAYER_STATUS.IDLE);
  const [volume, setVolumeState] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [corsSupported, setCorsSupported] = useState(true);

  const audioRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const corsRetryRef = useRef(false);

  // Initialize audio element
  const getAudio = useCallback((withCors = true) => {
    if (!audioRef.current) {
      const audio = new Audio();
      if (withCors) {
        audio.crossOrigin = 'anonymous';
      }
      audio.preload = 'none';
      audioRef.current = audio;
    }
    return audioRef.current;
  }, []);

  // Recreate audio element without CORS for fallback
  const recreateAudioWithoutCors = useCallback(() => {
    const oldAudio = audioRef.current;
    if (oldAudio) {
      oldAudio.pause();
      oldAudio.removeAttribute('src');
      oldAudio.load();
    }
    audioRef.current = null;
    corsRetryRef.current = true;
    setCorsSupported(false);

    const audio = new Audio();
    audio.preload = 'none';
    audioRef.current = audio;
    return audio;
  }, []);

  // Clear reconnection timer
  const clearReconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  // Attempt reconnection with exponential backoff
  const attemptReconnect = useCallback(() => {
    const { maxAttempts, initialDelay, maxDelay, backoffMultiplier } = radioConfig.reconnect;

    if (reconnectAttemptsRef.current >= maxAttempts) {
      setStatus(PLAYER_STATUS.ERROR);
      setErrorMessage('No se pudo reconectar. Intenta nuevamente.');
      reconnectAttemptsRef.current = 0;
      return;
    }

    const delay = Math.min(
      initialDelay * Math.pow(backoffMultiplier, reconnectAttemptsRef.current),
      maxDelay
    );

    reconnectAttemptsRef.current += 1;

    reconnectTimeoutRef.current = setTimeout(() => {
      const audio = audioRef.current;
      const streamUrl = radioConfig.streamUrl;

      if (!streamUrl || !audio) return;

      setStatus(PLAYER_STATUS.CONNECTING);

      // Add cache-busting to force fresh connection
      const separator = streamUrl.includes('?') ? '&' : '?';
      audio.src = `${streamUrl}${separator}_t=${Date.now()}`;
      audio.load();
      audio.play().catch((err) => {
        console.error('[RadioPlayer] Reconnect play failed:', err);
        attemptReconnect();
      });
    }, delay);
  }, []);

  // Play stream
  const play = useCallback(() => {
    const streamUrl = radioConfig.streamUrl;

    if (!streamUrl) {
      setStatus(PLAYER_STATUS.ERROR);
      setErrorMessage('Configura tu stream para comenzar a transmitir.');
      console.warn('[RadioPlayer] No stream URL configured. Set VITE_RADIO_STREAM_URL in .env');
      return;
    }

    let audio = getAudio();
    setStatus(PLAYER_STATUS.CONNECTING);
    setErrorMessage('');
    clearReconnect();
    reconnectAttemptsRef.current = 0;

    // Add cache-busting
    const separator = streamUrl.includes('?') ? '&' : '?';
    const srcUrl = `${streamUrl}${separator}_t=${Date.now()}`;
    audio.src = srcUrl;
    audio.volume = isMuted ? 0 : volume;
    audio.load();

    const playPromise = audio.play();
    if (playPromise) {
      playPromise.catch((err) => {
        console.error('[RadioPlayer] Play failed:', err);

        // If CORS causes the failure and we haven't retried yet, retry without CORS
        if (!corsRetryRef.current && (err.name === 'NotSupportedError' || err.name === 'NotAllowedError')) {
          console.warn('[RadioPlayer] Retrying without CORS (visualizer will use fallback)...');
          audio = recreateAudioWithoutCors();
          audio.src = srcUrl;
          audio.volume = isMuted ? 0 : volume;
          audio.load();
          audio.play().catch((err2) => {
            console.error('[RadioPlayer] Play failed without CORS too:', err2);
            setStatus(PLAYER_STATUS.ERROR);
            setErrorMessage('No se pudo conectar con la radio. Intenta nuevamente.');
          });
          return;
        }

        setStatus(PLAYER_STATUS.ERROR);
        setErrorMessage('No se pudo conectar con la radio. Intenta nuevamente.');
      });
    }
  }, [getAudio, volume, isMuted, clearReconnect, recreateAudioWithoutCors]);

  // Pause/stop stream
  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
    }
    clearReconnect();
    reconnectAttemptsRef.current = 0;
    setStatus(PLAYER_STATUS.PAUSED);
  }, [clearReconnect]);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (status === PLAYER_STATUS.PLAYING || status === PLAYER_STATUS.CONNECTING) {
      pause();
    } else {
      play();
    }
  }, [status, play, pause]);

  // Set volume
  const setVolume = useCallback((newVolume) => {
    const clamped = clamp(newVolume, 0, 1);
    setVolumeState(clamped);

    const audio = audioRef.current;
    if (audio) {
      if (!isMuted) {
        audio.volume = clamped;
      }
      if (clamped > 0 && isMuted) {
        setIsMuted(false);
        audio.volume = clamped;
      }
    }
  }, [isMuted]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      setIsMuted(false);
      audio.volume = volume;
    } else {
      setIsMuted(true);
      audio.volume = 0;
    }
  }, [isMuted, volume]);

  // Setup audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlaying = () => {
      setStatus(PLAYER_STATUS.PLAYING);
      reconnectAttemptsRef.current = 0;
    };

    const onWaiting = () => {
      setStatus((prev) => {
        if (prev === PLAYER_STATUS.PAUSED || prev === PLAYER_STATUS.IDLE) return prev;
        return PLAYER_STATUS.CONNECTING;
      });
    };

    const onError = () => {
      console.error('[RadioPlayer] Audio error event');
      setStatus((prev) => {
        if (prev === PLAYER_STATUS.PLAYING || prev === PLAYER_STATUS.CONNECTING) {
          attemptReconnect();
          return prev; // attemptReconnect will update status
        }
        return prev;
      });
    };

    const onStalled = () => {
      console.warn('[RadioPlayer] Stream stalled');
    };

    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('error', onError);
    audio.addEventListener('stalled', onStalled);

    return () => {
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('stalled', onStalled);
    };
  }, [corsSupported, attemptReconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearReconnect();
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.removeAttribute('src');
      }
    };
  }, [clearReconnect]);

  return {
    status,
    volume,
    isMuted,
    errorMessage,
    corsSupported,
    audioElement: audioRef.current,
    getAudio,
    play,
    pause,
    togglePlay,
    setVolume,
    toggleMute,
  };
}
