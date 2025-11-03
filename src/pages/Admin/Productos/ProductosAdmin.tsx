import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import './ProductosAdmin.css';

interface Producto {
  id_producto: number;
  nombre_producto: string;
  descripcion_producto: string;
  precio_producto: number;
  stock_producto: number;
  imagen_producto: string;
  activo: boolean;
}

const ProductosAdmin: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagina, setPagina] = useState(1);
  const pageSize = 10;
  const { showToast } = useToast();
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const res = await api.get('/producto/todos');
      const productos = (res.data.data || []).map((prod: any) => ({
        id_producto: prod.idproducto,
        nombre_producto: prod.nombre_prod,
        descripcion_producto: prod.desc_prod,
        precio_producto: Number(prod.precio),
        stock_producto: prod.cant_stock,
        imagen_producto: prod.imagen,
        activo: prod.activo,
      }));
      setProductos(productos);
      setError(null);
      setPagina(1);
    } catch (err: any) {
      setError('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const handleDesactivar = async (producto: Producto) => {
    if (!window.confirm(`¿Seguro que deseas desactivar "${producto.nombre_producto}"?`)) return;
    try {
      const res = await api.delete(`/producto/${producto.id_producto}`);
      showToast(
        res.data?.message ||
        'Producto desactivado o eliminado correctamente',
        'success'
      );
      fetchProductos();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'No se pudo desactivar/eliminar el producto', 'error');
    }
  };

  const handleReactivar = async (producto: Producto) => {
    try {
      await api.put(`/producto/${producto.id_producto}/reactivar`);
      showToast('Producto reactivado correctamente', 'success');
      fetchProductos();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'No se pudo reactivar el producto', 'error');
    }
  };

  // Filtrado local por nombre (insensible a mayúsculas/minúsculas)
  const productosFiltrados = productos.filter(p =>
    p.nombre_producto.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Paginación sobre los filtrados
  const totalPaginas = Math.ceil(productosFiltrados.length / pageSize);
  const productosPagina = productosFiltrados.slice((pagina - 1) * pageSize, pagina * pageSize);

  const handleLimpiar = () => {
    setBusqueda('');
    setPagina(1);
  };

return (
  <div className="productos-admin-container">
    <h1>Listado de Productos</h1>
    <div className="productos-admin-bar">
      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={busqueda}
        onChange={e => {
          setBusqueda(e.target.value);
          setPagina(1);
        }}
      />
      <button onClick={handleLimpiar} style={{ marginLeft: 8 }}>Limpiar</button>
      <button
        className="agregar-btn"
        style={{ marginLeft: 8 }}
        onClick={() => navigate('/admin/productos/agregar')}
      >
        Agregar producto
      </button>
    </div>
    {error && <div className="error">{error}</div>}
    <table className="productos-admin-table">
      <thead>
        <tr>
          <th>Id</th>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Imagen</th>
          <th>Precio</th>
          <th>Stock</th>
          <th>Estado</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr><td colSpan={8}>Cargando...</td></tr>
        ) : productosPagina.length === 0 ? (
          <tr><td colSpan={8}>No hay productos</td></tr>
        ) : (
          productosPagina.map(producto => (
            <tr key={producto.id_producto}>
              <td>{producto.id_producto}</td>
              <td>{producto.nombre_producto}</td>
              <td>{producto.descripcion_producto}</td>
              <td>
                {producto.imagen_producto
                  ? <span className="url-imagen">{producto.imagen_producto}</span>
                  : <span style={{ color: '#aaa' }}>Sin imagen</span>
                }
              </td>
              <td>
                {typeof producto.precio_producto === 'number'
                  ? `$${producto.precio_producto.toFixed(2)}`
                  : <span style={{ color: '#aaa' }}>Sin precio</span>
                }
              </td>
              <td>{producto.stock_producto}</td>
              <td>
                {producto.activo ? (
                  <span className="estado-activo">Activo</span>
                ) : (
                  <span className="estado-inactivo">Inactivo</span>
                )}
              </td>
              <td>
                <button className="editar-btn" onClick={() => navigate(`/admin/productos/editar/${producto.id_producto}`)}>
                  Editar
                </button>
                {producto.activo ? (
                  <button className="borrar-btn" onClick={() => handleDesactivar(producto)}>Desactivar</button>
                ) : (
                  <button className="reactivar-btn" onClick={() => handleReactivar(producto)}>Reactivar</button>
                )}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
    {/* Paginación */}
    <div className="paginacion">
      <button onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1}>Anterior</button>
      <span>Página {pagina} de {totalPaginas}</span>
      <button onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas}>Siguiente</button>
    </div>
  </div>
);
};

export default ProductosAdmin;