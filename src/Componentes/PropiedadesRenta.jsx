import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import './Propiedades.css';

const FALLBACK = [
  { id: 1, titulo: 'Penthouse Mirabel', ubicacion: 'Polanco, CDMX', precio: '85,000/mes', recamaras: 3, banos: 3, m2: 280, imagen: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80&auto=format&fit=crop' },
  { id: 2, titulo: 'Suite Ámbar', ubicacion: 'Santa Fe, CDMX', precio: '52,000/mes', recamaras: 2, banos: 2, m2: 160, imagen: 'https://images.unsplash.com/photo-1503174971373-b1f69850bded?w=800&q=80&auto=format&fit=crop' },
  { id: 3, titulo: 'Departamento Cielo', ubicacion: 'Condesa, CDMX', precio: '38,000/mes', recamaras: 2, banos: 2, m2: 120, imagen: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80&auto=format&fit=crop' },
  { id: 4, titulo: 'Loft Mercurio', ubicacion: 'Roma Norte, CDMX', precio: '28,000/mes', recamaras: 1, banos: 1, m2: 90, imagen: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80&auto=format&fit=crop' },
  { id: 5, titulo: 'Casa Jardín', ubicacion: 'Coyoacán, CDMX', precio: '45,000/mes', recamaras: 3, banos: 2, m2: 210, imagen: 'https://images.unsplash.com/photo-1565372195458-9de0b320ef04?w=800&q=80&auto=format&fit=crop' },
  { id: 6, titulo: 'Piso Imperial', ubicacion: 'Lomas Virreyes, CDMX', precio: '110,000/mes', recamaras: 4, banos: 4, m2: 400, imagen: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80&auto=format&fit=crop' },
];

export default function PropiedadesRenta() {
  const [propiedades, setPropiedades] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [orden, setOrden] = useState('reciente');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const cargar = async () => {
      const { data, error } = await supabase
        .from('propiedades')
        .select('*')
        .eq('tipo', 'renta')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) setPropiedades(data);
      else setPropiedades(FALLBACK);
    };
    cargar();
  }, []);

  const lista = propiedades
    .filter(p =>
      filtro === '' ||
      p.titulo?.toLowerCase().includes(filtro.toLowerCase()) ||
      p.ubicacion?.toLowerCase().includes(filtro.toLowerCase())
    )
    .sort((a, b) => {
      if (orden === 'precio-asc') return (a.precio_num || 0) - (b.precio_num || 0);
      if (orden === 'precio-desc') return (b.precio_num || 0) - (a.precio_num || 0);
      return 0;
    });

  return (
    <div className="props-page">
      {/* HERO */}
      <section className="props-hero props-hero--renta">
        <img
          src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1800&q=80&auto=format&fit=crop"
          alt="Propiedades en Renta"
        />
        <div className="props-hero-overlay" />
        <div className="props-hero-body">
          <div className="props-eyebrow">— Espacios Disponibles</div>
          <h1>Propiedades<br /><em>en Renta</em></h1>
          <p>Encuentra tu próximo hogar temporal entre nuestra selección exclusiva.</p>
        </div>
      </section>

      {/* FILTROS */}
      <section className="props-filters">
        <div className="props-filters-inner">
          <input
            className="props-search-input"
            type="text"
            placeholder="Buscar por nombre o ubicación..."
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
          />
          <select
            className="props-select"
            value={orden}
            onChange={e => setOrden(e.target.value)}
          >
            <option value="reciente">Más Recientes</option>
            <option value="precio-asc">Precio: Menor a Mayor</option>
            <option value="precio-desc">Precio: Mayor a Menor</option>
          </select>
          <div className="props-count">{lista.length} propiedad{lista.length !== 1 ? 'es' : ''}</div>
        </div>
      </section>

      {/* GRID */}
      <section className="props-grid-section">
        <div className="props-grid">
          {lista.map((p) => (
            <article className="prop-card" key={p.id}>
              <div className="prop-img-wrap">
                <img
                  src={p.imagen || p.imagenes?.[0] || 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&q=70'}
                  alt={p.titulo}
                  loading="lazy"
                />
                <span className="prop-badge renta">Renta</span>
              </div>
              <div className="prop-body">
                <div className="prop-price">${p.precio} <span>MXN</span></div>
                <h3 className="prop-name">{p.titulo}</h3>
                <p className="prop-loc">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {p.ubicacion}
                </p>
                <div className="prop-specs">
                  <span>🛏 {p.recamaras} rec.</span>
                  <span>🚿 {p.banos} baños</span>
                  <span>📐 {p.m2} m²</span>
                </div>
                <button className="prop-btn">Ver Propiedad →</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
