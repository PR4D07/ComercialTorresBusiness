import React from 'react';
import './AboutPage.css';
import { trackEvent } from '../utils/analytics';

const AboutPage: React.FC = () => {
  const handleWhatsAppClick = () => {
    trackEvent('whatsapp_click', {
      source: 'about_page'
    });
  };

  return (
    <div className="about-page">
      <div className="about-header">
        <h1>Nosotros</h1>
        <p>Conoce más sobre Comercial Torres y nuestra pasión por la calidad.</p>
      </div>

      <section className="about-section">
        <h2>Nuestra Historia</h2>
        <p className="history-text">
          Comercial Torres nació con el firme propósito de ofrecer calzado y artículos de cuero de la más alta calidad en la región de Cajamarca. 
          A lo largo de los años, nos hemos consolidado como un referente en Bambamarca, gracias a la confianza de nuestros clientes y nuestro 
          compromiso inquebrantable con la excelencia. Desde nuestros inicios en Jr. San Martín, hemos crecido junto a nuestra comunidad, 
          adaptándonos a las nuevas tendencias sin perder nuestra esencia tradicional.
        </p>
      </section>

      <section className="about-section">
        <h2>Misión</h2>
        <p>
          Brindar a cada uno de nuestros usuarios locales calzados y artículos de cuero de calidad a precios accesibles acorde a sus necesidades, 
          brindando un excelente servicio al cliente en cada interacción.
        </p>
      </section>

      <section className="about-section">
        <h2>Visión</h2>
        <p>
          Consolidarnos como líderes en el mercado local de calzado y artículos de cuero, expandiendonos y manteniendo la excelencia y calidad 
          en nuestros servicios y productos, mientras exploramos oportunidades en sectores complementarios.
        </p>
      </section>

      <section className="about-section">
        <h2>Nuestros Valores</h2>
        <div className="values-grid">
          <div className="value-card">
            <h3>Calidad</h3>
            <p>En nuestros productos y servicios.</p>
          </div>
          <div className="value-card">
            <h3>Honestidad</h3>
            <p>En todas nuestras transacciones comerciales.</p>
          </div>
          <div className="value-card">
            <h3>Compromiso</h3>
            <p>Con la satisfacción total del cliente.</p>
          </div>
          <div className="value-card">
            <h3>Trabajo en Equipo</h3>
            <p>Y respeto mutuo entre colaboradores.</p>
          </div>
          <div className="value-card">
            <h3>Adaptabilidad</h3>
            <p>A las necesidades cambiantes del mercado.</p>
          </div>
          <div className="value-card">
            <h3>Responsabilidad</h3>
            <p>Social y comunitaria con nuestro entorno.</p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>Ubicación y Contacto</h2>
        <div className="location-details">
          <p><strong>Dirección:</strong> Jr. San Martin # 405, Bambamarca, Hualgayoc, Cajamarca.</p>
          <p><em>(A una cuadra del mercado y dos cuadras de la plaza de armas)</em></p>
        </div>

        <div className="social-buttons">
          <a href="https://www.facebook.com/profile.php?id=61586891979849" target="_blank" rel="noopener noreferrer" className="social-btn btn-facebook">
            <i className="fab fa-facebook-f"></i> Facebook
          </a>
          <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" className="social-btn btn-tiktok">
            <i className="fab fa-tiktok"></i> TikTok
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="social-btn btn-instagram">
            <i className="fab fa-instagram"></i> Instagram
          </a>
          <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="social-btn btn-whatsapp" onClick={handleWhatsAppClick}>
            <i className="fab fa-whatsapp"></i> WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;