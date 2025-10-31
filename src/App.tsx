import './App.css';
import Home from './pages/Home/Home';
import ProductosPorTipo from './pages/ProductosPorTipo/ProductosPorTipo'; 
import Header from './components/Header/Header';
import ProductosTodos from './pages/ProductosTodos/ProductosTodos';
import DetalleProducto from './pages/DetalleProducto/DetalleProducto';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  // Puedes dejar la función vacía si no la usas globalmente
  const handleTipoProductoSelect = () => {};
  const handleNavigation = () => {};

  return (
    <BrowserRouter>
      <Header 
        onTipoProductoSelect={handleTipoProductoSelect}
        onNavigate={handleNavigation}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos/:tipoId" element={<ProductosPorTipo />} />
        <Route path="/productos/todos" element={<ProductosTodos />} />
        <Route path="/producto/:id" element={<DetalleProducto />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
