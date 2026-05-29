import React from 'react';

function Hero() {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
      <h1 style={{ fontSize: '2.5rem', color: '#0f172a' }}>Conectamos tu próximo hogar con servicios de impacto</h1>
      <p style={{ color: '#64748b', fontSize: '1.2rem', marginTop: '10px' }}>
        Compra o vende tu propiedad con fotografía profesional, mudanza y limpieza incluidas.
      </p>
    </div>
  );
}

// ESTA LÍNEA ES LA QUE LE FALTA Y POR ESO DA ERROR:
export default Hero;