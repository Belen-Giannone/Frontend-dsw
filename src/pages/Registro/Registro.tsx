// src/pages/Registro/Registro.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import './Registro.css';

const Registro: React.FC = () => {
  const [form, setForm] = useState({
    user_usuario: '',
    contraseña: '',
    email_usuario: '',
    tel_usuario: '',
    direccion_usuario: '',
    nombre_usuario: '',
    apellido_usuario: ''
  });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
          // Convertir tel_usuario a número antes de enviar
    const dataToSend = {
      ...form,
      tel_usuario: Number(form.tel_usuario)
    };
      await api.post('/usuario/add', dataToSend);
      showToast('¡Registro exitoso! Ahora puedes iniciar sesión.', 'success');
      navigate('/login');
    } catch (error: any) {
      showToast('Error al registrar usuario', 'error');
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="login-page">
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Registrarse</h2>
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
      <label>Email</label>
      <input name="email_usuario" type="email" value={form.email_usuario} onChange={handleChange} required />
      <label>Telefono</label>
      <input name="tel_usuario" value={form.tel_usuario} onChange={handleChange} required />
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
      <label>Dirección</label>
      <input name="direccion_usuario" value={form.direccion_usuario} onChange={handleChange} required />
      <button type="submit" disabled={loading}>
        {loading ? 'Registrando...' : 'Registrarse'}
      </button>
    </form>
  </div>
);
};

export default Registro;