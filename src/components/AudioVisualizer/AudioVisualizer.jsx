import { useRef, useEffect, useCallback } from 'react';
import { PLAYER_STATUS, prefersReducedMotion } from '../../utils/helpers';
import './AudioVisualizer.css';

const BAR_COUNT = 64;
const FALLBACK_BARS = 32;

export default function AudioVisualizer({ status, getFrequencyData, useFallback }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const isActive = status === PLAYER_STATUS.PLAYING;
  const reducedMotion = prefersReducedMotion();

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    // Set canvas resolution
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const innerRadius = Math.min(width, height) * 0.22;
    const maxBarHeight = Math.min(width, height) * 0.2;

    ctx.clearRect(0, 0, width, height);

    if (!isActive) return;

    let data = null;
    if (!useFallback && getFrequencyData) {
      data = getFrequencyData();
    }

    const barCount = data ? BAR_COUNT : FALLBACK_BARS;
    const angleStep = (Math.PI * 2) / barCount;

    for (let i = 0; i < barCount; i++) {
      let barHeight;

      if (data && data.length > 0) {
        // Real frequency data
        const dataIndex = Math.floor((i / barCount) * data.length);
        const value = data[dataIndex] / 255;
        barHeight = value * maxBarHeight;
      } else {
        // Fallback: animated sine wave pattern
        const time = Date.now() / 1000;
        const wave1 = Math.sin(time * 2 + i * 0.3) * 0.5 + 0.5;
        const wave2 = Math.sin(time * 1.5 + i * 0.5) * 0.3 + 0.3;
        const wave3 = Math.sin(time * 3 + i * 0.2) * 0.2 + 0.2;
        barHeight = (wave1 + wave2 + wave3) / 3 * maxBarHeight * 0.6;
      }

      barHeight = Math.max(barHeight, 2);

      const angle = angleStep * i - Math.PI / 2;
      const x1 = centerX + Math.cos(angle) * innerRadius;
      const y1 = centerY + Math.sin(angle) * innerRadius;
      const x2 = centerX + Math.cos(angle) * (innerRadius + barHeight);
      const y2 = centerY + Math.sin(angle) * (innerRadius + barHeight);

      // Color gradient based on bar position
      const hue = 210 + (i / barCount) * 100; // blue → violet → magenta
      const saturation = 80;
      const lightness = 55 + (barHeight / maxBarHeight) * 20;
      const alpha = 0.6 + (barHeight / maxBarHeight) * 0.4;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
      ctx.lineWidth = Math.max(2, (width / barCount) * 0.3);
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    // Glow ring
    const gradient = ctx.createRadialGradient(centerX, centerY, innerRadius - 4, centerX, centerY, innerRadius + 2);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.08)');
    gradient.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.15)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    animationRef.current = requestAnimationFrame(draw);
  }, [isActive, getFrequencyData, useFallback]);

  useEffect(() => {
    if (isActive && !reducedMotion) {
      animationRef.current = requestAnimationFrame(draw);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, draw, reducedMotion]);

  return (
    <div className={`audio-visualizer ${isActive ? 'audio-visualizer--active' : ''}`}>
      <canvas
        ref={canvasRef}
        className="audio-visualizer__canvas"
        aria-hidden="true"
      />
      {/* Reduced motion fallback */}
      {isActive && reducedMotion && (
        <div className="audio-visualizer__reduced" aria-hidden="true">
          <div className="audio-visualizer__static-ring" />
        </div>
      )}
    </div>
  );
}
