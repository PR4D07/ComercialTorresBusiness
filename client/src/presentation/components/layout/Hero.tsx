import './Hero.css';

export default function Hero() {
  return (
    <section className="hero-banner">
      <div className="hero-content">
        <h2>NUEVA COLECCIÓN</h2>
        <p>Descubre lo último en tendencias</p>
        <button 
          className="btn-primary" 
          onClick={() => {
            window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
          }}
        >
          COMPRAR AHORA
        </button>
      </div>
    </section>
  );
}
