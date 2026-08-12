import { PLAYER_STATUS } from '../../utils/helpers';
import './PlayButton.css';

export default function PlayButton({ status, onToggle }) {
  const isPlaying = status === PLAYER_STATUS.PLAYING;
  const isConnecting = status === PLAYER_STATUS.CONNECTING;
  const isError = status === PLAYER_STATUS.ERROR;

  const getLabel = () => {
    if (isConnecting) return 'Conectando...';
    if (isPlaying) return 'Detener radio';
    if (isError) return 'Reintentar conexión';
    return 'Escuchar radio';
  };

  return (
    <button
      className={`play-button ${isPlaying ? 'play-button--playing' : ''} ${isConnecting ? 'play-button--connecting' : ''} ${isError ? 'play-button--error' : ''}`}
      onClick={onToggle}
      aria-label={getLabel()}
      title={getLabel()}
      id="play-button"
    >
      {/* Ripple rings */}
      {isPlaying && (
        <>
          <span className="play-button__ring play-button__ring--1" />
          <span className="play-button__ring play-button__ring--2" />
          <span className="play-button__ring play-button__ring--3" />
        </>
      )}

      {/* Glow effect */}
      <span className="play-button__glow" />

      {/* Button content */}
      <span className="play-button__inner">
        {isConnecting ? (
          <svg className="play-button__spinner" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeDasharray="50 20" />
          </svg>
        ) : isPlaying ? (
          <svg className="play-button__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg className="play-button__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5.14v13.72a1 1 0 001.5.86l11.73-6.86a1 1 0 000-1.72L9.5 4.28A1 1 0 008 5.14z" />
          </svg>
        )}
      </span>

      {/* Label below */}
      <span className="play-button__label">
        {isConnecting ? 'Conectando...' : isPlaying ? 'En reproducción' : 'Escuchar Radio'}
      </span>
    </button>
  );
}
