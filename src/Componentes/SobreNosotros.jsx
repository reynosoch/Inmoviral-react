import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import imgJavier from '../assets/equipo/javier-reynoso.png';
import imgLuisa from '../assets/equipo/luisa-leyva.png';
import imgAngel from '../assets/equipo/angel-contreras.jpeg';
import imgJamin from '../assets/equipo/jamin-alvarez.png';
import imgCarlos from '../assets/equipo/carlos-garcia.png';

export default function SobreNosotros({ onIrServicios, onIrPropiedades }) {
  const { i18n } = useTranslation();
  const es = i18n.language.startsWith('es');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });

    setTimeout(() => {
      document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    }, 100);

    return () => obs.disconnect();
  }, []);

  return (
    <main style={{ background: '#0A0A0A', color: '#F5F5F0', paddingTop: '80px', minHeight: '100vh' }}>
      {/* ─── HERO ─── */}
      <section className="hero" style={{ minHeight: 'calc(100vh - 80px)', display: 'grid', gridTemplateColumns: window.innerWidth > 1024 ? '1fr 1fr' : '1fr' }}>
        <div className="hero-content" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem 3.5rem' }}>
          <div className="eyebrow" style={{ fontSize: '0.63rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#A07840', fontWeight: 500, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {es ? 'Sobre Nosotros' : 'About Us'}
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.5rem, 4.5vw, 5rem)', fontWeight: 300, lineHeight: 1.05, marginBottom: '2rem' }}>
            {es ? (
              <>Más de una<br />década definiendo<br />el <em>lujo inmobiliario</em></>
            ) : (
              <>Over a decade<br />defining <em>luxury real estate</em></>
            )}
          </h1>
          {/* 🌟 CORREGIDO: Se cambió 'margin-bottom' por 'marginBottom' */}
          <p className="hero-text" style={{ fontSize: '0.82rem', lineHeight: 2, color: '#8A8A84', fontWeight: 300, maxWidth: '480px', marginBottom: '3rem' }}>
            {es 
              ? 'INMOVIRAL nació de una convicción: que las propiedades excepcionales merecen una representation excepcional. Hoy somos la firma de referencia para quienes buscan — o venden — lo mejor del mercado premium.'
              : 'INMOVIRAL was born out of a conviction: that exceptional properties deserve exceptional representation. Today we are the firm of choice for those seeking — or selling — the finest in the premium market.'}
          </p>
          <div className="hero-stats" style={{ display: 'flex', gap: '3rem', paddingTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div>
              <div className="stat-val" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.8rem', color: '#F5F5F0', lineHeight: 1 }}>12<span style={{ color: '#A07840' }}>+</span></div>
              <div className="stat-label" style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8A8A84' }}>{es ? 'Años de trayectoria' : 'Years of Experience'}</div>
            </div>
            <div>
              <div className="stat-val" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.8rem', color: '#F5F5F0', lineHeight: 1 }}>150<span style={{ color: '#A07840' }}>+</span></div>
              <div className="stat-label" style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8A8A84' }}>{es ? 'Propiedades vendidas' : 'Properties Sold'}</div>
            </div>
            <div>
              <div className="stat-val" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.8rem', color: '#F5F5F0', lineHeight: 1 }}>98<span style={{ color: '#A07840' }}>%</span></div>
              <div className="stat-label" style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8A8A84' }}>{es ? 'Clientes satisfechos' : 'Satisfied Clients'}</div>
            </div>
          </div>
        </div>
        <div className="hero-image" style={{ position: 'relative', minHeight: '400px' }}>
          <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?crop=entropy&cs=srgb&fm=jpg&q=85" alt="Luxury property" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.65)' }} />
          <div className="hero-image-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #0A0A0A 0%, transparent 40%)' }}></div>
          <div className="hero-image-tag" style={{ position: 'absolute', bottom: '3rem', right: '3rem', border: '1px solid rgba(160,120,64,0.4)', padding: '1.2rem 1.6rem', background: 'rgba(10,10,10,0.6)', backdropFilter: 'blur(8px)', textAlign: 'right' }}>
            <div className="tag-title" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', color: '#F5F5F0' }}>{es ? 'Residencia Sierra Alta' : 'Sierra Alta Residence'}</div>
            <div className="tag-sub" style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#A07840' }}>Portfolio Exclusivo 2026</div>
          </div>
        </div>
      </section>

      {/* ─── EQUIPO ─── */}
      <section className="section" style={{ padding: '7rem 3.5rem' }}>
        <div className="section-inner" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="equipo-intro reveal" style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 1024 ? '1fr 1fr' : '1fr', gap: '4rem', marginBottom: '5rem' }}>
            <div>
              <div className="section-label" style={{ color: '#A07840', fontSize: '0.62rem', letterSpacing: '0.3em' }}>{es ? 'El Equipo' : 'The Team'}</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', fontWeight: 300 }}>{es ? <>Personas que<br />hacen la <em>diferencia</em></> : <>People Who<br />Make the <em>Difference</em></>}</h2>
            </div>
            <p style={{ fontSize: '0.82rem', lineHeight: 2, color: '#8A8A84', paddingTop: '0.5rem' }}>
              {es 
                ? 'Somos un equipo multidisciplinario con experiencia legal, financiera y de diseño de interiores. Cada asesor gestiona un número limitado de propiedades para garantizar atención plena y exclusiva.'
                : 'We are a multidisciplinary team with legal, financial, and interior design expertise. Each advisor manages a limited number of clients to guarantee focused and exclusive attention.'}
            </p>
          </div>
          <div className="team-grid" style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 1024 ? 'repeat(5, 1fr)' : window.innerWidth > 640 ? 'repeat(3, 1fr)' : '1fr', gap: '2rem' }}>
            {[
              { name: 'Javier Reynoso', role: es ? 'Líder · INMOVIRAL' : 'Lead · INMOVIRAL', img: imgJavier },
              { name: 'Luisa Leyva', role: es ? 'Diseñadora de Interfaz / UX' : 'UI / UX Designer', img: imgLuisa },
              { name: 'Angel Contreras', role: es ? 'Co-Líder / Desarrollo' : 'Co-Lead / Development', img: imgAngel },
              { name: 'Jamin Álvarez', role: es ? 'Arquitectura de Datos' : 'Data Architecture', img: imgJamin },
              { name: 'Carlos García', role: es ? 'Recursos humanos' : 'Human Resources', img: imgCarlos }
            ].map((m, i) => (
              <div key={i} className="team-card reveal">
                <div className="team-photo" style={{ overflow: 'hidden', marginBottom: '1.2rem' }}>
                  <img src={m.img} alt={m.name} style={{ width: '100%', height: '300px', objectFit: 'cover', objectPosition: 'top', filter: 'brightness(0.7) grayscale(20%)', display: 'block' }} />
                </div>
                <div className="team-name" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem' }}>{m.name}</div>
                <div className="team-role" style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#A07840', fontWeight: 500 }}>{m.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── VALORES ─── */}
      <section className="section valores" style={{ padding: '7rem 3.5rem', background: '#111110' }}>
        <div className="section-inner" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="reveal">
            <div className="section-label" style={{ color: '#A07840', letterSpacing: '0.3em', textTransform: 'uppercase', fontSize: '0.62rem' }}>{es ? 'Lo que nos guía' : 'Our Core values'}</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.8rem', fontWeight: 300 }}>{es ? <>Nuestros <em>valores</em></> : <>Our <em>Values</em></>}</h2>
          </div>
          <div className="valores-grid" style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 1024 ? 'repeat(3, 1fr)' : '1fr', marginTop: '4rem', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="valor reveal" style={{ padding: '3rem 2.5rem', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="valor-title" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', marginBottom: '1rem' }}>{es ? 'Discreción absoluta' : 'Absolute Discretion'}</div>
              <p style={{ fontSize: '0.72rem', lineHeight: 1.9, color: '#8A8A84' }}>{es ? 'Cada transacción es tratada con la más estricta confidencialidad. La privacidad de nuestros clientes es un principio innegociable.' : 'Every transaction is treated with the strictest confidentiality. Our clients privacy is a non-negotiable principle.'}</p>
            </div>
            <div className="valor reveal" style={{ padding: '3rem 2.5rem', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="valor-title" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', marginBottom: '1rem' }}>{es ? 'Tiempo como activo' : 'Time as an Asset'}</div>
              <p style={{ fontSize: '0.72rem', lineHeight: 1.9, color: '#8A8A84' }}>{es ? 'Entendemos que tu tiempo es el recurso más escaso. Gestionamos cada proceso con precisión para minimizar fricciones.' : 'We understand that your time is the scarcest resource. We manage every process with absolute precision.'}</p>
            </div>
            <div className="valor reveal" style={{ padding: '3rem 2.5rem' }}>
              <div className="valor-title" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', marginBottom: '1rem' }}>{es ? 'Resultados medibles' : 'Measurable Results'}</div>
              <p style={{ fontSize: '0.72rem', lineHeight: 1.9, color: '#8A8A84' }}>{es ? 'No prometemos lo que no podemos demostrar. Cada estrategia está respaldada por datos y un historial verificable.' : 'We do not promise what we cannot prove. Every strategy is backed by data and a verifiable track record.'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HISTORIA ─── */}
      <section className="section" style={{ padding: '7rem 3.5rem' }}>
        <div className="section-inner" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="historia-grid">
            <div className="historia-img reveal">
              <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?crop=entropy&cs=srgb&fm=jpg&q=85" alt="Oficinas INMOVIRAL" style={{ width: '100%', height: '520px', objectFit: 'cover', filter: 'brightness(0.75)' }} />
            </div>
            <div className="historia-body reveal" style={{ paddingLeft: window.innerWidth > 1024 ? '3rem' : '0' }}>
              <div className="section-label" style={{ fontSize: '0.62rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#A07840', fontWeight: 500, marginBottom: '1rem' }}>{es ? 'Nuestra Historia' : 'Our Story'}</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 300, marginBottom: '2rem' }}>
                {es ? <>Fundados sobre la<br /><em>confianza y la visión</em></> : <>Founded on<br /><em>trust and vision</em></>}
              </h2>
              {es ? (
                <>
                  <p style={{ fontSize: '0.82rem', lineHeight: 2, color: '#8A8A84', marginBottom: '1.5rem' }}>Fundamos INMOVIRAL con una premisa simple: <strong>el cliente siempre merece más de lo que espera.</strong> Comenzamos con un pequeño equipo de asesores apasionados por la arquitectura y el mercado de alto segmento, creciendo guiados por resultados.</p>
                  <p style={{ fontSize: '0.82rem', lineHeight: 2, color: '#8A8A84', marginBottom: '1.5rem' }}>A lo largo de los años hemos construido una red de compradores calificados, vendedores exigentes e inversionistas estratégicos que confían en nuestro criterio profesional para transformar sus patrimonios.</p>
                </>
              ) : (
                <>
                  <p style={{ fontSize: '0.82rem', lineHeight: 2, color: '#8A8A84', marginBottom: '1.5rem' }}>We founded INMOVIRAL with a simple premise: <strong>the client always deserves more than they expect.</strong> We started with a small team of consultants passionate about premium architecture, growing through results.</p>
                  <p style={{ fontSize: '0.82rem', lineHeight: 2, color: '#8A8A84', marginBottom: '1.5rem' }}>Over the years we have built an elite network of qualified buyers, discerning sellers, and strategic investors who trust our judgment to build and transform their wealth.</p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── RECONOCIMIENTOS ─── */}
      <section className="section premios" style={{ padding: '7rem 3.5rem', background: '#111110', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="section-inner" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center' }}>
            <div className="section-label" style={{ color: '#A07840', fontSize: '0.62rem', letterSpacing: '0.3em' }}>{es ? 'Reconocimientos' : 'Awards'}</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', fontWeight: 300 }}>{es ? <>Avalados por la <em>industria</em></> : <>Backed by the <em>Industry</em></>}</h2>
          </div>
          <div className="premios-grid reveal" style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 768 ? 'repeat(4, 1fr)' : '1fr', marginTop: '4rem', border: '1px solid rgba(255,255,255,0.08)' }}>
            {[
              { y: '2023', n: es ? 'Mejor Agencia Inmobiliaria de Lujo' : 'Best Luxury Real Estate Agency', o: 'Forbes Real Estate Awards' },
              { y: '2022', n: es ? 'Top 10 Agencias Premium de México' : 'Top 10 Premium Agencies in Mexico', o: 'Expansión Inmobiliaria' },
              { y: '2021', n: es ? 'Excelencia en Servicio al Cliente' : 'Customer Service Excellence', o: 'National Luxury Real Estate' },
              { y: '2019', n: es ? 'Innovación en Marketing Inmobiliario' : 'Real Estate Marketing Innovation', o: 'Inmolatam Summit' }
            ].map((p, i) => (
              <div key={i} className="premio" style={{ padding: '2.5rem 2rem', textAlign: 'center', borderRight: i < 3 && window.innerWidth > 768 ? '1px solid rgba(255,255,255,0.08)' : 'none', borderBottom: window.innerWidth <= 768 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                <div className="premio-year" style={{ fontSize: '0.6rem', letterSpacing: '0.25em', color: '#A07840', marginBottom: '0.8rem' }}>{p.y}</div>
                <div className="premio-name" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', color: '#F5F5F0', marginBottom: '0.5rem' }}>{p.n}</div>
                <div className="premio-org" style={{ fontSize: '0.65rem', color: '#8A8A84' }}>{p.o}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section className="cta-section" style={{ padding: '8rem 3.5rem', textAlign: 'center', position: 'relative' }}>
        <div className="eyebrow reveal" style={{ justifyContent: 'center' }}>{es ? 'Trabajemos Juntos' : 'Let’s Work Together'}</div>
        <h2 className="reveal" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.8rem', fontWeight: 300, marginBottom: '1.5rem' }}>
          {es ? <>¿Listo para una experiencia<br /><em>verdaderamente diferente?</em></> : <>Ready for a<br /><em>truly unique experience?</em></>}
        </h2>
        <div className="cta-btns reveal" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2.5rem' }}>
          <button onClick={onIrPropiedades} className="btn-gold" style={{ height: '48px', padding: '0 2rem', background: '#A07840', color: '#000', border: 'none', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 500, cursor: 'pointer' }}>
            {es ? 'Explorar Propiedades' : 'Browse Properties'}
          </button>
          <button onClick={onIrServicios} className="btn-outline" style={{ height: '48px', padding: '0 2rem', background: 'transparent', color: '#F5F5F0', border: '1px solid rgba(255,255,255,0.25)', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer' }}>
            {es ? 'Nuestros Servicios' : 'Our Services'}
          </button>
        </div>
      </section>
    </main>
  );
}