import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import './PedidosAdmin.css';

interface Pedido {
  id_pedido: number;
  fecha_pedido: string;
  total: number;
  email_cliente: string;
  productos: string;
  estado_pago: string;
  estado_pedido: string;
}

const PedidosAdmin: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [busquedaFecha, setBusquedaFecha] = useState('');
  const [busquedaEmail, setBusquedaEmail] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    setLoading(true);
    try {
      const res = await api.get('/pedido');
      setPedidos(res.data.data || []);
    } catch {
      showToast('Error al cargar pedidos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = async () => {
    setLoading(true);
    try {
      let res;
      if (busquedaFecha) {
        res = await api.get(`/pedido/buscar-fecha?fecha=${encodeURIComponent(busquedaFecha)}`);
      } else if (busquedaEmail) {
        res = await api.get(`/pedido/buscar-email?email=${encodeURIComponent(busquedaEmail)}`);
      } else {
        res = await api.get('/pedido');
      }
      setPedidos(res.data.data || []);
    } catch {
      showToast('Error en la búsqueda', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEntregar = async (id: number) => {
    try {
      await api.put(`/pedido/${id}/entregar`);
      showToast('Pedido marcado como entregado', 'success');
      fetchPedidos();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'No se pudo actualizar el estado', 'error');
    }
  };

  const handleEliminar = async (id: number) => {
    if (!window.confirm('¿Seguro que deseas eliminar este pedido?')) return;
    try {
      await api.delete(`/pedido/${id}`);
      showToast('Pedido eliminado', 'success');
      fetchPedidos();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'No se pudo eliminar el pedido', 'error');
    }
  };

return (
  <div className="pedidos-admin-container">
    <h1>Listado de Pedidos</h1>
    <div className="pedidos-admin-bar">
      <input
        type="text"
        placeholder="Búsqueda por Fecha"
        value={busquedaFecha}
        onChange={e => setBusquedaFecha(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleBuscar()}
      />
      <input
        type="text"
        placeholder="Búsqueda por Email"
        value={busquedaEmail}
        onChange={e => setBusquedaEmail(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleBuscar()}
      />
      <button onClick={handleBuscar}>Buscar</button>
      <button onClick={() => { setBusquedaFecha(''); setBusquedaEmail(''); fetchPedidos(); }}>Limpiar</button>
    </div>
    <table className="pedidos-admin-table">
      <thead>
        <tr>
          <th>Id Pedido</th>
          <th>Fecha Pedido</th>
          <th>Total</th>
          <th>Email Cliente</th>
          <th>Productos</th>
          <th>Estado Pedido</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr><td colSpan={7}>Cargando...</td></tr>
        ) : pedidos.length === 0 ? (
          <tr><td colSpan={7}>No hay pedidos</td></tr>
        ) : (
          pedidos.map((pedido: any) => (
            <tr key={pedido.id_pedido}>
              <td>{pedido.id_pedido}</td>
              <td>{pedido.fecha_pedido ? pedido.fecha_pedido.split('T')[0] : ''}</td>
              <td>{pedido.total_pedido}</td>
              <td>{pedido.email_usuario}</td>
              <td>
                {Array.isArray(pedido.productos) && pedido.productos.length > 0 ? (
                  <ul className="productos-lista">
                    {pedido.productos.map((prod: any, idx: number) => (
                      <li key={idx}>{prod.nombre} ({prod.cantidad})</li>
                    ))}
                  </ul>
                ) : ''}
              </td>
              <td>
                {pedido.estado_pedido === 'entregado' || pedido.estado_pedido === 'Entregado' ? (
                  <span className="estado-entregado">Entregado</span>
                ) : (
                  <span className="estado-proceso">En proceso</span>
                )}
              </td>
              <td>
                {pedido.estado_pedido !== 'entregado' && pedido.estado_pedido !== 'Entregado' && (
                  <button className="entregar-btn" onClick={() => handleEntregar(pedido.id_pedido)}>
                    Marcar Entregado
                  </button>
                )}
                <button className="borrar-btn" onClick={() => handleEliminar(pedido.id_pedido)}>
                  Borrar
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);
};

export default PedidosAdmin;