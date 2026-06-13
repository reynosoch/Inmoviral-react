import React, { useEffect, useState } from 'react';
import './ServiciosVirales.css';

const SERVICIOS = [
  {
    id: 1,
    num: '01',
    tag: 'Logística',
    titulo: 'Ayuda con la',
    tituloEm: 'Mudanza',
    desc: 'Coordinamos cada detalle de tu traslado con empresas certificadas. Desde el embalaje profesional hasta la instalación en tu nuevo hogar — sin estrés, sin imprevistos.',
    features: ['Embalaje profesional', 'Transporte asegurado', 'Coordinación total', 'Seguro de bienes'],
    imagen: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=900&q=80&auto=format&fit=crop',
    cta: 'Solicitar Servicio',
  },
  {
    id: 2,
    num: '02',
    tag: 'Marketing Digital',
    titulo: 'Exposición en',
    tituloEm: 'Redes Sociales',
    desc: 'Posicionamos tu propiedad frente a miles de compradores e inversionistas activos. Campañas segmentadas en Instagram, Facebook y TikTok con resultados medibles.',
    features: ['Campañas pagadas', 'Contenido editorial', 'Audiencias segmentadas', 'Reportes semanales'],
    imagen: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=900&q=80&auto=format&fit=crop',
    cta: 'Solicitar Servicio',
  },
  {
    id: 3,
    num: '03',
    tag: 'Visual Premium',
    titulo: 'Fotografía',
    tituloEm: 'Profesional',
    desc: 'Capturamos la esencia y el valor de cada propiedad con equipo de alto rendimiento. Imágenes editoriales, video cinematic y tour virtual 360° que elevan tu listado.',
    features: ['Fotografía editorial', 'Video cinematic 4K', 'Tour virtual 360°', 'Edición premium'],
    imagen: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80&auto=format&fit=crop',
    cta: 'Solicitar Servicio',
  },
  {
    id: 4,
    num: '04',
    tag: 'Consultoría',
    titulo: 'Asesoramiento',
    tituloEm: 'Agente INMOVIRAL',
    desc: 'Un experto dedicado a tu operación de principio a fin. Negociación estratégica, análisis de mercado y acompañamiento legal para que tomes decisiones con certeza.',
    features: ['Agente dedicado', 'Análisis de mercado', 'Negociación experta', 'Soporte legal'],
    imagen: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&q=80&auto=format&fit=crop',
    cta: 'Agendar Consulta',
  },
];

const PLANES = [
  {
    label: 'Esencial',
    titulo: 'Consulta & Cierre',
    precio: 'Comisión estándar de mercado',
    features: ['Asesoría en búsqueda o venta', '1 asesor asignado', 'Gestión notarial básica', 'Soporte por 6 meses post-cierre', 'Acceso a portafolio activo'],
    featured: false,
    cta: 'Comenzar',
  },
  {
    label: 'Premium',
    titulo: 'Servicio Integral',
    precio: 'Comisión preferencial + acceso exclusivo',
    features: ['Todo lo del plan Esencial', 'Asesor senior dedicado', 'Acceso a propiedades off-market', 'Estrategia de negociación avanzada', 'Due diligence legal completo', 'Soporte 5 años post-cierre', 'Reportes de mercado mensuales'],
    featured: true,
    cta: 'Solicitar acceso',
  },
  {
    label: 'Corporativo',
    titulo: 'Portafolio & Inversión',
    precio: 'Estructura a medida — cotizar',
    features: ['Todo lo del plan Premium', 'Análisis de portafolio inmobiliario', 'Vehículos de inversión estructurados', 'Gestión de activos en renta', 'Reportes trimestrales de rendimiento', 'Acceso a red de inversionistas'],
    featured: false,
    cta: 'Contactar equipo',
  },
];

const GARANTIAS = [
  {
    titulo: '5 años de soporte post-venta',
    desc: 'Una vez cerrada la operación, seguimos siendo tu punto de contacto para cualquier consulta legal, técnica o de mantenimiento relacionada con la propiedad.',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  },
  {
    titulo: 'Asesor dedicado exclusivo',
    desc: 'Cada cliente cuenta con un asesor principal que gestiona toda la operación, más un equipo de respaldo. Nunca serás redirigido a un desconocido.',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  },
  {
    titulo: 'Comisión alineada a resultados',
    desc: 'Nuestros honorarios están estructurados para que nuestros intereses sean exactamente los mismos que los tuyos: el mejor precio, en el menor tiempo.',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  },
  {
    titulo: 'Respuesta en menos de 2 horas',
    desc: 'Nos comprometemos a responder cualquier consulta en un plazo máximo de 2 horas durante días hábiles, y a coordinar urgencias fuera de horario.',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  },
];

