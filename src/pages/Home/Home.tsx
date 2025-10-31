import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroCarousel from '../../components/HeroCarousel/HeroCarousel';
import ProductCard from '../../components/ProductCard/ProductCard';
import type { Producto } from '../../types';
import api from '../../services/api';
import './Home.css';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const url = '/producto/random?cantidad=3';
      const response = await api.get(url);
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (id: number) => {
    alert(`Producto ${id} agregado al carrito`);
  };

  return (
    <div className="home">
      <main className="main-content">
        <section className="hero">
          <HeroCarousel />
        </section>
        <section className="products-section">
          <h2>Productos destacados</h2>
          {loading ? (
            <div className="loading">Cargando productos...</div>
          ) : (
            <div className="products-list">
              {products.map((product) => (
                <ProductCard
                  key={product.idproducto ?? 0}
                  id={product.idproducto ?? 0}
                  nombre={product.nombre_prod ?? ''}
                  precio={product.precio ?? 0}
                  imagen={
                    product.imagen
                      ? `http://localhost:4000/${product.imagen.replace(/^\/+/, '')}`
                      : '/placeholder.jpg'
                  }
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </section>
        {/* Botón para ver todos los productos */}
        <div style={{ textAlign: 'center', margin: '2rem 0' }}>
          <button
            className="ver-todos-btn"
            onClick={() => navigate('/productos/todos')}
          >
            Ver todos los productos
          </button>
        </div>
      </main>
    </div>
  );
};

export default Home;