import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo">
          <h1>MiTienda</h1>
        </div>
        
        {/* Barra de búsqueda */}
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Buscar productos..."
            className="search-input"
          />
          <button className="search-button">🔍</button>
        </div>
        
        {/* Iconos de la derecha */}
        <div className="header-actions">
          <button className="action-button">👤 Login</button>
          <button className="action-button">🛒 Carrito (0)</button>
        </div>
      </div>
    </header>
  )
}

export default Header