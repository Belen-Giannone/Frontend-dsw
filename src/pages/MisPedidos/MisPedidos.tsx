import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import './MisPedidos.css';

const MisPedidos: React.FC = () => {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [detallePedido, setDetallePedido] = useState<any | null>(null);
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const res = await api.get('/pedido/mis-pedidos');
        setPedidos(res.data.data || []);
      } catch (error: any) {
        showToast('Error al cargar tus pedidos', 'error');
      }
    };
    fetchPedidos();
  }, []);

const verDetalle = async (id_pedido: number) => {
  try {
    const res = await api.get(`/productos_pedido/${id_pedido}`);
    setDetallePedido(res.data); // <-- Cambia esto
  } catch (error: any) {
    showToast('Error al cargar el detalle del pedido', 'error');
  }
};

  if (!user) return <div>Debes iniciar sesión para ver tus pedidos.</div>;

return (
  <div className="mis-pedidos-container">
    <h2>Mis pedidos</h2>
    {pedidos.length === 0 ? (
      <p>No tienes pedidos realizados.</p>
    ) : (
      pedidos.map((pedido) => (
        <div key={pedido.id_pedido} className="pedido-item">
          <b>Pedido #{pedido.id_pedido}</b> - {new Date(pedido.fecha_pedido).toLocaleString()}<br />
          Estado: {pedido.estado_pedido} <br />
          Total: ${pedido.total_pedido}
          <button
            className="pedido-detalle-btn"
            onClick={() => verDetalle(pedido.id_pedido)}
          >
            Ver detalle
          </button>
          <ul>
            {pedido.productosPedido?.map((prod: any) => (
              <li key={prod.id}>
                {prod.producto?.nombre_prod} x{prod.cantidad} - ${prod.precio_unitario}
              </li>
            ))}
          </ul>
        </div>
      ))
    )}

    {/* Modal de detalle */}
    {detallePedido && (
      <div className="detalle-modal-bg">
        <div className="detalle-modal-content">
          <h3>Detalle del pedido #{detallePedido.resumen.id_pedido}</h3>
          <p><b>Total:</b> ${detallePedido.resumen.total_pedido}</p>
          <ul>
            {detallePedido.data.map((prod: any) => (
              <li key={prod.id_producto}>
                {prod.nombre_prod} x{prod.cantidad} - ${prod.precio_unitario}
              </li>
            ))}
          </ul>
          <button
            className="detalle-cerrar-btn"
            onClick={() => setDetallePedido(null)}
          >
            Cerrar
          </button>
        </div>
      </div>
    )}
  </div>
);

};

export default MisPedidos;