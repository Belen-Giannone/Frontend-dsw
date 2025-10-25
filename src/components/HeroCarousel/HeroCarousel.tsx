import React, { useEffect, useState } from 'react';
import './HeroCarousel.css';

const images = [
  '/intel.png',
  '/auriculares.png',
  '/productos.png',
  '/teclado.png',
];

const HeroCarousel: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000); // Cambia cada 3 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="carousel-container">
      {images.map((src, idx) => (
        <img
          key={src}
          src={src}
          alt={`Banner ${idx + 1}`}
          className={`carousel-img${idx === current ? ' active' : ''}`}
        />
      ))}
    </div>
  );
};

export default HeroCarousel;