import React, { useEffect, useRef, useState } from 'react';
import LoginPage from './Componentes/LoginPage.jsx';
import PropiedadesVenta from './Componentes/PropiedadesVenta.jsx';
import PropiedadesRenta from './Componentes/PropiedadesRenta.jsx';
import ServiciosVirales from './Componentes/ServiciosVirales.jsx';
import { useTranslation } from 'react-i18next';
import { useAuth } from './AuthContext.js';
import { supabase } from './supabaseClient'; 
import './App.css';

function App() {
  const { t, i18n } = useTranslation();
  const { user, signOut } = useAuth(); 
  const [vista, setVista] = useState('home');
  const [propiedades, setPropiedades] = useState([]); 
  const rafRef = useRef(null);

  const cambiarIdioma = (idioma) => i18n.changeLanguage(idioma);

  // ══ CONSULTA DINÁMICA DE PROPIEDADES EN SUPABASE ══
  useEffect(() => {
    const cargarCasas = async () => {
      const { data, error } = await supabase
        .from('propiedades')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data && data.length > 0) {
        setPropiedades(data); 
      }
    };
    cargarCasas();
  }, [vista]);

  const listaPropiedades = propiedades.length > 0 ? propiedades : [
    { id: '1', titulo: t('g_t1'), imagenes: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c'] },
    { id: '2', titulo: t('g_t2'), imagenes: ['https://images.unsplash.com/photo-1503174971373-b1f69850bded'] },
    { id: '3', titulo: t('g_t3'), imagenes: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c'] },
    { id: '4', titulo: t('g_t4'), imagenes: ['https://images.unsplash.com/photo-1565372195458-9de0b320ef04'] },
    { id: '5', titulo: t('g_t5'), imagenes: ['https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3'] },
    { id: '6', titulo: t('g_t6'), imagenes: ['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde'] },
    { id: '7', titulo: t('g_t7'), imagenes: ['https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83'] },
    { id: '8', titulo: t('g_t8'), imagenes: ['https://images.unsplash.com/photo-1582407947304-fd86f028f716'] }
  ];

  // ══ CURSOR MOUSE EFFECT ══
  useEffect(() => {
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    cursor.id = 'appCursor';
    document.body.appendChild(cursor);

    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    ring.id = 'appCursorRing';
    document.body.appendChild(ring);

    let mx = 0, my = 0, rx = 0, ry = 0;
    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
    };
    document.addEventListener('mousemove', onMove);

    const tick = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
      cursor.remove();
      ring.remove();
    };
  }, []);

  // ══ HOVERS EFFECT ══
  useEffect(() => {
    const ring = document.getElementById('appCursorRing');
    if (!ring) return;

    const onEnter = () => {
      ring.style.transform   = 'translate(-50%,-50%) scale(1.8)';
      ring.style.borderColor = 'rgba(160,120,64,0.8)';
    };
    const onLeave = () => {
      ring.style.transform   = 'translate(-50%,-50%) scale(1)';
      ring.style.borderColor = 'rgba(160,120,64,0.5)';
    };

    const timer = setTimeout(() => {
      const els = document.querySelectorAll('a, button, .gal, .feature-item');
      els.forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    }, 60);

    return () => {
      clearTimeout(timer);
      document.querySelectorAll('a, button, .gal, .feature-item').forEach(el => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, [vista, propiedades]);

  // ══ SCROLL NAV + REVEAL ══
  useEffect(() => {
    const nav = document.getElementById('nav');
    const onScroll = () => {
      if (nav) {
        if (vista !== 'home' || window.scrollY > 60) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
      }
    };
    window.addEventListener('scroll', onScroll);
    onScroll(); 

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12 });

    const timer = setTimeout(() => {
      document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    }, 50);

    return () => {
      window.removeEventListener('scroll', onScroll);
      obs.disconnect();
      clearTimeout(timer);
    };
  }, [vista]);

  // ══ LOGIN ══
  if (vista === 'login') {
    return <LoginPage onVolver={() => setVista('home')} />;
  }

  // ══ NAVBAR COMPARTIDO ══
  const renderNavbar = () => (
    <nav id="nav" className={vista !== 'home' ? 'scrolled' : ''}>
      <a href="#" className="logo" onClick={(e) => { e.preventDefault(); setVista('home'); }}>INMOVIRAL</a>
      <ul className="nav-links">
        <li>
          <a
            href="#"
            className={vista === 'venta' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); setVista('venta'); }}
          >
            {i18n.language.startsWith('es') ? 'En Venta' : 'For Sale'}
          </a>
        </li>
        <li>
          <a
            href="#"
            className={vista === 'renta' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); setVista('renta'); }}
          >
            {i18n.language.startsWith('es') ? 'En Renta' : 'For Lease'}
          </a>
        </li>
        <li>
          <a
            href="#"
            className={vista === 'servicios' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); setVista('servicios'); }}
          >
            {i18n.language.startsWith('es') ? 'Servicios Virales' : 'Viral Services'}
          </a>
        </li>
        <li>
          <a
            href={vista === 'home' ? '#about' : '#'}
            onClick={(e) => {
              if (vista !== 'home') {
                e.preventDefault();
                setVista('home');
                setTimeout(() => { window.location.hash = '#about'; }, 120);
              }
            }}
          >
            {i18n.language.startsWith('es') ? 'Nosotros' : 'About'}
          </a>
        </li>
        <li>
          <a
            href={vista === 'home' ? '#contact' : '#'}
            onClick={(e) => {
              if (vista !== 'home') {
                e.preventDefault();
                setVista('home');
                setTimeout(() => { window.location.hash = '#contact'; }, 120);
              }
            }}
          >
            {i18n.language.startsWith('es') ? 'Contacto' : 'Contact'}
          </a>
        </li>
      </ul>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ display: 'flex' }}>
          <button onClick={() => cambiarIdioma('es')} style={{ background: i18n.language.startsWith('es') ? '#A07840' : 'transparent', color: 'white', border: '1px solid rgba(160,120,64,0.4)', padding: '8px 14px', fontSize: '11px', letterSpacing: '0.14em', fontFamily: 'inherit', transition: 'all 0.3s', cursor: 'pointer' }}>ES</button>
          <button onClick={() => cambiarIdioma('en')} style={{ background: i18n.language.startsWith('en') ? '#A07840' : 'transparent', color: 'white', border: '1px solid rgba(160,120,64,0.4)', padding: '8px 14px', fontSize: '11px', letterSpacing: '0.14em', fontFamily: 'inherit', transition: 'all 0.3s', cursor: 'pointer' }}>EN</button>
        </div>
        {user ? (
          <button onClick={() => signOut()} className="nav-cta" style={{ background: 'rgba(220,50,50,0.1)', borderColor: 'rgba(220,50,50,0.4)', color: '#ff7070' }}>
            {user.user_metadata?.full_name ? user.user_metadata.full_name.split(' ')[0].toUpperCase() : 'SALIR'} ✕
          </button>
        ) : (
          <button onClick={() => setVista('login')} className="nav-cta">
            {i18n.language.startsWith('es') ? 'Iniciar Sesión' : 'Sign In'}
          </button>
        )}
      </div>
    </nav>
  );

  // ══ VISTAS SECUNDARIAS ══
  if (vista === 'venta')     return <>{renderNavbar()}<PropiedadesVenta /></>;
  if (vista === 'renta')     return <>{renderNavbar()}<PropiedadesRenta /></>;
  if (vista === 'servicios') return <>{renderNavbar()}<ServiciosVirales onIrLogin={() => setVista('login')} /></>;

  // ══ HOME ══
  return (
    <>
      {renderNavbar()}

      {/* ══ HERO ══ */}
      <section className="hero">
        <div className="hero-bg">
          <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1800&q=85&auto=format&fit=crop" alt="Premium Real Estate" loading="eager" />
        </div>
        <div className="hero-overlay"></div>
        <div className="hero-body">
          <div className="hero-tag">{t('hero_tag')}</div>
          <h1 className={`hero-title ${i18n.language.startsWith('es') ? 'es-title' : ''}`}>
            {t('hero_title_1')}<br />
            <em>{t('hero_title_italic')}</em> {t('hero_title_for')}<br />
            {t('hero_title_2')}<br />
            {t('hero_title_3')}
          </h1>
          <p className="hero-desc">{t('hero_desc')}</p>
          <div className="hero-actions">
            <a href="#projects" className="btn-primary">{t('btn_explorar')}</a>
            <a href="#gallery" className="btn-ghost">{t('btn_ver_servicios')}</a>
          </div>
        </div>
        <div className="hero-counter">
          <div className="hc-item"><span className="hc-num">{t('hc1_num')}</span><span className="hc-label">{t('hc1_label')}</span></div>
          <div className="hc-item"><span className="hc-num">{t('hc2_num')}</span><span className="hc-label">{t('hc2_label')}</span></div>
          <div className="hc-item"><span className="hc-num">{t('hc3_num')}</span><span className="hc-label">{t('hc3_label')}</span></div>
        </div>
        <div className="hero-scroll"><div className="scroll-line"></div><span>Scroll</span></div>
      </section>

      {/* ══ TICKER ══ */}
      <div className="ticker-bar">
        <div className="ticker-inner">
          {[...Array(2)].flatMap((_, pass) =>
            ['ticker_1','ticker_2','ticker_3','ticker_4','ticker_5','ticker_6','ticker_7','ticker_8','ticker_9','ticker_10','ticker_11','ticker_12']
              .map((key, i) => <span key={`${pass}-${i}`} className="ticker-item">{t(key)}</span>)
          )}
        </div>
      </div>

      {/* ══ FEATURES ══ */}
      <section className="features">
        <div className="features-grid">
          {[1, 2, 3, 4].map((num, i) => (
            <div key={num} className={`feature-item reveal ${i > 0 ? `reveal-delay-${i}` : ''}`}>
              <span className="feature-num">0{num}</span>
              <div className="feature-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="#A07840" strokeWidth="1.2" strokeLinecap="round">
                  {num === 1 && <path d="M3 21h4v-4H3v4zm0-6h4v-4H3v4zm6 6h4v-6H9v6zm0-10h4V7H9v4zm6 10h4V11h-4v10zm0-12h4V3h-4v6z"/>}
                  {num === 2 && <><rect x="2" y="6" width="20" height="14" rx="1"/><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="11" x2="12" y2="16"/><line x1="9.5" y1="13.5" x2="14.5" y2="13.5"/></>}
                  {num === 3 && <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>}
                  {num === 4 && <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>}
                </svg>
              </div>
              <h3 className="feature-title">{t(`f${num}_title_1`)}<br />{t(`f${num}_title_2`)}</h3>
              <p className="feature-text">{t(`f${num}_desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ GALLERY ══ */}
      <section className="gallery" id="gallery">
        <div className="section-header reveal">
          <div>
            <div className="section-label">{t('gal_label')}</div>
            <h2 className="section-title">{t('gal_title_1')}<br />{t('gal_title_2')}<br />{t('gal_title_3')}</h2>
          </div>
          <a href="#projects" className="view-all">{t('gal_view_all')}</a>
        </div>
        <div className="gallery-grid">
          {listaPropiedades.slice(0, 8).map((casa, i) => (
            <div key={casa.id} className={`gal reveal ${i % 4 === 1 ? 'reveal-delay-1' : i % 4 === 2 ? 'reveal-delay-2' : i % 4 === 3 ? 'reveal-delay-3' : ''}`}>
              <img src={casa.imagenes && casa.imagenes[0] ? casa.imagenes[0] : "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80"} alt={casa.titulo || 'Propiedad'} loading="lazy" />
              <div className="gal-overlay"></div>
              <span className="gal-title">{casa.titulo}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══ ABOUT ══ */}
      <section className="about" id="about">
        <div className="about-inner">
          <div className="reveal">
            <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80&auto=format&fit=crop" alt="About INMOVIRAL" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
          <div className="reveal reveal-delay-1">
            <div className="about-label">{t('about_label')}</div>
            <h2 className="about-title">{t('about_title_1')}<br /><em>{t('about_title_2')}</em><br />{t('about_title_3')}</h2>
            <p className="about-text">{t('about_desc_1')}</p>
            <p className="about-text">{t('about_desc_2')}</p>
            <a href="#contact" className="btn-outline-light" style={{ marginBottom: '48px', display: 'inline-flex' }}>{t('about_btn_more')}</a>
            <div className="about-stats">
              {[1, 2, 3].map((num) => (
                <div key={num} className="stat-box">
                  <span className="stat-num">{t(`as${num}_num`)}<span className="stat-unit">{t(`as${num}_unit`)}</span></span>
                  <span className="stat-label">{t(`as${num}_label`)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ PRODUCTS ══ */}
      <section className="products" id="projects">
        <div className="section-header reveal">
          <div>
            <div className="section-label">{t('pilars_label')}</div>
            <h2 className="section-title">{t('pilars_title')}</h2>
          </div>
        </div>
        <div className="products-grid">
          <div className="product-card reveal">
            <div className="product-body">
              <div>
                <span className="product-tag">{t('p1_tag')}</span>
                <h3 className="product-title">{t('p1_title_1')}<br />{t('p1_title_2')}</h3>
                <p className="product-desc">{t('p1_desc')}</p>
              </div>
              <a href="#" className="btn-sm" onClick={(e) => { e.preventDefault(); setVista('servicios'); }}>{t('p1_btn')}</a>
            </div>
            <div className="product-img-wrap">
              <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=80&auto=format&fit=crop&crop=right" alt="Luxury Home" loading="lazy" />
            </div>
          </div>
          <div className="product-card reveal reveal-delay-2">
            <div className="product-body">
              <div>
                <span className="product-tag">{t('p2_tag')}</span>
                <h3 className="product-title">{t('p2_title_1')}<br />{t('p2_title_2')}</h3>
                <p className="product-desc">{t('p2_desc')}</p>
              </div>
              <a href="#" className="btn-sm" onClick={(e) => { e.preventDefault(); setVista('servicios'); }}>{t('p2_btn')}</a>
            </div>
            <div className="product-img-wrap">
              <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80&auto=format&fit=crop&crop=right" alt="Premium Apartment" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* ══ PROCESS ══ */}
      <section className="process">
        <div className="section-header reveal">
          <div>
            <div className="section-label">{t('process_label')}</div>
            <h2 className="section-title">{t('process_title')}</h2>
          </div>
        </div>
        <div className="process-steps">
          {[1,2,3,4,5].map((n, i) => (
            <div key={n} className={`step reveal${i > 0 ? ` reveal-delay-${i}` : ''}`}>
              <div className="step-num-wrap"><span className="step-num">0{n}</span></div>
              <h4 className="step-title">{t(`step${n}_title`)}</h4>
              <p className="step-text">{t(`step${n}_desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section className="testimonials">
        <div className="section-header reveal">
          <div>
            <div className="section-label">{t('testi-label')}</div>
            <h2 className="section-title">{t('testi-title')}</h2>
          </div>
        </div>
        <div className="testi-grid">
          {[
            { n: 1, avatar: 'photo-1507003211169-0a1dd7228f2d' },
            { n: 2, avatar: 'photo-1494790108755-2616b612b786' },
            { n: 3, avatar: 'photo-1472099645785-5658abf4ff4e' },
          ].map(({ n, avatar }, i) => (
            <div key={n} className={`testi-card reveal${i > 0 ? ` reveal-delay-${i}` : ''}`}>
              <span className="testi-quote">"</span>
              <p className="testi-text">{t(`t${n}_text`)}</p>
              <div className="testi-author">
                <div className="testi-avatar">
                  <img src={`https://images.unsplash.com/${avatar}?w=80&q=70&auto=format&fit=crop&crop=face`} alt="" loading="lazy" />
                </div>
                <div>
                  <div className="testi-name">{t(`t${n}_author`)}</div>
                  <div className="testi-role">{t(`t${n}_role`)}</div>
                </div>
                <div className="testi-stars">★★★★★</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ CTA BANNER ══ */}
      <div className="cta-banner" id="contact">
        <img src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1600&q=80&auto=format&fit=crop" alt="" loading="lazy" />
        <div className="cta-overlay">
          <p className="cta-label">{t('cta_label')}</p>
          <h2 className="cta-title">{t('cta_title_1')}<br /><em>{t('cta_title_italic')}</em></h2>
          <a href="tel:+78000000000" className="btn-primary" style={{ fontSize: '13px', padding: '18px 44px' }}>{t('cta_btn')}</a>
        </div>
      </div>

      {/* ══ FOOTER ══ */}
      <footer>
        <div className="footer-top">
          <div className="footer-brand">
            <a href="#" className="logo">INMOVIRAL</a>
            <p className="footer-tagline">{t('footer_tagline')}</p>
            <div className="footer-social">
              <a href="#" className="social-btn">in</a>
              <a href="#" className="social-btn">vk</a>
              <a href="#" className="social-btn">ig</a>
              <a href="#" className="social-btn">yt</a>
            </div>
          </div>
          <div className="footer-col">
            <h4>{t('footer_col1_title')}</h4>
            <ul>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setVista('venta'); }}>{t('footer_link1')}</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setVista('renta'); }}>{t('footer_link2')}</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setVista('servicios'); }}>{t('footer_link3')}</a></li>
              <li><a href="#">{t('footer_link4')}</a></li>
              <li><a href="#">{t('footer_link5')}</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>{t('footer_col2_title')}</h4>
            <ul>
              <li><a href="#">{t('g_t1')}</a></li>
              <li><a href="#">{t('g_t2')}</a></li>
              <li><a href="#">{t('g_t8')}</a></li>
              <li><a href="#">{t('g_t5')}</a></li>
              <li><a href="#">{t('g_t6')}</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>{t('footer_col3_title')}</h4>
            <ul>
              <li><a href="tel:+78000000000">+7 (800) 000-00-00</a></li>
              <li><a href="mailto:info@inmoviral.com">info@inmoviral.com</a></li>
              <li><a href="#">123 Premier Avenue, Suite 1</a></li>
              <li><a href="#">{t('footer_hours')}</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>{t('footer_rights')}</span>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="#">{t('footer_privacy')}</a>
            <a href="#">{t('footer_terms')}</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
