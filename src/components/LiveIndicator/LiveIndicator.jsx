import { PLAYER_STATUS } from '../../utils/helpers';
import './LiveIndicator.css';

export default function LiveIndicator({ status }) {
  const isLive = status === PLAYER_STATUS.PLAYING;
  const isConnecting = status === PLAYER_STATUS.CONNECTING;

  return (
    <div
      className={`live-indicator ${isLive ? 'live-indicator--live' : ''} ${isConnecting ? 'live-indicator--connecting' : ''}`}
      role="status"
      aria-live="polite"
      aria-label={isLive ? 'Transmitiendo en vivo' : isConnecting ? 'Conectando' : 'Desconectado'}
    >
      <span className="live-indicator__dot" />
      <span className="live-indicator__text">
        {isLive ? 'EN VIVO' : isConnecting ? 'CONECTANDO' : 'DESCONECTADO'}
      </span>
    </div>
  );
}
