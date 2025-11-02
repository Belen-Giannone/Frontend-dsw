import React, { createContext, useContext, useState} from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastContextType {
  showToast: (mensaje: string, tipo?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast debe usarse dentro de ToastProvider');
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mensaje, setMensaje] = useState('');
  const [tipo, setTipo] = useState<ToastType>('success');
  const [visible, setVisible] = useState(false);

  const showToast = (msg: string, tipoToast: ToastType = 'success') => {
    setMensaje(msg);
    setTipo(tipoToast);
    setVisible(true);
    setTimeout(() => setVisible(false), 1800);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {visible && (
        <div className={`toast-global ${tipo}`}>
          <strong>
            {tipo === 'success'
              ? '¡Éxito!'
              : tipo === 'error'
              ? 'Error'
              : 'Aviso'}
          </strong>
          <div>{mensaje}</div>
        </div>
      )}
    </ToastContext.Provider>
  );
};