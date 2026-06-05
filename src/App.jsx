import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './App.css';

function App() {
  const { t, i18n } = useTranslation();

  const cambiarIdioma = (idioma) => {
    i18n.changeLanguage(idioma);
  };

  useEffect(() => {
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursorRing');
    let mx = 0, my = 0, rx = 0, ry = 0;
    
    const moveCursor = (e) => { 
      mx = e.clientX; 
      my = e.clientY;
      if(cursor) { cursor.style.left = mx + 'px'; cursor.style.top = my + 'px'; }
    };
    document.addEventListener('mousemove', moveCursor);

    let animationFrame;
    const animRing = () => {
      rx += (mx - rx) * 0.12; 
      ry += (my - ry) * 0.12;
      if(ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
      animationFrame = requestAnimationFrame(animRing);
    };
    animRing();

    const elements = document.querySelectorAll('a, button, .gal, .feature-item');
    const handleMouseEnter = () => { if(ring) { ring.style.transform = 'translate(-50%,-50%) scale(1.8)'; ring.style.borderColor = 'rgba(160,120,64,0.8)'; }};
    const handleMouseLeave = () => { if(ring) { ring.style.transform = 'translate(-50%,-50%) scale(1)'; ring.style.borderColor = 'rgba(160,120,64,0.5)'; }};

    elements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    const nav = document.getElementById('nav');
    const handleScroll = () => { 
      if(nav) nav.classList.toggle('scrolled', window.scrollY > 60); 
    };
    window.addEventListener('scroll', handleScroll);

    const reveals = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { 
        if(e.isIntersecting) { 
          e.target.classList.add('visible'); 
          obs.unobserve(e.target); 
        } 
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => obs.observe(el));

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrame);
      elements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <>
      <div className="cursor" id="cursor"></div>
      <div className="cursor-ring" id="cursorRing"></div>

      {/* ══ NAV ══ */}
      <nav id="nav">
        <a href="#" className="logo">INMOVIRAL</a>
        <ul className="nav-links">
          <li><a href="#about">{t('nav_1')}</a></li>
          <li><a href="#gallery">{t('nav_2')}</a></li>
          <li><a href="#projects">{t('nav_3')}</a></li>
          <li><a href="#contact">{t('nav_4')}</a></li>
        </ul>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            <button onClick={() => cambiarIdioma('es')} style={{ background: i18n.language === 'es' ? '#A07840' : 'transparent', color: 'white', border: '1px solid #A07840', padding: '6px 12px', cursor: 'pointer', fontSize: '11px', letterSpacing: '0.1em' }}>ES</button>
            <button onClick={() => cambiarIdioma('en')} style={{ background: i18n.language === 'en' ? '#A07840' : 'transparent', color: 'white', border: '1px solid #A07840', padding: '6px 12px', cursor: 'pointer', fontSize: '11px', letterSpacing: '0.1em' }}>EN</button>
          </div>
          <a href="#contact" className="nav-cta">{t('nav_btn')}</a>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section className="hero">
        <div className="hero-bg">
          <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1800&q=85&auto=format&fit=crop" alt="Premium Real Estate" loading="eager" />
        </div>
        <div className="hero-overlay"></div>

        <div className="hero-body">
          <div className="hero-tag">{t('hero_tag')}</div>
          {/* Estructura ÚNICA de 4 renglones para ambos idiomas. 100% simétrico. */}
          <h1 className="hero-title">
            {t('hero_title_1')}<br />
            <em>{t('hero_title_italic')}</em> {t('hero_title_for')}<br />
            {t('hero_title_2')}<br />
            {t('hero_title_3')}
          </h1>
          
          <p className="hero-desc">{t('hero_desc')}</p>
          
          <div className="hero-actions">
            <a href="#contact" className="btn-primary">{t('btn_explorar')}</a>
            <a href="#gallery" className="btn-ghost">{t('btn_ver_servicios')}</a>
          </div>
        </div>

        <div className="hero-counter">
          <div className="hc-item"><span className="hc-num">{t('hc1_num')}</span><span className="hc-label">{t('hc1_label')}</span></div>
          <div className="hc-item"><span className="hc-num">{t('hc2_num')}</span><span className="hc-label">{t('hc2_label')}</span></div>
          <div className="hc-item"><span className="hc-num">{t('hc3_num')}</span><span className="hc-label">{t('hc3_label')}</span></div>
        </div>

        <div className="hero-scroll">
          <div className="scroll-line"></div>
          <span>Scroll</span>
        </div>
      </section>

      {/* ══ TICKER ══ */}
      <div className="ticker-bar">
        <div className="ticker-inner">
          <span className="ticker-item">{t('ticker_1')}</span>
          <span className="ticker-item">{t('ticker_2')}</span>
          <span className="ticker-item">{t('ticker_3')}</span>
          <span className="ticker-item">{t('ticker_4')}</span>
          <span className="ticker-item">{t('ticker_5')}</span>
          <span className="ticker-item">{t('ticker_6')}</span>
          <span className="ticker-item">{t('ticker_7')}</span>
          <span className="ticker-item">{t('ticker_8')}</span>
          <span className="ticker-item">{t('ticker_9')}</span>
          <span className="ticker-item">{t('ticker_10')}</span>
          <span className="ticker-item">{t('ticker_11')}</span>
          <span className="ticker-item">{t('ticker_12')}</span>
        </div>
      </div>

      {/* ══ FEATURES ══ */}
      <section className="features">
        <div className="features-grid">
          <div className="feature-item reveal">
            <span className="feature-num">01</span>
            <div className="feature-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="#A07840" strokeWidth="1.2" strokeLinecap="round">
                <path d="M3 21h4v-4H3v4zm0-6h4v-4H3v4zm6 6h4v-6H9v6zm0-10h4V7H9v4zm6 10h4V11h-4v10zm0-12h4V3h-4v6z"/>
              </svg>
            </div>
            <h3 className="feature-title">{t('f1_title_1')}<br />{t('f1_title_2')}</h3>
            <p className="feature-text">{t('f1_desc')}</p>
          </div>
          <div className="feature-item reveal reveal-delay-1">
            <span className="feature-num">02</span>
            <div className="feature-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="#A07840" strokeWidth="1.2" strokeLinecap="round">
                <rect x="2" y="6" width="20" height="14" rx="1"/><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="11" x2="12" y2="16"/><line x1="9.5" y1="13.5" x2="14.5" y2="13.5"/>
              </svg>
            </div>
            <h3 className="feature-title">{t('f2_title_1')}<br />{t('f2_title_2')}</h3>
            <p className="feature-text">{t('f2_desc')}</p>
          </div>
          <div className="feature-item reveal reveal-delay-2">
            <span className="feature-num">03</span>
            <div className="feature-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="#A07840" strokeWidth="1.2" strokeLinecap="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
              </svg>
            </div>
            <h3 className="feature-title">{t('f3_title_1')}<br />{t('f3_title_2')}</h3>
            <p className="feature-text">{t('f3_desc')}</p>
          </div>
          <div className="feature-item reveal reveal-delay-3">
            <span className="feature-num">04</span>
            <div className="feature-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="#A07840" strokeWidth="1.2" strokeLinecap="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <h3 className="feature-title">{t('f4_title_1')}<br />{t('f4_title_2')}</h3>
            <p className="feature-text">{t('f4_desc')}</p>
          </div>
        </div>
      </section>

      {/* ══ GALLERY ══ */}
      <section className="gallery" id="gallery">
        <div className="section-header reveal">
          <div>
            <div className="section-label">{t('gal_label')}</div>
            <h2 className="section-title">{t('gal_title_1')}<br />{t('gal_title_2')}<br />{t('gal_title_3')}</h2>
          </div>
          <a href="#" className="view-all">{t('gal_view_all')}</a>
        </div>
        <div className="gallery-grid">
          <div className="gal reveal"><img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80&auto=format&fit=crop" alt="Luxury Home 1" loading="lazy" /><div className="gal-overlay"></div><span className="gal-title">{t('g_t1')}</span></div>
          <div className="gal reveal reveal-delay-1"><img src="https://images.unsplash.com/photo-1503174971373-b1f69850bded?w=600&q=80&auto=format&fit=crop" alt="Premium Apartment" loading="lazy" /><div className="gal-overlay"></div><span className="gal-title">{t('g_t2')}</span></div>
          <div className="gal reveal reveal-delay-2"><img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80&auto=format&fit=crop" alt="Waterfront Estate" loading="lazy" /><div className="gal-overlay"></div><span className="gal-title">{t('g_t3')}</span></div>
          <div className="gal reveal reveal-delay-3"><img src="https://images.unsplash.com/photo-1565372195458-9de0b320ef04?w=600&q=80&auto=format&fit=crop" alt="Investment Property" loading="lazy" /><div className="gal-overlay"></div><span className="gal-title">{t('g_t4')}</span></div>
          <div className="gal reveal"><img src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80&auto=format&fit=crop" alt="Development Land" loading="lazy" /><div className="gal-overlay"></div><span className="gal-title">{t('g_t5')}</span></div>
          <div className="gal reveal reveal-delay-1"><img src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&q=80&auto=format&fit=crop" alt="Commercial Asset" loading="lazy" /><div className="gal-overlay"></div><span className="gal-title">{t('g_t6')}</span></div>
          <div className="gal reveal reveal-delay-2"><img src="https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=600&q=80&auto=format&fit=crop" alt="Prime Land Parcel" loading="lazy" /><div className="gal-overlay"></div><span className="gal-title">{t('g_t7')}</span></div>
          <div className="gal reveal reveal-delay-3"><img src="https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80&auto=format&fit=crop" alt="Penthouse" loading="lazy" /><div className="gal-overlay"></div><span className="gal-title">{t('g_t8')}</span></div>
        </div>
      </section>

      {/* ══ ABOUT ══ */}
      <section className="about" id="about">
        <div className="about-inner">
          <div>
            <div className="about-label reveal">{t('about_label')}</div>
            <h2 className="about-title reveal">{t('about_title_1')}<br />{t('about_title_2')}<br />{t('about_title_3')}</h2>
            <p className="about-text reveal">{t('about_desc_1')}<br /><br />{t('about_desc_2')}</p>
            <a href="#" className="btn-outline-light reveal">{t('about_btn_more')}</a>
          </div>
          <div className="about-stats reveal">
            <div className="stat-box">
              <span className="stat-num">{t('as1_num')}<span className="stat-unit">{t('as1_unit')}</span></span>
              <span className="stat-label">{t('as1_label')}</span>
            </div>
            <div className="stat-box">
              <span className="stat-num">{t('as2_num')}<span className="stat-unit">{t('as2_unit')}</span></span>
              <span className="stat-label">{t('as2_label')}</span>
            </div>
            <div className="stat-box">
              <span className="stat-num">{t('as3_num')}<span className="stat-unit">{t('as3_unit')}</span></span>
              <span className="stat-label">{t('as3_label')}</span>
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
              <a href="#" className="btn-sm">{t('p1_btn')}</a>
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
              <a href="#" className="btn-sm">{t('p2_btn')}</a>
            </div>
            <div className="product-img-wrap">
              <img src="https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&q=80&auto=format&fit=crop&crop=right" alt="Premium Apartment" loading="lazy" />
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
          <div className="step reveal">
            <div className="step-num-wrap"><span className="step-num">01</span></div>
            <h4 className="step-title">{t('step1_title')}</h4>
            <p className="step-text">{t('step1_desc')}</p>
          </div>
          <div className="step reveal reveal-delay-1">
            <div className="step-num-wrap"><span className="step-num">02</span></div>
            <h4 className="step-title">{t('step2_title')}</h4>
            <p className="step-text">{t('step2_desc')}</p>
          </div>
          <div className="step reveal reveal-delay-2">
            <div className="step-num-wrap"><span className="step-num">03</span></div>
            <h4 className="step-title">{t('step3_title')}</h4>
            <p className="step-text">{t('step3_desc')}</p>
          </div>
          <div className="step reveal reveal-delay-3">
            <div className="step-num-wrap"><span className="step-num">04</span></div>
            <h4 className="step-title">{t('step4_title')}</h4>
            <p className="step-text">{t('step4_desc')}</p>
          </div>
          <div className="step reveal reveal-delay-4">
            <div className="step-num-wrap"><span className="step-num">05</span></div>
            <h4 className="step-title">{t('step5_title')}</h4>
            <p className="step-text">{t('step5_desc')}</p>
          </div>
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
          <div className="testi-card reveal">
            <span className="testi-quote">"</span>
            <p className="testi-text">{t('t1_text')}</p>
            <div className="testi-author">
              <div className="testi-avatar"><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=70&auto=format&fit=crop&crop=face" alt="" loading="lazy" /></div>
              <div><div className="testi-name">{t('t1_author')}</div><div className="testi-role">{t('t1_role')}</div></div>
              <div className="testi-stars">★★★★★</div>
            </div>
          </div>
          <div className="testi-card reveal reveal-delay-1">
            <span className="testi-quote">"</span>
            <p className="testi-text">{t('t2_text')}</p>
            <div className="testi-author">
              <div className="testi-avatar"><img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&q=70&auto=format&fit=crop&crop=face" alt="" loading="lazy" /></div>
              <div><div className="testi-name">{t('t2_author')}</div><div className="testi-role">{t('t2_role')}</div></div>
              <div className="testi-stars">★★★★★</div>
            </div>
          </div>
          <div className="testi-card reveal reveal-delay-2">
            <span className="testi-quote">"</span>
            <p className="testi-text">{t('t3_text')}</p>
            <div className="testi-author">
              <div className="testi-avatar"><img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=70&auto=format&fit=crop&crop=face" alt="" loading="lazy" /></div>
              <div><div className="testi-name">{t('t3_author')}</div><div className="testi-role">{t('t3_role')}</div></div>
              <div className="testi-stars">★★★★★</div>
            </div>
          </div>
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
              <li><a href="#">{t('footer_link1')}</a></li>
              <li><a href="#">{t('footer_link2')}</a></li>
              <li><a href="#">{t('footer_link3')}</a></li>
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