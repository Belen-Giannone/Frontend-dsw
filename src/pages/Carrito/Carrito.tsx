import React, { useEffect, useState } from 'react';
import { useCarrito } from '../../context/CarritoContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import type { Producto } from '../../types';
import './Carrito.css';

const Carrito: React.FC = () => {
  const { carrito, quitarDelCarrito, actualizarCantidad, limpiarCarrito } = useCarrito();
  const { showToast } = useToast();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      try {
        const detalles = await Promise.all(
          carrito.map(async (item) => {
            const res = await api.get(`/producto/${item.id_producto}`);
            return res.data.data;
          })
        );
        setProductos(detalles);
      } catch (error) {
        setProductos([]);
      } finally {
        setLoading(false);
      }
    };

    if (carrito.length > 0) {
      fetchProductos();
    } else {
      setProductos([]);
      setLoading(false);
    }
  }, [carrito]);

  // Calcula el total
  const total = carrito.reduce((sum, item) => {
    const prod = productos.find(p => p.idproducto === item.id_producto);
    return sum + (prod ? prod.precio * item.cantidad : 0);
  }, 0);

  const handleLimpiarCarrito = () => {
    limpiarCarrito();
    showToast('¡El carrito fue vaciado!', 'info');
  };

  return (
    <div className="carrito-page">
      <h1>Carrito</h1>
      <div className="carrito-content">
        <div className="carrito-lista">
          {loading ? (
            <div>Cargando productos...</div>
          ) : (
            carrito.map((item) => {
              const prod = productos.find(p => p.idproducto === item.id_producto);
              if (!prod) return null;
              const maxStock = prod.cant_stock ?? 1;
              return (
                <div className="carrito-item" key={item.id_producto}>
                  <h2>{prod.nombre_prod}</h2>
                  <p>{prod.desc_prod}</p>
                  <p><b>Precio:</b> {prod.precio}</p>
                  <p><b>Cantidad</b> {item.cantidad}</p>
                  <button
                  onClick={() => {
                      quitarDelCarrito(item.id_producto);
                      showToast('Producto eliminado del carrito', 'info');
                    }}
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={() => {
                      if (item.cantidad < maxStock) {
                        actualizarCantidad(item.id_producto, item.cantidad + 1);
                      } else {
                        showToast('No hay más stock disponible', 'error');
                      }
                    }}
                    disabled={item.cantidad >= maxStock}
                  >
                    +
                  </button>
                  <button
                    onClick={() => actualizarCantidad(item.id_producto, Math.max(1, item.cantidad - 1))}
                    disabled={item.cantidad <= 1}
                  >
                    -
                  </button>
                  </div>
              );
            })
          )}
        </div>
        <div className="carrito-resumen">
          <h2>Resumen del Pedido</h2>
          <p>Total de productos: {carrito.reduce((sum, item) => sum + item.cantidad, 0)}</p>
          <p><b>Total:</b> {total}</p>
          <button onClick={() => {/* lógica para realizar pedido */}}>Realizar pedido</button>
          <button
            onClick={handleLimpiarCarrito}
            style={{ marginTop: '1rem', background: '#e74c3c', color: '#fff' }}
          >
            Vaciar carrito
          </button>
        </div>
      </div>
    </div>
  );
}

export default Carrito;