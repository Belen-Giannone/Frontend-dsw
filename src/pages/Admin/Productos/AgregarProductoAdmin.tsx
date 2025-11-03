import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  id_tipoprod: string;
}

interface TipoProducto {
  idtipo_producto: number;
  nombre_tipo: string;
}

const AgregarProductoAdmin: React.FC = () => {
  const [form, setForm] = useState<ProductoForm>({
    nombre_producto: '',
    descripcion_producto: '',
    precio_producto: '',
    stock_producto: '',
    imagen_producto: '',
    activo: true,
    id_tipoprod: '',
  });
  const [tipos, setTipos] = useState<TipoProducto[]>([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const res = await api.get('/tipoproducto');
        setTipos(res.data.data || []);
      } catch {
        showToast('Error al cargar tipos de productos', 'error');
      }
    };
    fetchTipos();
  }, [showToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      await api.post('/producto', {
        nombre_prod: form.nombre_producto,
        desc_prod: form.descripcion_producto,
        precio: Number(form.precio_producto),
        cant_stock: Number(form.stock_producto),
        imagen: form.imagen_producto,
        activo: form.activo,
        id_tipoprod: Number(form.id_tipoprod),
      });
      showToast('Producto agregado correctamente', 'success');
      navigate('/admin/productos');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Error al agregar producto', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="productos-admin-container">
      <form className="productos-admin-form" onSubmit={handleSubmit}>
        <h1>Agregar Producto</h1>
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
          <label>Tipo de Producto</label>
          <select
            name="id_tipoprod"
            value={form.id_tipoprod}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un tipo</option>
            {tipos.map(tipo => (
              <option key={tipo.idtipo_producto} value={tipo.idtipo_producto}>
                {tipo.nombre_tipo}
              </option>
            ))}
          </select>
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
          {loading ? 'Agregando...' : 'Agregar'}
        </button>
      </form>
    </div>
  );
};

export default AgregarProductoAdmin;