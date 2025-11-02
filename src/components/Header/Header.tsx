import React, { useState, useRef, useEffect } from 'react';
import TipoProductoDropdown from '../TipoProductoDropdown/TipoProductoDropdown';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import { useCarrito } from '../../context/CarritoContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface HeaderProps {
  onTipoProductoSelect?: (tipoId: number | null) => void;
}

const Header: React.FC<HeaderProps> = ({ onTipoProductoSelect }) => {
  const { carrito } = useCarrito();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const cartCount = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleTipoSelect = (tipoId: number | null) => {
    if (onTipoProductoSelect) {
      onTipoProductoSelect(tipoId);
    }
  };

    const handleLogout = () => {
    logout();
    setOpen(false);
    showToast('Sesión cerrada correctamente', 'info');
    navigate('/');
  };

    // Cierra el menú al hacer click fuera
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <header className="header">
      <div className="header-row">
        <div className="header-logo">
          <img src="/logo.png" alt="Logo" className="logo-img" />
          <h1 onClick={() => navigate('/')}>Digital Store</h1>
        </div>
        <div className="header-right">
          <button 
            className="header-btn cart-btn"
            onClick={() => navigate('/carrito')}
          >
            🛒 Carrito ({cartCount})
          </button>
          {user ? (
            <div className="user-menu-container" ref={userMenuRef}>
              <button
                className="header-btn user-btn"
                onClick={() => setOpen((v) => !v)}
              >
                {user.user_usuario} ▼
              </button>
              {open && (
                <div className="user-dropdown">
                  <div><b>Usuario:</b> {user.user_usuario}</div>
                  <div><b>Email:</b> {user.email_usuario}</div>
                  <div><b>Teléfono:</b> {user.tel_usuario}</div>
                  <div><b>Dirección:</b> {user.direccion_usuario}</div>
                  <div><b>Nombre:</b> {user.nombre_usuario} {user.apellido_usuario}</div>
                  <button className="mis-pedidos-btn"
                  onClick={() => { setOpen(false); 
                    navigate('/mis-pedidos');
                  }}
                    >
                      Mis pedidos
                      </button>
                  <button className="logout-btn" onClick={handleLogout}>
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              className="header-btn login-btn"
              onClick={() => navigate('/login')}
            >
              👤 Mi cuenta
            </button>
            )}
        </div>
      </div>
      <div className="header-categories">
        <TipoProductoDropdown onTipoSelect={handleTipoSelect} />
      </div>
    </header>
  );
};

export default Header;