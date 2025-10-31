import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

interface ProductCardProps {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  onAddToCart: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, nombre, precio, imagen, onAddToCart }) => {
  const navigate = useNavigate();

  // Evita que el click en el botón navegue al detalle
  const handleCardClick = (e: React.MouseEvent) => {
    // si hace click en el boton del carrito no navega
    if ((e.target as HTMLElement).tagName.toLowerCase() === 'button') return;
    navigate(`/producto/${id}`);
  };

  return (
    <div className="product-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <img src={imagen} alt={nombre} className="product-img" />
      <h3>{nombre}</h3>
      <p className="product-price">${precio}</p>
      <button onClick={(e) => { e.stopPropagation(); onAddToCart(id); }}>
        Agregar al carrito
      </button>
    </div>
  );
};

export default ProductCard;