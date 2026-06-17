import React, { useEffect } from 'react';
import './UserMenu.css';

export default function UserMenu({ open, onClose, user, vista, setVista, signOut, idiomaEs }) {

  // Cerrar con tecla ESC
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!user) return null;

  const nombre = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario';
  const inicial = nombre.trim().charAt(0).toUpperCase();
  const correo = user.email || '';

  const ir = (destino) => {
    setVista(destino);
    onClose();
  };

  const cerrarSesion = () => {
    onClose();
    signOut();
  };

  return (
    <>
      <div className={`um-overlay ${open ? 'visible' : ''}`} onClick={onClose} />

      <aside className={`um-drawer ${open ? 'open' : ''}`} aria-label="Menú de usuario">

        <div className="um-profile">
          <div className="um-avatar">{inicial}</div>
          <div className="um-info">
            <div className="um-name">{nombre}</div>
            <div className="um-role">{correo}</div>
          </div>
          <button className="um-close" onClick={onClose} aria-label={idiomaEs ? 'Cerrar menú' : 'Close menu'}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="um-section">
          <div className="um-section-label">{idiomaEs ? 'Explorar' : 'Explore'}</div>
          <button className={`um-link ${vista === 'venta' ? 'active' : ''}`} onClick={() => ir('venta')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1V9.5z"/></svg>
            <span className="um-link-label">{idiomaEs ? 'Propiedades en Venta' : 'Properties for Sale'}</span>
          </button>
          <button className={`um-link ${vista === 'renta' ? 'active' : ''}`} onClick={() => ir('renta')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="7" width="18" height="13" rx="1"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
            <span className="um-link-label">{idiomaEs ? 'Propiedades en Renta' : 'Properties for Lease'}</span>
          </button>
          <button className={`um-link ${vista === 'servicios' ? 'active' : ''}`} onClick={() => ir('servicios')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>
            <span className="um-link-label">{idiomaEs ? 'Servicios Virales' : 'Viral Services'}</span>
          </button>
          <button className={`um-link ${vista === 'nosotros' ? 'active' : ''}`} onClick={() => ir('nosotros')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>
            <span className="um-link-label">{idiomaEs ? 'Sobre Nosotros' : 'About Us'}</span>
          </button>
        </div>

        <div className="um-divider" />

        <div className="um-section">
          <div className="um-section-label">{idiomaEs ? 'Cuenta' : 'Account'}</div>
          <button className={`um-link ${vista === 'vendedor' ? 'active' : ''}`} onClick={() => ir('vendedor')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z"/><path d="M5 18h14"/></svg>
            <span className="um-link-label">{idiomaEs ? 'Publicar Propiedad' : 'List Property'}</span>
          </button>
        </div>

        <div className="um-footer">
          <button className="um-logout" onClick={cerrarSesion}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            {idiomaEs ? 'Cerrar Sesión' : 'Sign Out'}
          </button>
        </div>

      </aside>
    </>
  );
}
