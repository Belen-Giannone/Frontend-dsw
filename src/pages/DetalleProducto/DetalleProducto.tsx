import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import { useCarrito } from '../../context/CarritoContext';
import { useToast } from '../../context/ToastContext';
import './DetalleProducto.css';

const DetalleProducto: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [producto, setProducto] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { carrito, agregarAlCarrito } = useCarrito();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await api.get(`/producto/${id}`);
        setProducto(response.data.data);
      } catch (error) {
        setProducto(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProducto();
  }, [id]);

  if (loading) return <div className="loading">Cargando producto...</div>;
  if (!producto) return <div className="error">Producto no encontrado.</div>;

  // Cantidad actual en el carrito para este producto
  const cantidadEnCarrito = carrito.find(item => item.id_producto === producto.idproducto)?.cantidad ?? 0;
  const stock = producto.cant_stock ?? 0;

  const handleAgregar = () => {
    if (cantidadEnCarrito < stock) {
      agregarAlCarrito(producto.idproducto, 1);
      showToast('Producto agregado al carrito', 'success');
    } else {
      showToast('No hay más stock disponible', 'error');
    }
  };

  return (
    <div className="detalle-producto">
      <img
        src={
          producto.imagen
            ? `http://localhost:4000/${producto.imagen.replace(/^\/+/, '')}`
            : '/placeholder.jpg'
        }
        alt={producto.nombre_prod}
        className="detalle-img"
      />
      <div className="detalle-info">
        <h2>{producto.nombre_prod}</h2>
        <p className="detalle-precio">${producto.precio}</p>
        <p>{producto.desc_prod}</p>
        <p>Stock disponible: {stock}</p>
        <p>En carrito: {cantidadEnCarrito}</p>
        <button
          className="agregar-carrito-btn"
          onClick={handleAgregar}
          disabled={stock === 0}
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
};

export default DetalleProducto;