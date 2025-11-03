import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import './CategoriasAdmin.css';

interface TipoProducto {
  id_tipo: number;
  nombre_tipo: string;
}

const CategoriasAdmin: React.FC = () => {
  const [categorias, setCategorias] = useState<TipoProducto[]>([]);
  const [nombre, setNombre] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  // Traer categorías
  useEffect(() => {
    fetchCategorias();
  }, []);

const fetchCategorias = async () => {
  setLoading(true);
  try {
    const res = await api.get('/tipoproducto');
    const categorias = (res.data.data || []).map((cat: any) => ({
      id_tipo: cat.idtipo_producto,
      nombre_tipo: cat.nombre_tipo,
      desc_tipo: cat.desc_tipo,
    }));
    setCategorias(categorias);
  } catch {
    showToast('Error al cargar categorías', 'error');
  } finally {
    setLoading(false);
  }
};

  // Agregar o editar categoría
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return showToast('El nombre es requerido', 'error');
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/tipoproducto/${editId}`, { nombre_tipo: nombre });
        showToast('Categoría actualizada', 'success');
      } else {
        await api.post('/tipoproducto', { nombre_tipo: nombre });
        showToast('Categoría agregada', 'success');
      }
      setNombre('');
      setEditId(null);
      fetchCategorias();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Error al guardar', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Editar
  const handleEditar = (cat: TipoProducto) => {
    setNombre(cat.nombre_tipo);
    setEditId(cat.id_tipo);
  };

  // Borrar
  const handleBorrar = async (cat: TipoProducto) => {
    if (!window.confirm(`¿Seguro que deseas borrar la categoría "${cat.nombre_tipo}"?`)) return;
    setLoading(true);
    try {
      await api.delete(`/tipoproducto/${cat.id_tipo}`);
      showToast('Categoría eliminada', 'success');
      fetchCategorias();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'No se pudo borrar la categoría', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="categorias-admin-container">
      <h1>Categorías</h1>
      <form className="categorias-admin-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre de categoría"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {editId ? 'Actualizar' : 'Agregar'}
        </button>
        {editId && (
          <button type="button" className="cancelar-btn" onClick={() => { setEditId(null); setNombre(''); }}>
            Cancelar
          </button>
        )}
      </form>
      <table className="categorias-admin-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={3}>Cargando...</td></tr>
          ) : categorias.length === 0 ? (
            <tr><td colSpan={3}>No hay categorías</td></tr>
          ) : (
            categorias.map(cat => (
            <tr key={cat.id_tipo}>
                <td>{cat.id_tipo}</td>
                <td>{cat.nombre_tipo}</td>
                <td>
                  <button className="editar-btn" onClick={() => handleEditar(cat)}>Editar</button>
                  <button className="borrar-btn" onClick={() => handleBorrar(cat)}>Borrar</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoriasAdmin;