import React, { useEffect, useState } from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import './ProductosTodos.css';
import type { Producto } from '../../types';
import api from '../../services/api';

const ProductosTodos: React.FC = () => {
  const [products, setProducts] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(1);
  const pageSize = 12; // productos por página

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

  // Filtrado local por nombre
  const productosFiltrados = products.filter(p =>
    (p.nombre_prod ?? '').toLowerCase().includes(busqueda.toLowerCase())
  );

  // Paginación sobre los filtrados
  const totalPaginas = Math.ceil(productosFiltrados.length / pageSize);
  const productosPagina = productosFiltrados.slice((pagina - 1) * pageSize, pagina * pageSize);

  const handleLimpiar = () => {
    setBusqueda('');
    setPagina(1);
  };

  return (
    <div className="productos-todos">
      <div className="products-list-container">
        <h2>Todos los productos</h2>
        <div className="productos-todos-bar">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={e => {
              setBusqueda(e.target.value);
              setPagina(1);
            }}
          />
          <button onClick={handleLimpiar}>Limpiar</button>
        </div>
        {loading ? (
          <div className="loading">Cargando productos...</div>
        ) : (
          <>
            <div className="products-list">
              {productosPagina.map((product) => (
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
                  stock={product.cant_stock ?? 0}
                />
              ))}
            </div>
            {/* Paginación */}
            <div className="paginacion">
              <button onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1}>Anterior</button>
              <span>Página {pagina} de {totalPaginas}</span>
              <button onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas}>Siguiente</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductosTodos;