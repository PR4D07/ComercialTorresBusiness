import './Footer.css';
import { Link } from 'react-router-dom';
import { trackEvent } from '../../utils/analytics';
import { useAuth } from '../../context/AuthContext';

export default function Footer() {
  const { user } = useAuth();

  const getShortName = () => {
    const displayName = user?.displayName?.trim();
    if (!displayName) return '';
    const parts = displayName.split(/\s+/);
    if (parts.length === 0) return '';
    const first = parts[0];
    const last = parts.length > 1 ? parts[1] : '';
    return last ? `${first} ${last}` : first;
  };

  const buildWhatsAppUrl = () => {
    const phone = '51910025590';
    const shortName = getShortName();
    const baseText = shortName
      ? `Buenos días, mi nombre es ${shortName}. Quisiera información sobre productos y precios.`
      : 'Buenos días, quisiera información sobre productos y precios.';
    const encoded = encodeURIComponent(baseText);
    return `https://wa.me/${phone}?text=${encoded}`;
  };

  const handleWhatsAppClick = () => {
    const url = buildWhatsAppUrl();
    trackEvent('whatsapp_click', {
      source: 'footer',
      link_url: url
    });

    try {
      let apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      if (apiUrl.endsWith('/')) {
        apiUrl = apiUrl.slice(0, -1);
      }
      if (!apiUrl.endsWith('/api') && !apiUrl.includes('localhost')) {
        apiUrl += '/api';
      }

      void fetch(`${apiUrl}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          event_type: 'whatsapp_click',
          metadata: {
            source: 'footer',
            link_url: url
          }
        })
      });
    } catch (err) {
      console.error('Error tracking WhatsApp click event from footer', err);
    }
  };

  return (
    <footer className="site-footer">
      <div className="container footer-content">
        <div className="footer-section">
          <h3>Comercial Torres</h3>
          <p>Líderes en el mercado local de calzado y artículos de cuero.</p>
          <div className="footer-socials">
            <a href="https://www.facebook.com/profile.php?id=61586891979849" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
            <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-tiktok"></i></a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
            >
              <i className="fab fa-whatsapp"></i>
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Enlaces Rápidos</h3>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/about">Nosotros</Link></li>
            <li><Link to="/profile">Mi Cuenta</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contacto</h3>
          <p>
            <i className="fas fa-map-marker-alt"></i>{' '}
            <a
              href="https://maps.app.goo.gl/hvMhUkFXnqtEdS196"
              target="_blank"
              rel="noopener noreferrer"
            >
              Jr. San Martin # 405, Bambamarca
            </a>
          </p>
          <p>
            <i className="fas fa-envelope"></i>{' '}
            <a href="mailto:comercialtorresvz@gmail.com">
              comercialtorresvz@gmail.com
            </a>
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Comercial Torres - Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
