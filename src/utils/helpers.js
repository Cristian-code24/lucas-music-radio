/**
 * Player status constants
 */
export const PLAYER_STATUS = {
  IDLE: 'IDLE',
  CONNECTING: 'CONNECTING',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  ERROR: 'ERROR',
};

/**
 * Format volume for display (0-100)
 */
export function formatVolume(volume) {
  return Math.round(volume * 100);
}

/**
 * Clamp a value between min and max
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Check if reduced motion is preferred
 */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
