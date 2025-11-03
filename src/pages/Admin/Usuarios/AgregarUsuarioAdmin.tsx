import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import type { Usuario } from '../../../types';
import './AgregarUsuarioAdmin.css';
import React, { useState } from 'react';

const initialForm: Omit<Usuario, 'id_usuario'> = {
  user_usuario: '',
  contraseña: '',
  email_usuario: '',
  tel_usuario: 0,
  direccion_usuario: '',
  nombre_usuario: '',
  apellido_usuario: '',
  tipo_usuario: 2, // Por defecto Cliente
};

const AgregarUsuarioAdmin: React.FC = () => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target; // <-- AGREGA ESTA LÍNEA
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
    await api.post('/usuario/add', {
      ...form,
      tel_usuario: Number(form.tel_usuario), // <-- convierte a número aquí
    });
    showToast('Usuario agregado correctamente', 'success');
    setForm(initialForm);
  } catch (err: any) {
    showToast(err.response?.data?.message || 'Error al agregar usuario', 'error');
  } finally {
    setLoading(false);
  }
};

return (
  <div className="agregar-usuario-admin-container">
    <form className="agregar-usuario-form" onSubmit={handleSubmit}>
      <h1>Agregar Usuario</h1>
      <div className="input-row">
        <div>
          <label>Nombre de usuario</label>
          <input name="user_usuario" value={form.user_usuario} onChange={handleChange} required />
        </div>
        <div>
          <label>Contraseña</label>
          <input name="contraseña" type="password" value={form.contraseña} onChange={handleChange} required />
        </div>
      </div>
      <div>
        <label>Tipo de Usuario</label>
        <select name="tipo_usuario" value={form.tipo_usuario} onChange={handleChange}>
          <option value={1}>Administrador</option>
          <option value={2}>Cliente</option>
        </select>
      </div>
      <div>
        <label>Email</label>
        <input name="email_usuario" type="email" value={form.email_usuario} onChange={handleChange} required />
      </div>
      <div>
        <label>Teléfono</label>
        <input name="tel_usuario" type="text" value={form.tel_usuario || ''} onChange={handleChange} required />
      </div>
      <div className="input-row">
        <div>
          <label>Nombre</label>
          <input name="nombre_usuario" value={form.nombre_usuario} onChange={handleChange} required />
        </div>
        <div>
          <label>Apellido</label>
          <input name="apellido_usuario" value={form.apellido_usuario} onChange={handleChange} required />
        </div>
      </div>
      <div>
        <label>Dirección</label>
        <input name="direccion_usuario" value={form.direccion_usuario} onChange={handleChange} required />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Agregando...' : 'Agregar'}
      </button>
    </form>
  </div>
);
};
export default AgregarUsuarioAdmin;