import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

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
    <div style={{ maxWidth: 600, margin: '2rem auto', background: '#181818', color: '#fff', borderRadius: 10, padding: '2rem' }}>
      <h2>Mis pedidos</h2>
      {pedidos.length === 0 ? (
        <p>No tienes pedidos realizados.</p>
      ) : (
        pedidos.map((pedido) => (
          <div key={pedido.id_pedido} style={{ borderBottom: '1px solid #333', marginBottom: 16, paddingBottom: 12 }}>
            <b>Pedido #{pedido.id_pedido}</b> - {new Date(pedido.fecha_pedido).toLocaleString()}<br />
            Estado: {pedido.estado_pedido} <br />
            Total: ${pedido.total_pedido}
            <button
              style={{ marginLeft: 12, background: '#3498db', color: '#fff', border: 'none', borderRadius: 6, padding: '0.3rem 1rem', cursor: 'pointer' }}
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
  <div style={{
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
  }}>
    <div style={{
      background: '#181818', color: '#fff', borderRadius: 12, padding: '2rem', minWidth: 320, maxWidth: 500
    }}>
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
        style={{ marginTop: 16, background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 6, padding: '0.5rem 1.5rem', cursor: 'pointer' }}
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