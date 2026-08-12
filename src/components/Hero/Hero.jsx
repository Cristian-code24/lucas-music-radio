import { PLAYER_STATUS } from '../../utils/helpers';
import radioConfig from '../../config/radio';
import useRadioMetadata from '../../hooks/useRadioMetadata';
import LiveIndicator from '../LiveIndicator/LiveIndicator';
import PlayButton from '../PlayButton/PlayButton';
import AudioVisualizer from '../AudioVisualizer/AudioVisualizer';
import VolumeControl from '../VolumeControl/VolumeControl';
import NowPlaying from '../NowPlaying/NowPlaying';
import './Hero.css';

export default function Hero({
  status,
  volume,
  isMuted,
  errorMessage,
  onTogglePlay,
  onVolumeChange,
  onToggleMute,
  getFrequencyData,
  useFallback,
}) {
  const isError = status === PLAYER_STATUS.ERROR;
  const { songTitle } = useRadioMetadata(status);

  return (
    <section className="hero" id="inicio" aria-label="Reproductor principal">
      {/* Background effects */}
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__blob hero__blob--1" />
        <div className="hero__blob hero__blob--2" />
        <div className="hero__blob hero__blob--3" />
        <div className="hero__noise" />
      </div>

      <div className="hero__content">
        {/* Radio logo placeholder */}
        <div className="hero__logo" aria-hidden="true">
          <svg viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="36" stroke="url(#hero-grad)" strokeWidth="2" opacity="0.6" />
            <circle cx="40" cy="40" r="24" stroke="url(#hero-grad)" strokeWidth="1.5" opacity="0.4" />
            <circle cx="40" cy="40" r="12" fill="url(#hero-grad)" />
            <path d="M40 4C40 4 50 16 50 40C50 64 40 76 40 76" stroke="url(#hero-grad)" strokeWidth="1.5" opacity="0.3" />
            <path d="M40 4C40 4 30 16 30 40C30 64 40 76 40 76" stroke="url(#hero-grad)" strokeWidth="1.5" opacity="0.3" />
            <path d="M4 40C4 40 16 30 40 30C64 30 76 40 76 40" stroke="url(#hero-grad)" strokeWidth="1.5" opacity="0.3" />
            <path d="M4 40C4 40 16 50 40 50C64 50 76 40 76 40" stroke="url(#hero-grad)" strokeWidth="1.5" opacity="0.3" />
            <defs>
              <linearGradient id="hero-grad" x1="0" y1="0" x2="80" y2="80">
                <stop stopColor="#3b82f6" />
                <stop offset="0.5" stopColor="#8b5cf6" />
                <stop offset="1" stopColor="#d946ef" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Radio name */}
        <h1 className="hero__title">{radioConfig.name}</h1>
        <p className="hero__tagline">{radioConfig.tagline}</p>

        {/* Live indicator */}
        <div className="hero__status">
          <LiveIndicator status={status} />
        </div>

        {/* Visualizer + Play button area */}
        <div className="hero__player-area">
          <AudioVisualizer
            status={status}
            getFrequencyData={getFrequencyData}
            useFallback={useFallback}
          />
          <PlayButton
            status={status}
            onToggle={onTogglePlay}
          />
        </div>

        {/* Error message */}
        {isError && errorMessage && (
          <p className="hero__error" role="alert">
            {errorMessage}
          </p>
        )}

        {/* Volume */}
        <div className="hero__volume">
          <VolumeControl
            volume={volume}
            isMuted={isMuted}
            onVolumeChange={onVolumeChange}
            onToggleMute={onToggleMute}
          />
        </div>

        {/* Now Playing */}
        <NowPlaying status={status} title={songTitle} />
      </div>
    </section>
  );
}
