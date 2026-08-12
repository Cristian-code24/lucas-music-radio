import { useState, useEffect, useRef } from 'react';
import { PLAYER_STATUS } from '../utils/helpers';

/**
 * Hook to periodically fetch radio metadata (song title)
 * @param {string} status - Current player status
 * @param {number} intervalMs - Polling interval in milliseconds
 */
export default function useRadioMetadata(status, intervalMs = 15000) {
  const [songTitle, setSongTitle] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Only poll when playing or connecting
    if (status !== PLAYER_STATUS.PLAYING && status !== PLAYER_STATUS.CONNECTING) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    let isMounted = true;

    const fetchMetadata = async () => {
      if (!isMounted) return;
      
      try {
        setIsFetching(true);
        // This hits the Vercel Serverless Function we created
        const response = await fetch('/api/metadata');
        
        if (response.ok) {
          const data = await response.json();
          if (isMounted && data.title !== undefined) {
            setSongTitle(data.title);
          }
        }
      } catch (err) {
        console.error('[RadioMetadata] Failed to fetch metadata:', err);
      } finally {
        if (isMounted) {
          setIsFetching(false);
          timeoutRef.current = setTimeout(fetchMetadata, intervalMs);
        }
      }
    };

    // Initial fetch
    fetchMetadata();

    return () => {
      isMounted = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [status, intervalMs]);

  return {
    songTitle,
    isFetching,
  };
}
