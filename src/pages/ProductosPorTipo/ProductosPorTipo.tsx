import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import api from '../../services/api';

const ProductosPorTipo: React.FC = () => {
  const { tipoId } = useParams<{ tipoId: string }>();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get(`/producto/tipo/${tipoId}`);
        setProducts(response.data.data || []);
      } catch (error) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [tipoId]);

  return (
    <div className="products-section">
      <h2>Productos</h2>
      {loading ? (
        <div>Cargando productos...</div>
      ) : (
        <div className="products-list">
          {products.map((product: any) => (
            <ProductCard
              key={product.idproducto}
              id={product.idproducto}
              nombre={product.nombre_prod}
              precio={product.precio}
              imagen={
                product.imagen
                  ? `http://localhost:4000/${product.imagen.replace(/^\/+/, '')}`
                  : '/placeholder.jpg'
              }
              onAddToCart={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductosPorTipo;