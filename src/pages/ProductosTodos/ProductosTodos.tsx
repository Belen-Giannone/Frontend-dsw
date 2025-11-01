import React, { useEffect, useState } from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import './ProductosTodos.css';
import type { Producto } from '../../types';
import api from '../../services/api';

const ProductosTodos: React.FC = () => {
  const [products, setProducts] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      const response = await api.get('/producto');
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="productos-todos">
      <div className="products-list-container">
        <h2>Todos los productos</h2>
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
                stock={product.cant_stock ?? 0} // <-- Agrega este prop
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductosTodos;