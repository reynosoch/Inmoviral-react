import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabaseClient';
import './VerPropiedad.css';

// Formatea números a "85,000" sin decimales
const formatPrecio = (num) => {
  if (num === null || num === undefined) return '0';
  return Number(num).toLocaleString('es-MX', { maximumFractionDigits: 0 });
};

export default function VerPropiedad({ propiedadId, onVolver, tipoOrigen }) {
  const { t } = useTranslation();

  const [propiedad, setPropiedad] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [favorito, setFavorito] = useState(false);
  const [imagenActiva, setImagenActiva] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const cargar = async () => {
      setCargando(true);
      const { data, error } = await supabase
        .from('propiedades')
        .select('*')
        .eq('id', propiedadId)
        .single();

      if (!error && data) {
        setPropiedad(data);
      } else {
        setPropiedad(null);
      }
      setCargando(false);
    };
    if (propiedadId !== undefined && propiedadId !== null) {
      cargar();
    } else {
      setCargando(false);
    }
  }, [propiedadId]);

  if (cargando) {
    return (
      <div className="vp-page">
        <div className="vp-loading">
          <div className="vp-spinner" />
        </div>
      </div>
    );
  }

  if (!propiedad) {
    return (
      <div className="vp-page">
        <div className="vp-notfound">
          <h2>{t('vp_not_found_title')}</h2>
          <p>{t('vp_not_found_text')}</p>
          <button className="prop-btn" onClick={onVolver}>
            {t('vp_back')}
          </button>
        </div>
      </div>
    );
  }

  const imagenes = propiedad.imagenes?.length
    ? propiedad.imagenes
    : ['https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1200&q=80&auto=format&fit=crop'];

  const esRenta = propiedad.tipo_transaccion === 'Renta';
  const amenidades = propiedad.amenidades || [];
  const extraThumbs = imagenes.length > 4 ? imagenes.length - 4 : 0;

  return (
    <div className="vp-page">
      {/* BREADCRUMB */}
      <nav className="vp-breadcrumb">
        <a href="#" onClick={(e) => { e.preventDefault(); onVolver && onVolver('home'); }}>{t('vp_breadcrumb_inicio')}</a>
        <span className="sep">/</span>
        <a href="#" onClick={(e) => { e.preventDefault(); onVolver && onVolver(esRenta ? 'renta' : 'venta'); }}>
          {esRenta ? t('vp_breadcrumb_renta') : t('vp_breadcrumb_venta')}
        </a>
        <span className="sep">/</span>
        <span className="current">{propiedad.titulo}</span>
      </nav>

      {/* GALERÍA */}
      <section className="vp-gallery">
        <div className="vp-gallery-main">
          <img src={imagenes[imagenActiva]} alt={propiedad.titulo} />
          <span className={`prop-badge ${esRenta ? 'renta' : 'venta'}`}>
            {esRenta ? t('props_badge_renta') : t('props_badge_venta')}
          </span>
          <button
            className={`vp-fav-btn ${favorito ? 'active' : ''}`}
            onClick={() => setFavorito(!favorito)}
            aria-label={t('vp_favorito')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </button>
        </div>
        <div className="vp-gallery-thumbs-wrap">
          {imagenes.slice(1, 5).map((img, idx) => (
            <div
              key={idx}
              className={`vp-gallery-thumb ${idx === 3 && extraThumbs > 0 ? 'has-extra' : ''}`}
              data-extra={`+${extraThumbs}`}
              onClick={() => setImagenActiva(idx + 1)}
              style={{ cursor: 'pointer' }}
            >
              <img src={img} alt={`${propiedad.titulo} ${idx + 2}`} />
            </div>
          ))}
        </div>
      </section>

      {/* CONTENIDO PRINCIPAL */}
      <div className="vp-main">
        <div className="vp-content">

          {/* HEADER */}
          <div className="vp-header">
            <div>
              <div className="vp-eyebrow">{t('vp_eyebrow')}</div>
              <h1 className="vp-title">{propiedad.titulo}</h1>
              <p className="vp-location">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {propiedad.ubicacion}
              </p>
            </div>
            <div className="vp-price-block">
              <div className="vp-price">
                ${formatPrecio(propiedad.precio)}
                <span>{esRenta ? t('props_per_month') : t('vp_precio_total')}</span>
              </div>
            </div>
          </div>

          {/* SPECS */}
          <div className="vp-specs">
            <div className="vp-spec">
              <div className="vp-spec-value">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 7v11M3 11h18v7M21 11V8a2 2 0 00-2-2H8a2 2 0 00-2 2v3" />
                  <circle cx="7" cy="7" r="1.5" />
                </svg>
                {propiedad.habitaciones}
              </div>
              <div className="vp-spec-label">{t('props_rec')}</div>
            </div>
            <div className="vp-spec">
              <div className="vp-spec-value">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 12h16v3a4 4 0 01-4 4H8a4 4 0 01-4-4v-3zM4 12V6a2 2 0 012-2h1M9 8h.01" />
                  <path d="M4 19v1M18 19v1" />
                </svg>
                {propiedad.banos}
              </div>
              <div className="vp-spec-label">{t('props_banos')}</div>
            </div>
            <div className="vp-spec">
              <div className="vp-spec-value">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 9V3h6M21 9V3h-6M3 15v6h6M21 15v6h-6" />
                </svg>
                {propiedad.m2}
              </div>
              <div className="vp-spec-label">M²</div>
            </div>
            {propiedad.estacionamientos !== undefined && propiedad.estacionamientos !== null && (
              <div className="vp-spec">
                <div className="vp-spec-value">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 17h14M5 17a2 2 0 01-2-2v-2l2-5h14l2 5v2a2 2 0 01-2 2M5 17v2a1 1 0 001 1h1a1 1 0 001-1v-2h8v2a1 1 0 001 1h1a1 1 0 001-1v-2" />
                    <circle cx="7.5" cy="14" r="0.5" />
                    <circle cx="16.5" cy="14" r="0.5" />
                  </svg>
                  {propiedad.estacionamientos}
                </div>
                <div className="vp-spec-label">{t('vp_estacionamiento')}</div>
              </div>
            )}
          </div>

          {/* DESCRIPCIÓN */}
          <div className="vp-section">
            <h2 className="vp-section-title">{t('vp_descripcion_title')}</h2>
            <p className="vp-description">
              {propiedad.descripcion || t('vp_descripcion_default')}
            </p>
          </div>

          {/* AMENIDADES */}
          {amenidades.length > 0 && (
            <div className="vp-section">
              <h2 className="vp-section-title">{t('vp_amenidades_title')}</h2>
              <div className="vp-amenities">
                {amenidades.map((am, idx) => (
                  <div className="vp-amenity" key={idx}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    {am}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* UBICACIÓN */}
          <div className="vp-section">
            <h2 className="vp-section-title">{t('vp_ubicacion_title')}</h2>
            <div className="vp-map">
              {propiedad.mapa_url ? (
                <iframe
                  src={propiedad.mapa_url}
                  title="Mapa"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="vp-map-placeholder">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {propiedad.ubicacion}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SIDEBAR CONTACTO */}
        <aside className="vp-sidebar">
          <div className="vp-contact-card">
            <h3 className="vp-contact-title">{t('vp_contact_title')}</h3>
            <p className="vp-contact-sub">{t('vp_contact_sub')}</p>

            <div className="vp-agent">
              <div className="vp-agent-avatar">
                {(propiedad.agente_nombre || 'A')[0].toUpperCase()}
              </div>
              <div className="vp-agent-info">
                <h4>{propiedad.agente_nombre || t('vp_agente_default')}</h4>
                <p>{t('vp_agente_role')}</p>
              </div>
            </div>

            <form className="vp-form" onSubmit={(e) => e.preventDefault()}>
              <input type="text" placeholder={t('vp_form_nombre')} required />
              <input type="email" placeholder={t('vp_form_email')} required />
              <input type="tel" placeholder={t('vp_form_telefono')} />
              <textarea
                placeholder={t('vp_form_mensaje')}
                defaultValue={t('vp_form_mensaje_default', { titulo: propiedad.titulo })}
              />
              <button type="submit" className="vp-contact-btn">
                {t('vp_form_enviar')}
              </button>
            </form>

            <div className="vp-contact-divider">{t('vp_contact_o')}</div>

            <div className="vp-alt-actions">
              <button className="vp-alt-btn" onClick={() => window.open(`tel:${propiedad.agente_telefono || ''}`)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
                {t('vp_llamar')}
              </button>
              <button className="vp-alt-btn" onClick={() => window.open(`https://wa.me/${propiedad.agente_whatsapp || ''}`)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                </svg>
                WhatsApp
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
