import React from 'react';

function Navbar() {
  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 40px', background: '#1e293b', color: 'white', alignItems: 'center' }}>
      <h2>InmoViral</h2>
      <div style={{ display: 'flex', gap: '20px' }}>
        <a href="#catalogo" style={{ color: 'white', textDecoration: 'none' }}>Catálogo</a>
        <a href="#servicios" style={{ color: 'white', textDecoration: 'none' }}>Servicios Virales</a>
      </div>
      <div>
        <button style={{ background: 'transparent', color: 'white', border: '1px solid white', padding: '8px 15px', borderRadius: '5px', marginRight: '10px', cursor: 'pointer' }}>Iniciar Sesión</button>
        <button style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>Registrarse</button>
      </div>
    </nav>
  );
}

export default Navbar;