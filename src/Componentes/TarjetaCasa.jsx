import React from 'react';

function TarjetaCasa({ titulo, precio, ubicacion, servicio }) {
  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', width: '280px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', background: 'white' }}>
      <div style={{ height: '150px', background: '#cbd5e1', borderRadius: '6px', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
        [ Foto de la Propiedad ]
      </div>
      <h3 style={{ margin: '0 0 10px 0', color: '#0f172a' }}>{titulo}</h3>
      <p style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '1.2rem', margin: '5px 0' }}>${precio}</p>
      <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '5px 0' }}>📍 {ubicacion}</p>
      <span style={{ display: 'inline-block', background: '#dcfce7', color: '#15803d', padding: '4px 8px', borderRadius: '5px', fontSize: '0.8rem', fontWeight: 'bold', marginTop: '5px' }}>
        ✨ Incluye: {servicio}
      </span>
    </div>
  );
}

export default TarjetaCasa;