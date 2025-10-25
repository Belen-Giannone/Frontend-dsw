import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import HeroCarousel from '../../components/HeroCarousel/HeroCarousel';
import type { Producto } from '../../types';
import api from '../../services/api';
import './Home.css';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  /*products lista de productos a mostrar
  setProducts función para actualizar esta lista
  loading si está cargando los productos o no*/ 

  useEffect(() => {
    fetchProducts();
  }, []);
  /*cuando la página se carga por primera vez, llama a fetchProducts() para traer los productos del backend*/ 

const fetchProducts = async (tipoId?: number | null) => {
  try {
    let url = '/producto';
    if (tipoId) {
      url = `/producto/tipo/${tipoId}`;
    }
    const response = await api.get(url);

    // Acceder al array real de productos
    setProducts(response.data.data || []);
  } catch (error) {
    console.error('Error al cargar productos:', error);
    setProducts([]); // Para evitar errores si falla la petición
  } finally {
    setLoading(false);
  }
};
  /*Función para traer productos*/ 

  const handleTipoProductoSelect = (tipoId: number | null) => {
    setLoading(true);
    fetchProducts(tipoId);
  };
  /*Esta función se llama cuando se selecciona un tipo de producto
  se ejecuta cuando eliges un tipo en el menú del Header
  llama a fetchProducts con el tipo seleccionado para filtrar los productos*/

  const handleNavigation = (page: string) => {
    console.log(`Navegando a: ${page}`);
    // Aquí después agregarás la lógica de navegación
  };

  return (
    <div className="home">
      <Header 
        onTipoProductoSelect={handleTipoProductoSelect}
        onNavigate={handleNavigation}
      />
      
      <main className="main-content">
        <section className="hero">
          <HeroCarousel />
        </section>
        
        <section className="products-section">
          <h2>Productos</h2>
          {loading ? (
            <div className="loading">Cargando productos...</div>
          ) : (
            <div className="products-list">
              <p>Se encontraron {products.length} productos</p>
              {products.map((product) => (
                <div key={product.idproducto} className="product-item">
                  <h3>{product.nombre_prod}</h3>
                  <p>Precio: ${product.precio}</p>
                  {product.desc_prod && <p>{product.desc_prod}</p>}
                  <p>Stock: {product.cant_stock || 0}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Home;