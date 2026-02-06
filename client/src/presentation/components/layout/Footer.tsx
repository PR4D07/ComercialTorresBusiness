import './Footer.css';
import { Link } from 'react-router-dom';
import { trackEvent } from '../../utils/analytics';

export default function Footer() {
  const handleWhatsAppClick = () => {
    trackEvent('whatsapp_click', {
      location: 'footer',
      link_url: 'https://wa.me/'
    });
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
            <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" onClick={handleWhatsAppClick}><i className="fab fa-whatsapp"></i></a>
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
          <p><i className="fas fa-map-marker-alt"></i> Jr. San Martin # 405, Bambamarca</p>
          <p><i className="fas fa-envelope"></i> contacto@comercialtorres.com</p>
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