const TESTIMONIOS = [
  { texto: '"En tres meses encontramos la propiedad que llevábamos dos años buscando. La atención fue impecable de principio a fin."', nombre: 'Miguel & Laura Fernández', rol: 'Compradores — Residencia Diamante' },
  { texto: '"Vendieron mi penthouse en 47 días al precio que yo pedía. La estrategia de marketing fue completamente diferente a lo que había visto antes."', nombre: 'Rodrigo Salinas', rol: 'Vendedor — Penthouse Sierra Alta' },
  { texto: '"Mi portafolio creció un 34% en valor en 18 meses. Lo que más valoro es que siempre actúan con mis intereses primero."', nombre: 'Grupo Varela Capital', rol: 'Inversionista Institucional' },
];

export default function ServiciosVirales({ onIrLogin }) {
  const [activo, setActivo] = useState(null);
  const [tabActiva, setTabActiva] = useState('compra');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    setTimeout(() => {
      document.querySelectorAll('.sv-reveal, .sv-reveal-left').forEach(el => obs.observe(el));
    }, 80);
    return () => obs.disconnect();
  }, []);

  const scrollASeccion = (id) => {
    setTabActiva(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="sv-page">

      {/* ══ HERO ══ */}
      <section className="sv-hero">
        <div className="sv-hero-bg" />
        <div className="sv-hero-content">
          <div className="sv-eyebrow">Lo que ofrecemos</div>
          <h1>Servicios diseñados<br />para <em>resultados</em><br />extraordinarios</h1>
          <p className="sv-hero-sub">
            Cada servicio que ofrecemos ha sido concebido para acompañar a compradores, vendedores e inversionistas desde la primera consulta hasta mucho después del cierre.
          </p>
        </div>
      </section>

      {/* ══ TABS BAR ══ */}
      <div className="sv-tabs-bar">
        {[
          { id: 'compra',      label: 'Para Compradores' },
          { id: 'venta',       label: 'Para Vendedores' },
          { id: 'inversion',   label: 'Para Inversionistas' },
          { id: 'adicionales', label: 'Servicios Adicionales' },
        ].map(tab => (
          <button
            key={tab.id}
            className={`sv-tab-btn${tabActiva === tab.id ? ' active' : ''}`}
            onClick={() => scrollASeccion(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ══ SERVICIOS PRINCIPALES ══ */}
      <section className="sv-section" id="compra">
        <div className="sv-section-inner">
          <div className="sv-reveal">
            <div className="sv-section-label">Portafolio de Servicios</div>
            <h2>Todo lo que necesitas<br />en un solo <em>lugar</em></h2>
          </div>
          <div className="sv-services-grid">

            {/* SERVICIO 01 — MUDANZA */}
            <div className="sv-service-card sv-reveal">
              <div className="sv-service-num">01</div>
              <div className="sv-service-title">Ayuda con la<br />Mudanza</div>
              <p className="sv-service-desc">Coordinamos cada detalle de tu traslado con empresas certificadas. Desde el embalaje profesional hasta la instalación en tu nuevo hogar — sin estrés, sin imprevistos.</p>
              <ul className="sv-service-list">
                <li>Embalaje profesional</li>
                <li>Transporte asegurado</li>
                <li>Coordinación total del traslado</li>
                <li>Seguro de bienes incluido</li>
                <li>Instalación en destino</li>
              </ul>
              <button className="sv-service-link" onClick={() => setActivo(activo === 1 ? null : 1)}>
                Solicitar Servicio
              </button>
              <div className={`sv-contact-panel${activo === 1 ? ' sv-contact-panel--open' : ''}`}>
                <p className="sv-contact-label">Un asesor se pondrá en contacto a la brevedad.</p>
                <div className="sv-contact-row">
                  <a href="tel:+526141234567" className="sv-contact-btn">📞 Llamar Ahora</a>
                  <a href="https://wa.me/526141234567" target="_blank" rel="noreferrer" className="sv-contact-btn sv-contact-btn--wa">💬 WhatsApp</a>
                </div>
              </div>
            </div>

            {/* SERVICIO 02 — REDES SOCIALES */}
            <div className="sv-service-card sv-reveal" id="venta">
              <div className="sv-service-num">02</div>
              <div className="sv-service-title">Exposición en<br />Redes Sociales</div>
              <p className="sv-service-desc">Posicionamos tu propiedad frente a miles de compradores e inversionistas activos. Campañas segmentadas en Instagram, Facebook y TikTok con resultados medibles.</p>
              <ul className="sv-service-list">
                <li>Campañas pagadas segmentadas</li>
                <li>Contenido editorial profesional</li>
                <li>Audiencias de alto valor</li>
                <li>Reportes semanales de rendimiento</li>
                <li>Difusión en portales premium</li>
              </ul>
              <button className="sv-service-link" onClick={() => setActivo(activo === 2 ? null : 2)}>
                Solicitar Servicio
              </button>
              <div className={`sv-contact-panel${activo === 2 ? ' sv-contact-panel--open' : ''}`}>
                <p className="sv-contact-label">Un asesor se pondrá en contacto a la brevedad.</p>
                <div className="sv-contact-row">
                  <a href="tel:+526141234567" className="sv-contact-btn">📞 Llamar Ahora</a>
                  <a href="https://wa.me/526141234567" target="_blank" rel="noreferrer" className="sv-contact-btn sv-contact-btn--wa">💬 WhatsApp</a>
                </div>
              </div>
            </div>

            {/* SERVICIO 03 — FOTOGRAFÍA */}
            <div className="sv-service-card sv-reveal" id="inversion">
              <div className="sv-service-num">03</div>
              <div className="sv-service-title">Fotografía<br />Profesional</div>
              <p className="sv-service-desc">Capturamos la esencia y el valor de cada propiedad con equipo de alto rendimiento. Imágenes editoriales, video cinematic y tour virtual 360° que elevan tu listado.</p>
              <ul className="sv-service-list">
                <li>Fotografía editorial de interiores</li>
                <li>Video cinematic 4K con drone</li>
                <li>Tour virtual 360°</li>
                <li>Edición y postproducción premium</li>
                <li>Entrega en 48 horas</li>
              </ul>
              <button className="sv-service-link" onClick={() => setActivo(activo === 3 ? null : 3)}>
                Solicitar Servicio
              </button>
              <div className={`sv-contact-panel${activo === 3 ? ' sv-contact-panel--open' : ''}`}>
                <p className="sv-contact-label">Un asesor se pondrá en contacto a la brevedad.</p>
                <div className="sv-contact-row">
                  <a href="tel:+526141234567" className="sv-contact-btn">📞 Llamar Ahora</a>
                  <a href="https://wa.me/526141234567" target="_blank" rel="noreferrer" className="sv-contact-btn sv-contact-btn--wa">💬 WhatsApp</a>
                </div>
              </div>
            </div>

            {/* SERVICIO 04 — ASESOR INMOVIRAL */}
            <div className="sv-service-card sv-reveal sv-service-card--wide">
              <div className="sv-service-num">04</div>
              <div className="sv-service-title">Asesoramiento<br />Agente INMOVIRAL</div>
              <p className="sv-service-desc">Un experto dedicado a tu operación de principio a fin. Negociación estratégica, análisis de mercado y acompañamiento legal para que tomes decisiones con certeza.</p>
              <ul className="sv-service-list">
                <li>Agente senior dedicado exclusivamente</li>
                <li>Análisis comparativo de mercado</li>
                <li>Negociación experta de precio y condiciones</li>
                <li>Due diligence legal y notarial completo</li>
                <li>Soporte 5 años post-cierre</li>
              </ul>
              <button className="sv-service-link" onClick={() => setActivo(activo === 4 ? null : 4)}>
                Agendar Consulta
              </button>
              <div className={`sv-contact-panel${activo === 4 ? ' sv-contact-panel--open' : ''}`}>
                <p className="sv-contact-label">Un asesor se pondrá en contacto a la brevedad.</p>
                <div className="sv-contact-row">
                  <a href="tel:+526141234567" className="sv-contact-btn">📞 Llamar Ahora</a>
                  <a href="https://wa.me/526141234567" target="_blank" rel="noreferrer" className="sv-contact-btn sv-contact-btn--wa">💬 WhatsApp</a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══ PROCESO ══ */}
      <section className="sv-section sv-proceso">
        <div className="sv-section-inner">
          <div className="sv-reveal" style={{ textAlign: 'center', marginBottom: 0 }}>
            <div className="sv-section-label">Cómo Trabajamos</div>
            <h2>Un proceso <em>probado</em><br />en más de 150 transacciones</h2>
          </div>
          <div className="sv-proceso-steps">
            {[
              { num: 'I',   titulo: 'Consulta Inicial',         desc: 'Una reunión confidencial donde entendemos tu situación, objetivos y horizonte de tiempo. Sin compromisos, sin presiones.' },
              { num: 'II',  titulo: 'Estrategia a Medida',      desc: 'Diseñamos un plan de acción personalizado: propiedades a visitar, opciones de financiamiento o estrategia de posicionamiento.' },
              { num: 'III', titulo: 'Ejecución y Negociación',  desc: 'Gestionamos cada detalle operativo y representamos tus intereses con la firmeza y discreción que el mercado premium exige.' },
              { num: 'IV',  titulo: 'Cierre y Seguimiento',     desc: 'Coordinamos la firma notarial, entrega de llaves y permanecemos disponibles durante los 5 años siguientes a la operación.' },
            ].map(paso => (
              <div key={paso.num} className="sv-paso sv-reveal">
                <div className="sv-paso-num">{paso.num}</div>
                <div className="sv-paso-title">{paso.titulo}</div>
                <p className="sv-paso-desc">{paso.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ GARANTÍAS ══ */}
      <section className="sv-section" id="adicionales">
        <div className="sv-section-inner">
          <div className="sv-garantias-grid">
            <div className="sv-garantias-img sv-reveal-left">
              <img src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?crop=entropy&cs=srgb&fm=jpg&q=85" alt="Propiedad de lujo" />
              <div className="sv-garantias-img-label">
                <span>"Cada operación cierra con nuestra firma de calidad."</span>
              </div>
            </div>
            <div className="sv-reveal">
              <div className="sv-section-label">Nuestro Compromiso</div>
              <h2>Garantías que<br />nos <em>distinguen</em></h2>
              <div className="sv-garantias-list">
                {GARANTIAS.map(g => (
                  <div key={g.titulo} className="sv-garantia">
                    <div className="sv-garantia-icon">{g.svg}</div>
                    <div>
                      <div className="sv-garantia-title">{g.titulo}</div>
                      <p className="sv-garantia-desc">{g.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ PLANES ══ */}
      <section className="sv-section sv-planes-section">
        <div className="sv-section-inner">
          <div className="sv-reveal" style={{ textAlign: 'center' }}>
            <div className="sv-section-label">Planes de Servicio</div>
            <h2>Elige el acompañamiento<br />que <em>necesitas</em></h2>
          </div>
          <div className="sv-planes-grid">
            {PLANES.map(p => (
              <div key={p.label} className={`sv-plan sv-reveal${p.featured ? ' sv-plan--featured' : ''}`}>
                <div className="sv-plan-label">{p.label}</div>
                <div className="sv-plan-titulo">{p.titulo}</div>
                <div className="sv-plan-precio">{p.precio}</div>
                <ul className="sv-plan-features">
                  {p.features.map(f => <li key={f}>{f}</li>)}
                </ul>
                <button className="sv-plan-cta" onClick={onIrLogin}>{p.cta}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIOS ══ */}
      <section className="sv-section sv-testimonios">
        <div className="sv-section-inner">
          <div className="sv-reveal" style={{ textAlign: 'center' }}>
            <div className="sv-section-label">Lo que dicen nuestros clientes</div>
            <h2>La experiencia<br /><em>INMOVIRAL</em></h2>
          </div>
          <div className="sv-test-grid">
            {TESTIMONIOS.map(t => (
              <div key={t.nombre} className="sv-testimonio sv-reveal">
                <p className="sv-test-text">{t.texto}</p>
                <div className="sv-test-divider" />
                <div className="sv-test-name">{t.nombre}</div>
                <div className="sv-test-role">{t.rol}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA FINAL ══ */}
      <section className="sv-cta-section">
        <div className="sv-cta-eyebrow sv-reveal">Da el Primer Paso</div>
        <div className="sv-cta-h2 sv-reveal">¿Con cuál de nuestros<br />servicios podemos <em>ayudarte?</em></div>
        <p className="sv-cta-sub sv-reveal">Una consulta inicial es gratuita, confidencial y sin compromisos. Cuéntanos tu situación y diseñamos la mejor estrategia para ti.</p>
        <div className="sv-cta-btns sv-reveal">
          <button className="sv-btn-gold" onClick={onIrLogin}>Iniciar Sesión</button>
        </div>
      </section>

    </div>
  );
}
