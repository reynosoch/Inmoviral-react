import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabaseClient';
import './Propiedades.css';

const FALLBACK = [
  { id: 1, titulo: 'Penthouse Mirabel', ubicacion: 'Polanco, CDMX', precio: 85000, habitaciones: 3, banos: 3, m2: 280, imagenes: ['https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80&auto=format&fit=crop'] },
  { id: 2, titulo: 'Suite Ámbar', ubicacion: 'Santa Fe, CDMX', precio: 52000, habitaciones: 2, banos: 2, m2: 160, imagenes: ['https://images.unsplash.com/photo-1503174971373-b1f69850bded?w=800&q=80&auto=format&fit=crop'] },
  { id: 3, titulo: 'Departamento Cielo', ubicacion: 'Condesa, CDMX', precio: 38000, habitaciones: 2, banos: 2, m2: 120, imagenes: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80&auto=format&fit=crop'] },
  { id: 4, titulo: 'Loft Mercurio', ubicacion: 'Roma Norte, CDMX', precio: 28000, habitaciones: 1, banos: 1, m2: 90, imagenes: ['https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80&auto=format&fit=crop'] },
  { id: 5, titulo: 'Casa Jardín', ubicacion: 'Coyoacán, CDMX', precio: 45000, habitaciones: 3, banos: 2, m2: 210, imagenes: ['https://images.unsplash.com/photo-1565372195458-9de0b320ef04?w=800&q=80&auto=format&fit=crop'] },
  { id: 6, titulo: 'Piso Imperial', ubicacion: 'Lomas Virreyes, CDMX', precio: 110000, habitaciones: 4, banos: 4, m2: 400, imagenes: ['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80&auto=format&fit=crop'] },
];

// Formatea números a "85,000" sin decimales
const formatPrecio = (num) => {
  if (num === null || num === undefined) return '0';
  return Number(num).toLocaleString('es-MX', { maximumFractionDigits: 0 });
};

export default function PropiedadesRenta({ onVerPropiedad }) {
  const { t } = useTranslation();
  const [propiedades, setPropiedades] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [orden, setOrden] = useState('reciente');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const cargar = async () => {
      const { data, error } = await supabase
        .from('propiedades')
        .select('*')
        .eq('tipo_transaccion', 'Renta')
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
      if (orden === 'precio-asc') return (a.precio || 0) - (b.precio || 0);
      if (orden === 'precio-desc') return (b.precio || 0) - (a.precio || 0);
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });

  return (
    <div className="props-page">
      {/* HERO */}
      <section className="props-hero props-hero--renta">
        <img
          src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1800&q=80&auto=format&fit=crop"
          alt={t('props_renta_title_1') + ' ' + t('props_renta_title_em')}
        />
        <div className="props-hero-overlay" />
        <div className="props-hero-body">
          <div className="props-eyebrow">{t('props_renta_eyebrow')}</div>
          <h1>{t('props_renta_title_1')}<br /><em>{t('props_renta_title_em')}</em></h1>
          <p>{t('props_renta_sub')}</p>
        </div>
      </section>

      {/* FILTROS */}
      <section className="props-filters">
        <div className="props-filters-inner">
          <input
            className="props-search-input"
            type="text"
            placeholder={t('props_search_ph')}
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
          />
          <select
            className="props-select"
            value={orden}
            onChange={e => setOrden(e.target.value)}
          >
            <option value="reciente">{t('props_sort_reciente')}</option>
            <option value="precio-asc">{t('props_sort_precio_asc')}</option>
            <option value="precio-desc">{t('props_sort_precio_desc')}</option>
          </select>
          <div className="props-count">
            {lista.length} {lista.length !== 1 ? t('props_count_plural') : t('props_count_singular')}
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="props-grid-section">
        <div className="props-grid">
          {lista.map((p) => (
            <article className="prop-card" key={p.id}>
              <div className="prop-img-wrap">
                <img
                  src={p.imagenes?.[0] || 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&q=70'}
                  alt={p.titulo}
                  loading="lazy"
                />
                <span className="prop-badge renta">{t('props_badge_renta')}</span>
              </div>
              <div className="prop-body">
                <div className="prop-price">${formatPrecio(p.precio)}<span>{t('props_per_month')}</span></div>
                <h3 className="prop-name">{p.titulo}</h3>
                <p className="prop-loc">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {p.ubicacion}
                </p>
                <div className="prop-specs">
                  <span>🛏 {p.habitaciones} {t('props_rec')}</span>
                  <span>🚿 {p.banos} {t('props_banos')}</span>
                  <span>📐 {p.m2} m²</span>
                </div>
                <button className="prop-btn" onClick={() => onVerPropiedad && onVerPropiedad(p.id)}>
                  {t('props_ver_propiedad')}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
