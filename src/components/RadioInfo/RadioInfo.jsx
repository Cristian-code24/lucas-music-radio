import radioConfig from '../../config/radio';
import './RadioInfo.css';

export default function RadioInfo() {
  const { description, genre, location, frequency } = radioConfig;

  const infoItems = [
    { label: 'Género', value: genre, icon: '🎵' },
    { label: 'Frecuencia', value: frequency, icon: '📡' },
    { label: 'Ubicación', value: location, icon: '📍' },
  ].filter(item => item.value);

  return (
    <section className="radio-info" aria-label="Información de la emisora">
      <div className="radio-info__card">
        <h2 className="radio-info__title">Sobre la emisora</h2>
        <p className="radio-info__description">{description}</p>

        {infoItems.length > 0 && (
          <div className="radio-info__details">
            {infoItems.map(item => (
              <div key={item.label} className="radio-info__item">
                <span className="radio-info__item-icon" aria-hidden="true">{item.icon}</span>
                <div className="radio-info__item-content">
                  <span className="radio-info__item-label">{item.label}</span>
                  <span className="radio-info__item-value">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
