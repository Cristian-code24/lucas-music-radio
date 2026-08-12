import { PLAYER_STATUS } from '../../utils/helpers';
import './NowPlaying.css';

export default function NowPlaying({ status, title, artist }) {
  const isActive = status === PLAYER_STATUS.PLAYING;
  const displayTitle = title || 'Radio en vivo';
  const displayArtist = artist || '';

  return (
    <div className={`now-playing ${isActive ? 'now-playing--active' : ''}`}>
      <div className="now-playing__icon" aria-hidden="true">
        {isActive ? (
          <div className="now-playing__bars">
            <span /><span /><span /><span />
          </div>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        )}
      </div>
      <div className="now-playing__info">
        <span className="now-playing__label">Ahora Suena</span>
        <span className="now-playing__title">{displayTitle}</span>
        {displayArtist && (
          <span className="now-playing__artist">{displayArtist}</span>
        )}
      </div>
    </div>
  );
}
