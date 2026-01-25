import { useState, useEffect } from 'react';
import './Hero.css';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?q=80&w=2070&auto=format&fit=crop',
    title: 'NUEVA COLECCIÓN',
    subtitle: 'Descubre lo último en tendencias'
  },
  {
    image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=2070&auto=format&fit=crop',
    title: 'CALZADO DEPORTIVO',
    subtitle: 'Rendimiento y estilo en cada paso'
  },
  {
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop',
    title: 'ELEGANCIA Y CONFORT',
    subtitle: 'Para tus momentos más especiales'
  }
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="hero-banner">
      {slides.map((slide, index) => (
        <div 
          key={index}
          className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
          style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${slide.image})` }}
        />
      ))}
      
      <div className="hero-content">
        <h2>{slides[currentSlide].title}</h2>
        <p>{slides[currentSlide].subtitle}</p>
        <button 
          className="btn-primary" 
          onClick={() => {
            window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
          }}
        >
          COMPRAR AHORA
        </button>
      </div>

      <div className="hero-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </section>
  );
}
