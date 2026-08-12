import { useState } from 'react';
import { PLAYER_STATUS } from '../../utils/helpers';
import radioConfig from '../../config/radio';
import './Header.css';

export default function Header({ status, onTogglePlay }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isPlaying = status === PLAYER_STATUS.PLAYING;

  return (
    <header className="header" role="banner">
      <div className="header__container">
        {/* Logo + Name */}
        <a href="/" className="header__brand" aria-label={`${radioConfig.name} - Inicio`}>
          <div className="header__logo" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" stroke="url(#header-gradient)" strokeWidth="2" />
              <circle cx="16" cy="16" r="6" fill="url(#header-gradient)" />
              <path d="M16 2C16 2 20 8 20 16C20 24 16 30 16 30" stroke="url(#header-gradient)" strokeWidth="1.5" opacity="0.5" />
              <path d="M16 2C16 2 12 8 12 16C12 24 16 30 16 30" stroke="url(#header-gradient)" strokeWidth="1.5" opacity="0.5" />
              <defs>
                <linearGradient id="header-gradient" x1="0" y1="0" x2="32" y2="32">
                  <stop stopColor="#3b82f6" />
                  <stop offset="0.5" stopColor="#8b5cf6" />
                  <stop offset="1" stopColor="#d946ef" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="header__name">{radioConfig.name}</span>
        </a>

        {/* Desktop nav */}
        <nav className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`} role="navigation" aria-label="Navegación principal">
          <a href="#inicio" className="header__link" onClick={() => setMenuOpen(false)}>Inicio</a>
          <a href="#info" className="header__link" onClick={() => setMenuOpen(false)}>Info</a>

          {/* Mini play button in header */}
          <button
            className={`header__play-btn ${isPlaying ? 'header__play-btn--playing' : ''}`}
            onClick={() => { onTogglePlay(); setMenuOpen(false); }}
            aria-label={isPlaying ? 'Detener radio' : 'Escuchar radio'}
            id="header-play-button"
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M8 5.14v13.72a1 1 0 001.5.86l11.73-6.86a1 1 0 000-1.72L9.5 4.28A1 1 0 008 5.14z" />
              </svg>
            )}
            <span>{isPlaying ? 'En vivo' : 'Escuchar'}</span>
          </button>
        </nav>

        {/* Mobile menu button */}
        <button
          className={`header__menu-btn ${menuOpen ? 'header__menu-btn--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          id="menu-toggle"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
