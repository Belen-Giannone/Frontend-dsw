import React from 'react';
import TipoProductoDropdown from '../TipoProductoDropdown/TipoProductoDropdown';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import { useCarrito } from '../../context/CarritoContext';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onTipoProductoSelect?: (tipoId: number | null) => void;
}
/* onTipoProductoSelect: función opcional que se llama cuando se selecciona un tipo de producto.
  onNavigate: función opcional que se llama para navegar a diferentes páginas (home, cart, login).
  ? Indica que estas propiedades son opcionales
*/

const Header: React.FC<HeaderProps> = ({ onTipoProductoSelect }) => {
  const { carrito } = useCarrito();
   const { user, logout } = useAuth();
  // Suma la cantidad total de productos en el carrito
  const cartCount = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  const navigate = useNavigate();

  const handleTipoSelect = (tipoId: number | null) => {
    if (onTipoProductoSelect) {
      onTipoProductoSelect(tipoId);
    }
    /*Cuando alguien selecciona un tipo de producto, esta función avisa 
    al componente padre (la página que usa Header).*/ 
  };

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
            <>
              <span style={{ marginRight: '1rem' }}>
                {user.nombre} ({user.rol})
              </span>
              <button 
                className="header-btn login-btn"
                onClick={logout}
              >
                Cerrar sesión
              </button>
            </>
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