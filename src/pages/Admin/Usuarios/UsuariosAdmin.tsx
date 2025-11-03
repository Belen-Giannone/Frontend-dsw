import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import type { Usuario } from '../../../types';
import { useToast } from '../../../context/ToastContext';
import './UsuariosAdmin.css';

const UsuariosAdmin: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Traer usuarios
  useEffect(() => {
    const fetchUsuarios = async () => {
      setLoading(true);
      try {
        const res = await api.get('/usuario');
        setUsuarios(res.data.data || []);
        setError(null);
      } catch (err: any) {
        setError('Error al cargar usuarios');
      } finally {
        setLoading(false);
      }
    };
    fetchUsuarios();
  }, []);

  // Filtrado por búsqueda
  const usuariosFiltrados = usuarios.filter(u =>
    u.user_usuario.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.email_usuario.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.nombre_usuario.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.apellido_usuario.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Funcionalidad para editar/borrar
 const handleEditar = (usuario: Usuario) => {
  navigate(`/admin/usuarios/editar/${usuario.id_usuario}`);
};

  const handleBorrar = async (usuario: Usuario) => {
    if (!window.confirm(`¿Seguro que deseas borrar a ${usuario.user_usuario}?`)) return;
    try {
      await api.delete(`/usuario/${usuario.id_usuario}`);
      setUsuarios(usuarios.filter(u => u.id_usuario !== usuario.id_usuario));
      showToast('Usuario eliminado correctamente', 'success'); // Notificación de éxito
    } catch (err: any) {
      showToast(err.response?.data?.message || 'No se pudo borrar el usuario', 'error'); // Notificación de error
    }
  };

  return (
    <div className="usuarios-admin-container">
      <h1>Listado de Usuarios</h1>
      <div className="usuarios-admin-bar">
        <input
          type="text"
          placeholder="Busqueda"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
        <button className="agregar-btn" onClick={() => navigate('/admin/usuarios/agregar')}>
          Agregar Usuario
          </button>
      </div>
      {error && <div className="error">{error}</div>}
      <table className="usuarios-admin-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre de Usuario</th>
            <th>Tipo de Usuario</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Dirección</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={9}>Cargando...</td></tr>
          ) : usuariosFiltrados.length === 0 ? (
            <tr><td colSpan={9}>No hay usuarios</td></tr>
          ) : (
            usuariosFiltrados.map(usuario => (
              <tr key={usuario.id_usuario}>
                <td>{usuario.id_usuario}</td>
                <td>{usuario.user_usuario}</td>
                <td>{usuario.tipo_usuario === 1 ? 'Administrador' : 'Cliente'}</td>
                <td>{usuario.email_usuario}</td>
                <td>{usuario.tel_usuario}</td>
                <td>{usuario.nombre_usuario}</td>
                <td>{usuario.apellido_usuario}</td>
                <td>{usuario.direccion_usuario}</td>
                <td>
                  <button className="editar-btn" onClick={() => handleEditar(usuario)}>Editar</button>
                  <button className="borrar-btn" onClick={() => handleBorrar(usuario)}>Borrar</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsuariosAdmin;