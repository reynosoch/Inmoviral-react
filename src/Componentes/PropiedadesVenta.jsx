import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabaseClient';
import './Propiedades.css';

const FALLBACK = [
  { id: 1, titulo: 'Residencia Belvedere', ubicacion: 'Bosques de las Lomas, CDMX', precio: 18500000, habitaciones: 4, banos: 5, m2: 520, imagenes: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80&auto=format&fit=crop'] },
  { id: 2, titulo: 'Casa Almendro', ubicacion: 'San Ángel, CDMX', precio: 12900000, habitaciones: 3, banos: 4, m2: 380, imagenes: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80&auto=format&fit=crop'] },
  { id: 3, titulo: 'Departamento Aurora', ubicacion: 'Polanco, CDMX', precio: 9800000, habitaciones: 3, banos: 3, m2: 240, imagenes: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80&auto=format&fit=crop'] },
  { id: 4, titulo: 'Villa Cordoba', ubicacion: 'Valle de Bravo, EdoMex', precio: 22500000, habitaciones: 5, banos: 5, m2: 610, imagenes: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80&auto=format&fit=crop'] },
  { id: 5, titulo: 'Loft Obsidiana', ubicacion: 'Roma Norte, CDMX', precio: 7600000, habitaciones: 2, banos: 2, m2: 145, imagenes: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80&auto=format&fit=crop'] },
  { id: 6, titulo: 'Casa Mirador', ubicacion: 'Las Águilas, CDMX', precio: 15200000, habitaciones: 4, banos: 4, m2: 450, imagenes: ['https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80&auto=format&fit=crop'] },
];

// Formatea números a "85,000" sin decimales
const formatPrecio = (num) => {
  if (num === null || num === undefined) return '0';
  return Number(num).toLocaleString('es-MX', { maximumFractionDigits: 0 });
};

export default function PropiedadesVenta({ onVerPropiedad }) {
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
        .eq('tipo_transaccion', 'Venta')
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
      <section className="props-hero props-hero--venta">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1800&q=80&auto=format&fit=crop"
          alt={t('props_venta_title_1') + ' ' + t('props_venta_title_em')}
        />
        <div className="props-hero-overlay" />
        <div className="props-hero-body">
          <div className="props-eyebrow">{t('props_venta_eyebrow')}</div>
          <h1>{t('props_venta_title_1')}<br /><em>{t('props_venta_title_em')}</em></h1>
          <p>{t('props_venta_sub')}</p>
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
                  src={p.imagenes?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=70'}
                  alt={p.titulo}
                  loading="lazy"
                />
                <span className="prop-badge venta">{t('props_badge_venta')}</span>
              </div>
              <div className="prop-body">
                <div className="prop-price">${formatPrecio(p.precio)}</div>
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
