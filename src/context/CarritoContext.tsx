import React, { createContext, useContext, useState } from 'react';

export interface ItemCarrito {
  id_producto: number;
  cantidad: number;
}

interface CarritoContextType {
  carrito: ItemCarrito[];
  agregarAlCarrito: (id_producto: number, cantidad?: number) => void;
  quitarDelCarrito: (id_producto: number) => void;
  limpiarCarrito: () => void;
  actualizarCantidad: (id_producto: number, cantidad: number) => void;
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) throw new Error('useCarrito debe usarse dentro de CarritoProvider');
  return context;
};

export const CarritoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);

  const agregarAlCarrito = (id_producto: number, cantidad: number = 1) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id_producto === id_producto);
      if (existe) {
        return prev.map((item) =>
          item.id_producto === id_producto
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      }
      return [...prev, { id_producto, cantidad }];
    });
  };

  const quitarDelCarrito = (id_producto: number) => {
    setCarrito((prev) => prev.filter((item) => item.id_producto !== id_producto));
  };

  const limpiarCarrito = () => setCarrito([]);

  const actualizarCantidad = (id_producto: number, cantidad: number) => {
    setCarrito((prev) =>
      prev.map((item) =>
        item.id_producto === id_producto ? { ...item, cantidad } : item
      )
    );
  };

  return (
    <CarritoContext.Provider
      value={{ carrito, agregarAlCarrito, quitarDelCarrito, limpiarCarrito, actualizarCantidad }}
    >
      {children}
    </CarritoContext.Provider>
  );
};