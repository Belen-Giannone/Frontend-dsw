import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import './DetalleProducto.css';

const DetalleProducto: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [producto, setProducto] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
        <button className="agregar-carrito-btn">Agregar al carrito</button>
      </div>
    </div>
  );
};

export default DetalleProducto;