import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import type { Usuario } from '../../../types';
import { useToast } from '../../../context/ToastContext';
import './AgregarUsuarioAdmin.css'; // Reutiliza el mismo estilo

type UsuarioForm = Omit<Usuario, 'id_usuario' | 'tel_usuario'> & { tel_usuario: string };

const EditarUsuarioAdmin: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // tel_usuario como string en el form
  const [form, setForm] = useState<UsuarioForm>({
    user_usuario: '',
    contraseña: '',
    email_usuario: '',
    tel_usuario: '', // string para el input
    direccion_usuario: '',
    nombre_usuario: '',
    apellido_usuario: '',
    tipo_usuario: 2,
  });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Traer datos del usuario
useEffect(() => {
  const fetchUsuario = async () => {
    try {
      const usuario = (await api.get(`/usuario/${id}`)).data.data;
      setForm({
        user_usuario: usuario.user_usuario,
        contraseña: '',
        email_usuario: usuario.email_usuario,
        tel_usuario: usuario.tel_usuario ? String(usuario.tel_usuario) : '',
        direccion_usuario: usuario.direccion_usuario,
        nombre_usuario: usuario.nombre_usuario,
        apellido_usuario: usuario.apellido_usuario,
        tipo_usuario: usuario.tipo_usuario,
      });
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Error al cargar usuario', 'error');
      navigate('/admin/usuarios');
    }
  };
  fetchUsuario();
}, [id, navigate, showToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(f => ({
      ...f,
      [name]:
        name === 'tel_usuario'
          ? value.replace(/\D/g, '') // Solo números
          : name === 'tipo_usuario'
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/usuario/${id}`, {
        ...form,
        tel_usuario: Number(form.tel_usuario), // convertir a number antes de enviar
      });
      showToast('Usuario actualizado correctamente', 'success');
      navigate('/admin/usuarios');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Error al actualizar usuario', 'error');
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="agregar-usuario-admin-container">
    <form className="agregar-usuario-form" onSubmit={handleSubmit}>
      <h1>Editar Usuario</h1>
      <div className="input-row">
        <div>
          <label>Nombre de usuario</label>
          <input
            name="user_usuario"
            value={form.user_usuario}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Contraseña</label>
          <input
            name="contraseña"
            type="password"
            value={form.contraseña}
            onChange={handleChange}
            placeholder="Dejar vacío para no cambiar"
          />
        </div>
      </div>
      <div>
        <label>Tipo de Usuario</label>
        <select
          name="tipo_usuario"
          value={form.tipo_usuario}
          onChange={handleChange}
        >
          <option value={1}>Administrador</option>
          <option value={2}>Cliente</option>
        </select>
      </div>
      <div>
        <label>Email</label>
        <input
          name="email_usuario"
          type="email"
          value={form.email_usuario}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Teléfono</label>
        <input
          name="tel_usuario"
          type="text"
          value={form.tel_usuario || ''}
          onChange={handleChange}
          required
        />
      </div>
      <div className="input-row">
        <div>
          <label>Nombre</label>
          <input
            name="nombre_usuario"
            value={form.nombre_usuario}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Apellido</label>
          <input
            name="apellido_usuario"
            value={form.apellido_usuario}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div>
        <label>Dirección</label>
        <input
          name="direccion_usuario"
          value={form.direccion_usuario}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Actualizando...' : 'Actualizar'}
      </button>
    </form>
  </div>
);
};
export default EditarUsuarioAdmin;