import { formatVolume } from '../../utils/helpers';
import './VolumeControl.css';

export default function VolumeControl({ volume, isMuted, onVolumeChange, onToggleMute }) {
  const displayVolume = isMuted ? 0 : formatVolume(volume);

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) {
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" opacity="0.3" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      );
    }
    if (volume < 0.5) {
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" opacity="0.3" />
          <path d="M15.54 8.46a5 5 0 010 7.07" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" opacity="0.3" />
        <path d="M19.07 4.93a10 10 0 010 14.14" />
        <path d="M15.54 8.46a5 5 0 010 7.07" />
      </svg>
    );
  };

  const handleSliderChange = (e) => {
    onVolumeChange(parseFloat(e.target.value));
  };

  return (
    <div className="volume-control" role="group" aria-label="Control de volumen">
      <button
        className="volume-control__mute-btn"
        onClick={onToggleMute}
        aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
        title={isMuted ? 'Activar sonido' : 'Silenciar'}
        id="mute-button"
      >
        {getVolumeIcon()}
      </button>

      <div className="volume-control__slider-wrapper">
        <input
          type="range"
          className="volume-control__slider"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleSliderChange}
          aria-label={`Volumen: ${displayVolume}%`}
          id="volume-slider"
          style={{ '--volume-percent': `${isMuted ? 0 : volume * 100}%` }}
        />
      </div>

      <span className="volume-control__value" aria-hidden="true">
        {displayVolume}%
      </span>
    </div>
  );
}
