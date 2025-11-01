import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrito } from '../../context/CarritoContext';
import { useToast } from '../../context/ToastContext';
import './ProductCard.css';

interface ProductCardProps {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  stock: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, nombre, precio, imagen, stock }) => {
  const navigate = useNavigate();
  const { carrito, agregarAlCarrito } = useCarrito();
  const { showToast } = useToast();

  // Evita que el click en el botón navegue al detalle
  const handleCardClick = (e: React.MouseEvent) => {
    // si hace click en el boton del carrito no navega
    if ((e.target as HTMLElement).tagName.toLowerCase() === 'button') return;
    navigate(`/producto/${id}`);
  };

    // Calcula la cantidad actual en el carrito para este producto
  const cantidadEnCarrito = carrito.find(item => item.id_producto === id)?.cantidad ?? 0;

 const handleAgregar = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cantidadEnCarrito < stock) {
      agregarAlCarrito(id, 1);
      showToast('Producto agregado al carrito', 'success');
    } else {
      showToast('No hay más stock disponible', 'error');
    }
  };

  return (
    <div className="product-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <img src={imagen} alt={nombre} className="product-img" />
      <h3>{nombre}</h3>
      <p className="product-price">${precio}</p>
      <button onClick={handleAgregar} disabled={stock === 0}>
        Agregar al carrito
      </button>
    </div>
  );
};

export default ProductCard;