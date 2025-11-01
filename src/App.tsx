import './App.css';
import Home from './pages/Home/Home';
import ProductosPorTipo from './pages/ProductosPorTipo/ProductosPorTipo'; 
import Header from './components/Header/Header';
import ProductosTodos from './pages/ProductosTodos/ProductosTodos';
import DetalleProducto from './pages/DetalleProducto/DetalleProducto';
import { CarritoProvider } from './context/CarritoContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import Carrito from './pages/Carrito/Carrito';
import Login from './pages/Login/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  const handleTipoProductoSelect = () => {};

  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
        <CarritoProvider>
          <Header 
            onTipoProductoSelect={handleTipoProductoSelect}
          />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productos/:tipoId" element={<ProductosPorTipo />} />
            <Route path="/productos/todos" element={<ProductosTodos />} />
            <Route path="/producto/:id" element={<DetalleProducto />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </CarritoProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
