import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import './Login.css';

const Login: React.FC = () => {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { usuario, contrasena });
      login(res.data.token, res.data.usuario);
      showToast('¡Bienvenido!', 'success');
      navigate('/');
    } catch (error: any) {
      showToast('Credenciales incorrectas', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Ingreso</h2>
        <label>Nombre de usuario</label>
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={usuario}
          onChange={e => setUsuario(e.target.value)}
          required
        />
        <label>Contraseña</label>
        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={e => setContrasena(e.target.value)}
          required
        />
        <div style={{ margin: '1rem 0' }}>
          ¿No tienes cuenta?{' '}
          <span
            style={{ color: '#3498db', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => navigate('/registro')}
          >
            Registrate
          </span>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
};

export default Login;