import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import './ProductosAdmin.css';

interface ProductoForm {
  nombre_producto: string;
  descripcion_producto: string;
  precio_producto: string;
  stock_producto: string;
  imagen_producto: string;
  activo: boolean;
}

const EditarProductoAdmin: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<ProductoForm>({
    nombre_producto: '',
    descripcion_producto: '',
    precio_producto: '',
    stock_producto: '',
    imagen_producto: '',
    activo: true,
  });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const res = await api.get(`/producto/${id}`);
        const prod = res.data.data;
        setForm({
          nombre_producto: prod.nombre_prod ?? '',
          descripcion_producto: prod.desc_prod ?? '',
          precio_producto: prod.precio ? String(prod.precio) : '',
          stock_producto: prod.cant_stock ? String(prod.cant_stock) : '',
          imagen_producto: prod.imagen ?? '',
          activo: prod.activo ?? true,
        });
      } catch (err: any) {
        showToast(err.response?.data?.message || 'Error al cargar producto', 'error');
        navigate('/admin/productos');
      }
    };
    fetchProducto();
  }, [id, navigate, showToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm(f => ({
        ...f,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setForm(f => ({
        ...f,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/producto/${id}`, {
        nombre_prod: form.nombre_producto,
        desc_prod: form.descripcion_producto,
        precio: Number(form.precio_producto),
        cant_stock: Number(form.stock_producto),
        imagen: form.imagen_producto,
        activo: form.activo,
      });
      showToast('Producto actualizado correctamente', 'success');
      navigate('/admin/productos');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Error al actualizar producto', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="productos-admin-container">
      <form className="productos-admin-form" onSubmit={handleSubmit}>
        <h1>Editar Producto</h1>
        <div className="form-row">
          <label>Nombre</label>
          <input
            name="nombre_producto"
            value={form.nombre_producto}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-row">
          <label>Descripción</label>
          <textarea
            name="descripcion_producto"
            value={form.descripcion_producto}
            onChange={handleChange}
            required
            rows={3}
          />
        </div>
        <div className="form-row">
          <label>Precio</label>
          <input
            name="precio_producto"
            type="number"
            min="0"
            step="0.01"
            value={form.precio_producto}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-row">
          <label>Stock</label>
          <input
            name="stock_producto"
            type="number"
            min="0"
            value={form.stock_producto}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-row">
          <label>Imagen (URL)</label>
          <input
            name="imagen_producto"
            value={form.imagen_producto}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label>
            <input
              type="checkbox"
              name="activo"
              checked={form.activo}
              onChange={handleChange}
            />
            Activo
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Actualizando...' : 'Actualizar'}
        </button>
      </form>
    </div>
  );
};

export default EditarProductoAdmin;