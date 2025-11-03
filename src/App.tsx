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
import Registro from './pages/Registro/Registro';
import MisPedidos from './pages/MisPedidos/MisPedidos';
import UsuariosAdmin from './pages/Admin/Usuarios/UsuariosAdmin';
import AgregarUsuarioAdmin from './pages/Admin/Usuarios/AgregarUsuarioAdmin';
import EditarUsuarioAdmin from './pages/Admin/Usuarios/EditarUsuarioAdmin';
import CategoriasAdmin from './pages/Admin/Categorias/CategoriasAdmin';
import ProductosAdmin from './pages/Admin/Productos/ProductosAdmin';
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
            <Route path="/registro" element={<Registro />} />
            <Route path="/mis-pedidos" element={<MisPedidos />} />
            <Route path="/admin/usuarios" element={<UsuariosAdmin />} />
            <Route path="/admin/usuarios/agregar" element={<AgregarUsuarioAdmin />} />
            <Route path="/admin/usuarios/editar/:id" element={<EditarUsuarioAdmin />} />
            <Route path="/admin/categorias" element={<CategoriasAdmin />} />
            <Route path="/admin/productos" element={<ProductosAdmin />} />s
          </Routes>
        </CarritoProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
