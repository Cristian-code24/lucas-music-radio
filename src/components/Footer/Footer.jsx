import radioConfig from '../../config/radio';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__container">
        <div className="footer__brand">
          <span className="footer__name">{radioConfig.name}</span>
          <span className="footer__tagline">{radioConfig.tagline}</span>
        </div>

        <div className="footer__divider" />

        <p className="footer__copyright">
          © {year} {radioConfig.name}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
