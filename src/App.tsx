import { useState } from 'react'
import api from './services/api'
import Header from './components/Header'
import './App.css'

function App() {
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const probarConexion = async () => {
    try {
      setLoading(true);
      console.log('Probando conexión...');
      
      // Traer todos los productos
      const response = await api.get('/tipoproducto');
      console.log('✅ Respuesta del backend:', response.data);
      
      setProductos(response.data.data); // Acceder al array dentro del objeto
      alert(`✅ Conexión exitosa! Se encontraron ${response.data.data.length} tipos de productos`);

    } catch (error) {
      console.error('❌ Error:', error);
      alert('❌ Error de conexión. Ver consola para detalles');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <h2>Contenido principal aquí</h2>
        
        {/* Botón de prueba */}
        <button 
          onClick={probarConexion}
          disabled={loading}
          style={{
            padding: '15px 30px',
            backgroundColor: loading ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            marginTop: '20px'
          }}
        >
          {loading ? '⏳ Probando...' : '🔧 Probar Conexión Backend'}
        </button>

        {/* Mostrar resultados */}
        {productos.length > 0 && (
          <div style={{ marginTop: '30px' }}>
            <h3>✅ Tipos de Productos ({productos.length}):</h3>
            <ul style={{ textAlign: 'left', maxWidth: '600px' }}>
              {productos.map((tipo: any, index: number) => (
                <li key={index} style={{ 
                  padding: '8px',
                  margin: '5px 0',
                  backgroundColor: '#f0f8ff',
                  borderRadius: '4px'
                }}>
                  {JSON.stringify(tipo)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
