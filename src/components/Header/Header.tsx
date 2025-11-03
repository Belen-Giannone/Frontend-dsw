import React, { useState, useRef, useEffect } from 'react';
import { ROLES } from '../../constants/roles';
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
  const [openAdmin, setOpenAdmin] = useState(false);
  const adminMenuRef = useRef<HTMLDivElement>(null);

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

   // Cierra el menú admin al hacer click fuera
    useEffect(() => {
    if (!openAdmin) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target as Node)) {
        setOpenAdmin(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openAdmin]);

return (
  <header className="header">
    <div className="header-row">
      <div className="header-logo">
        <button
          className="logo-btn"
          onClick={() => navigate('/')}
          tabIndex={0}
          aria-label="Ir a la página principal"
          type="button"
        >
          <img src="/logo.png" alt="Logo" className="logo-img" />
          <span className="logo-title">Digital Store</span>
        </button>
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
                  onClick={() => { setOpen(false); navigate('/mis-pedidos'); }}
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
    <div className="header-categories-row">
        <TipoProductoDropdown onTipoSelect={handleTipoSelect} />
        {user?.tipo_usuario === ROLES.ADMIN && (
          <div
            className="dropdown-container"
            ref={adminMenuRef}
            style={{ marginLeft: 0 }}
          >
            <button
              className="dropdown-btn"
              onClick={() => setOpenAdmin((v) => !v)}
            >
              Administración ▼
            </button>
            <div
              className={`dropdown-menu${openAdmin ? ' open' : ''}`}
              style={{ pointerEvents: openAdmin ? 'auto' : 'none' }}
            >
              {openAdmin && (
                <div>
                  <div
                    className="dropdown-item"
                    onClick={() => { navigate('/admin/categorias'); setOpenAdmin(false); }}
                  >
                    Categorías
                    </div>
                  <div
                    className="dropdown-item"
                    onClick={() => { navigate('/admin/productos'); setOpenAdmin(false); }}
                  >
                    Productos
                  </div>
                  <div
                    className="dropdown-item"
                    onClick={() => { navigate('/admin/usuarios'); setOpenAdmin(false); }}
                  >
                    Usuarios
                  </div>
                  <div
                    className="dropdown-item"
                    onClick={() => { navigate('/admin/pedidos'); setOpenAdmin(false); }}
                  >
                    Pedidos
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        </div>
    </header>
  );
};

export default Header;