import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import type { TipoProducto } from '../../types';
import './TipoProductoDropdown.css';


interface TipoProductoDropdownProps {
  onTipoSelect: (tipoId: number | null) => void;
}

const TipoProductoDropdown: React.FC<TipoProductoDropdownProps> = ({ onTipoSelect }) => {
  const [tiposProducto, setTiposProducto] = useState<TipoProducto[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTipo, setSelectedTipo] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  console.log('tiposProducto:', tiposProducto);

  useEffect(() => {
    fetchTiposProducto();
  }, []);

  useEffect(() => {
    // Cerrar el menú al hacer click afuera
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const fetchTiposProducto = async () => {
    try {
      const response = await api.get('/tipoproducto');
      setTiposProducto(response.data.data || []);
    } catch (error) {
      console.error('Error al cargar tipos de producto:', error);
    }
  };

  const handleTipoClick = (tipoId: number | null) => {
    console.log('Click en tipo:', tipoId); // <-- Agrega esto
    setIsOpen(false);
    setSelectedTipo(tipoId);
    onTipoSelect(tipoId);
    if (tipoId) {
      navigate(`/productos/${tipoId}`);
    } else {
      navigate('/');
    }
  };

  // Nombre a mostrar en el botón
  const selectedTipoNombre =
    selectedTipo === null
      ? 'Todas las categorías'
      : tiposProducto.find((tipo) => tipo.idtipo_producto === selectedTipo)?.nombre_tipo || 'Categoría';

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <button
        className="dropdown-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedTipoNombre} ▼
      </button>

      <div
        className={`dropdown-menu${isOpen ? ' open' : ''}`}
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      >
        {isOpen && (
          <div>
            {tiposProducto.map((tipo, idx) => (
              <div
              key={tipo.idtipo_producto ?? `tipo-${idx}`}
              className={`dropdown-item${selectedTipo === tipo.idtipo_producto ? ' selected' : ''}`}
              onClick={() => handleTipoClick(tipo.idtipo_producto ?? null)}
  >
    {tipo.nombre_tipo}
  </div>
))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TipoProductoDropdown;