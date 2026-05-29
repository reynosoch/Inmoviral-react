import React from 'react';
import Navbar from './Componentes/Navbar';
import Hero from './Componentes/Hero';
import TarjetaCasa from './Componentes/TarjetaCasa';

function App() {
  const propiedadesEjemplo = [
    { id: 1, titulo: "Casa Residencial San Felipe", precio: "2,450,000", ubicacion: "Chihuahua, Chih.", servicio: "Mudanza Completa" },
    { id: 2, titulo: "Departamento Equipado Centro", precio: "1,200,000", ubicacion: "Chihuahua, Chih.", servicio: "Fotografía Pro + Limpieza" },
    { id: 3, titulo: "Residencia Cordilleras", precio: "3,800,000", ubicacion: "Chihuahua, Chih.", servicio: "Limpieza Profunda" }
  ];

  return (
    <div style={{ fontFamily: 'sans-serif', margin: 0, background: '#f1f5f9', minHeight: '100vh' }}>
      <Navbar />
      <Hero />
      
      <div id="catalogo" style={{ padding: '40px' }}>
        <h2 style={{ color: '#0f172a', marginBottom: '20px' }}>Propiedades Disponibles</h2>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {propiedadesEjemplo.map(casa => (
            <TarjetaCasa 
              key={casa.id}
              titulo={casa.titulo}
              precio={casa.precio}
              ubicacion={casa.ubicacion}
              servicio={casa.servicio}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Esto es lo que le falta a tu archivo para corregir el error de la captura:
export default App;