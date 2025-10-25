import React, { useState } from 'react';
import TipoProductoDropdown from '../TipoProductoDropdown/TipoProductoDropdown';
import './Header.css';

interface HeaderProps {
  onTipoProductoSelect?: (tipoId: number | null) => void;
  onNavigate?: (page: string) => void;
}
/* onTipoProductoSelect: función opcional que se llama cuando se selecciona un tipo de producto.
  onNavigate: función opcional que se llama para navegar a diferentes páginas (home, cart, login).
  ? Indica que estas propiedades son opcionales
*/

const Header: React.FC<HeaderProps> = ({ onTipoProductoSelect, onNavigate }) => {
  const [cartCount] = useState(0);
  /* crea un componente Header que recibe las propiedades onTipoProductoSelect y onNavigate
  se crea una variable cartCount que representa la cantidad de productos en el carrito */
  const handleTipoSelect = (tipoId: number | null) => {
    if (onTipoProductoSelect) {
      onTipoProductoSelect(tipoId);
    }
    /*Cuando alguien selecciona un tipo de producto, esta función avisa 
    al componente padre (la página que usa Header).*/ 
  };

  const handleNavigation = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };
  /*Cuando alguien hace clic en Login o Carrito, esta función avisa 
  al componente padre para cambiar de página.*/ 

  return (
    <header className="header">
      <div className="header-row">
        <div className="header-logo">
          <img src="/logo.png" alt="Logo" className="logo-img" />
          <h1 onClick={() => handleNavigation('home')}>Digital Store</h1>
        </div>
        <div className="header-right">
          <button 
            className="header-btn cart-btn"
            onClick={() => handleNavigation('cart')}
          >
            🛒 Carrito ({cartCount})
          </button>
          <button 
            className="header-btn login-btn"
            onClick={() => handleNavigation('login')}
          >
            👤 Mi cuenta
          </button>
        </div>
      </div>
      <div className="header-categories">
        <TipoProductoDropdown onTipoSelect={handleTipoSelect} />
      </div>
    </header>
  );
};

export default Header;