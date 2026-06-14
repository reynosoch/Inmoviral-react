import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import './Vendedor.css';

// ── Nominatim autocomplete hook ───────────────────────────────────────────────
function useNominatim() {
  const [query, setQuery]       = useState('');
  const [results, setResults]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [open, setOpen]         = useState(false);
  const timer = useRef(null);

  const search = useCallback((q) => {
    setQuery(q);
    setOpen(true);
    clearTimeout(timer.current);
    if (q.length < 3) { setResults([]); return; }
    timer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(q)}`,
          { headers: { 'Accept-Language': 'es', 'User-Agent': 'InmoViral/1.0' } }
        );
        const data = await res.json();
        setResults(data);
      } catch { setResults([]); }
      finally { setLoading(false); }
    }, 420);
  }, []);

  const clear = () => { setQuery(''); setResults([]); setOpen(false); };

  return { query, results, loading, open, search, setOpen, clear };
}

// ── Counter (Recámaras / Baños / Estacionamientos) ────────────────────────────
function Counter({ label, value, onChange, min = 0, max = 10 }) {
  return (
    <div className="vd-field">
      <label>{label}</label>
      <div className="vw-counter">
        <button type="button" className="vw-counter-btn" onClick={() => onChange(Math.max(min, value - 1))}>−</button>
        <span className="vw-counter-val">{value}</span>
        <button type="button" className="vw-counter-btn" onClick={() => onChange(Math.min(max, value + 1))}>+</button>
      </div>
    </div>
  );
}

// ── Iconos de servicios virales ───────────────────────────────────────────────
const IconMudanza = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="7" width="14" height="10" rx="1"/><path d="M15 10h3l3 3v4h-6z"/><circle cx="6" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/>
  </svg>
);
const IconRedes = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="12" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="18" cy="18" r="3"/>
    <line x1="8.6" y1="10.6" x2="15.4" y2="7.4"/><line x1="8.6" y1="13.4" x2="15.4" y2="16.6"/>
  </svg>
);
const IconFoto = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
  </svg>
);
const IconAsesor = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/>
  </svg>
);

const AMENIDADES_KEYS = Array.from({ length: 20 }, (_, i) => `vw_am_${i + 1}`);

const SERVICIOS_VIRALES = [
  { key: 'mudanza',    titleKey: 'vw_srv1_title', descKey: 'vw_srv1_desc', icon: IconMudanza },
  { key: 'redes',      titleKey: 'vw_srv2_title', descKey: 'vw_srv2_desc', icon: IconRedes },
  { key: 'fotografia', titleKey: 'vw_srv3_title', descKey: 'vw_srv3_desc', icon: IconFoto },
  { key: 'asesor',     titleKey: 'vw_srv4_title', descKey: 'vw_srv4_desc', icon: IconAsesor },
];

export default function Vendedor({ onVolver }) {
  const { t } = useTranslation();
  const nom = useNominatim();
  const wrapRef = useRef(null);
  const fileInputRef = useRef(null);

  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    tipo: '', operacion: '',
    busqueda: '',
    calle: '', colonia: '', ciudad: '', estado: '', cp: '', pais: '',
    lat: '', lng: '',
    recamaras: 1, banos: 1, estacionamientos: 0, antiguedad: '',
    titulo: '', precio: '', superficie: '', descripcion: '',
    amenidades: [], servicios: [],
    nombre: '', telefono: '',
  });
  const [fotos, setFotos] = useState([]);
  const [enviado, setEnviado] = useState(false);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);
  useEffect(() => { document.getElementById('publicar')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, [step]);

  // Cierra el dropdown si se hace click fuera
  useEffect(() => {
    const handler = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) nom.setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [nom]);

  // Limpia las URLs de las fotos al desmontar
  useEffect(() => () => fotos.forEach(f => URL.revokeObjectURL(f.url)), [fotos]);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  // Selecciona una sugerencia y rellena los campos
  const pickPlace = (place) => {
    const a = place.address || {};
    const calle    = [a.road, a.house_number].filter(Boolean).join(' ') || '';
    const colonia  = a.suburb || a.neighbourhood || a.quarter || '';
    const ciudad   = a.city || a.town || a.village || a.municipality || '';
    const estado   = a.state || '';
    const cp       = a.postcode || '';
    const pais     = a.country || '';
    const busqueda = place.display_name || '';

    setForm(prev => ({
      ...prev,
      busqueda, calle, colonia, ciudad, estado, cp, pais,
      lat: place.lat || '', lng: place.lon || '',
    }));
    nom.clear();
  };

  // ── Fotos ──
  const handleFotos = (e) => {
    const files = Array.from(e.target.files || []);
    const espacio = 15 - fotos.length;
    const nuevas = files.slice(0, espacio).map(f => ({
      id: `${f.name}-${f.size}-${Math.random().toString(36).slice(2)}`,
      url: URL.createObjectURL(f),
      file: f,
    }));
    setFotos(prev => [...prev, ...nuevas]);
    e.target.value = '';
  };
  const removeFoto = (id) => {
    setFotos(prev => {
      const target = prev.find(f => f.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter(f => f.id !== id);
    });
  };

  // ── Amenidades y servicios (toggle) ──
  const toggleAmenidad = (k) => setForm(prev => ({
    ...prev,
    amenidades: prev.amenidades.includes(k) ? prev.amenidades.filter(a => a !== k) : [...prev.amenidades, k],
  }));
  const toggleServicio = (k) => setForm(prev => ({
    ...prev,
    servicios: prev.servicios.includes(k) ? prev.servicios.filter(s => s !== k) : [...prev.servicios, k],
  }));

  // ── Validación por paso ──
  const canNext = () => {
    if (step === 1) {
      return form.tipo && form.operacion && (form.calle || form.ciudad) && form.antiguedad;
    }
    if (step === 2) {
      return form.titulo.trim() && form.precio.trim() && form.descripcion.trim() && fotos.length >= 3;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step < 4) {
      if (canNext()) setStep(s => s + 1);
      return;
    }
    setEnviado(true);
  };

  const BENEFICIOS = [
    {
      titulo: t('vd_b1_titulo'),
      desc: t('vd_b1_desc'),
      svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>,
    },
    {
      titulo: t('vd_b2_titulo'),
      desc: t('vd_b2_desc'),
      svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    },
    {
      titulo: t('vd_b3_titulo'),
      desc: t('vd_b3_desc'),
      svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    },
    {
      titulo: t('vd_b4_titulo'),
      desc: t('vd_b4_desc'),
      svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    },
  ];

  const PASOS = [
    { num: '01', titulo: t('vd_paso1_titulo'), desc: t('vd_paso1_desc'), activo: true  },
    { num: '02', titulo: t('vd_paso2_titulo'), desc: t('vd_paso2_desc'), activo: false },
    { num: '03', titulo: t('vd_paso3_titulo'), desc: t('vd_paso3_desc'), activo: false },
    { num: '04', titulo: t('vd_paso4_titulo'), desc: t('vd_paso4_desc'), activo: false },
  ];

  const WIZARD_STEPS = [
    { n: 1, label: t('vw_step1_label') },
    { n: 2, label: t('vw_step2_label') },
    { n: 3, label: t('vw_step3_label') },
    { n: 4, label: t('vw_step4_label') },
  ];

  const STEP_SUB = { 1: t('vw_step1_sub'), 2: t('vw_step2_sub'), 3: t('vw_step3_sub'), 4: t('vw_step4_sub') };

  return (
    <div className="vd-page">

      {/* ══ HERO ══ */}
      <div className="vd-hero">

        {/* IZQUIERDA */}
        <div className="vd-hero-left">
          <div className="vd-eyebrow">{t('vd_eyebrow')}</div>
          <h1 className="vd-h1">
            {t('vd_h1_1')}<br />{t('vd_h1_2')} <em>{t('vd_h1_em')}</em><br />{t('vd_h1_3')}
          </h1>
          <p className="vd-hero-sub">{t('vd_hero_sub')}</p>
          <a href="#publicar" className="vd-btn-primary">{t('vd_hero_btn')}</a>
        </div>

        {/* DERECHA — FORMULARIO / WIZARD */}
        <div className="vd-hero-right" id="publicar">
          <div className="vd-form-card">

            {!enviado && (
              <>
                <div className="vd-form-title">{t('vd_form_titulo')}</div>
                <div className="vd-form-subtitle">{STEP_SUB[step]}</div>

                {/* ── PROGRESS BAR ── */}
                <div className="vw-progress">
                  {WIZARD_STEPS.map((s, i) => (
                    <React.Fragment key={s.n}>
                      <div className={`vw-progress-step${step === s.n ? ' active' : ''}${step > s.n ? ' done' : ''}`}>
                        <div className="vw-progress-circle">
                          {step > s.n ? (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><polyline points="20 6 9 17 4 12"/></svg>
                          ) : s.n}
                        </div>
                        <span className="vw-progress-label">{s.label}</span>
                      </div>
                      {i < WIZARD_STEPS.length - 1 && <div className={`vw-progress-line${step > s.n ? ' done' : ''}`} />}
                    </React.Fragment>
                  ))}
                </div>
              </>
            )}

            {enviado ? (
              <div className="vd-success">
                <svg viewBox="0 0 24 24" fill="none" stroke="#A07840" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="40" height="40">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <p>{t('vw_publicado_msg')}</p>
              </div>
            ) : (
              <form className="vd-form-grid" onSubmit={handleSubmit}>

                {/* ═══════ PASO 1 — PRINCIPALES ═══════ */}
                {step === 1 && (
                  <>
                    <div className="vd-field">
                      <label>{t('vd_f_tipo')}</label>
                      <select value={form.tipo} onChange={e => set('tipo', e.target.value)} required>
                        <option value="" disabled>{t('vd_f_seleccionar')}</option>
                        <option value="Casa">{t('vd_f_tipo_1')}</option>
                        <option value="Departamento">{t('vd_f_tipo_2')}</option>
                        <option value="Terreno">{t('vd_f_tipo_3')}</option>
                        <option value="Local Comercial">{t('vd_f_tipo_4')}</option>
                      </select>
                    </div>
                    <div className="vd-field">
                      <label>{t('vd_f_operacion')}</label>
                      <select value={form.operacion} onChange={e => set('operacion', e.target.value)} required>
                        <option value="" disabled>{t('vd_f_seleccionar')}</option>
                        <option value="Venta">{t('vd_f_op_1')}</option>
                        <option value="Renta">{t('vd_f_op_2')}</option>
                        <option value="Ambas">{t('vd_f_op_3')}</option>
                      </select>
                    </div>

                    <div className="vd-field vd-full">
                      <label>{t('vd_f_direccion')}</label>
                      <div className="vd-address-wrap" ref={wrapRef}>
                        <div className="vd-address-search-row">
                          <svg className="vd-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                          <input
                            className="vd-address-input"
                            type="text"
                            placeholder={t('vd_f_buscar_dir', { defaultValue: 'Busca una dirección, colonia o ciudad...' })}
                            value={nom.query || form.busqueda}
                            onChange={e => { set('busqueda', ''); nom.search(e.target.value); }}
                            onFocus={() => nom.query.length >= 3 && nom.setOpen(true)}
                            autoComplete="off"
                          />
                          {nom.loading && <span className="vd-search-spin" />}
                          {(nom.query || form.busqueda) && (
                            <button type="button" className="vd-search-clear" onClick={() => {
                              nom.clear();
                              setForm(prev => ({ ...prev, busqueda:'', calle:'', colonia:'', ciudad:'', estado:'', cp:'', pais:'', lat:'', lng:'' }));
                            }}>✕</button>
                          )}
                        </div>

                        {nom.open && nom.results.length > 0 && (
                          <ul className="vd-suggestions">
                            {nom.results.map((r) => (
                              <li key={r.place_id} className="vd-suggestion-item" onMouseDown={() => pickPlace(r)}>
                                <svg className="vd-sug-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                <div>
                                  <div className="vd-sug-main">{r.name || r.display_name.split(',')[0]}</div>
                                  <div className="vd-sug-sub">{r.display_name}</div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                        {nom.open && !nom.loading && nom.query.length >= 3 && nom.results.length === 0 && (
                          <div className="vd-suggestions vd-no-results">
                            {t('vd_f_no_results', { defaultValue: 'Sin resultados. Intenta con otra búsqueda.' })}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="vd-field vd-full">
                      <label>{t('vd_f_calle', { defaultValue: 'Calle y Número' })}</label>
                      <input type="text" value={form.calle} onChange={e => set('calle', e.target.value)} placeholder="Ej. Av. Insurgentes Sur 1234" />
                    </div>
                    <div className="vd-autofill-row">
                      <div className="vd-field">
                        <label>{t('vd_f_colonia', { defaultValue: 'Colonia / Barrio' })}</label>
                        <input type="text" value={form.colonia} onChange={e => set('colonia', e.target.value)} placeholder="Ej. Del Valle" />
                      </div>
                      <div className="vd-field">
                        <label>{t('vd_f_ciudad', { defaultValue: 'Ciudad' })}</label>
                        <input type="text" value={form.ciudad} onChange={e => set('ciudad', e.target.value)} placeholder="Ej. Ciudad de México" />
                      </div>
                      <div className="vd-field">
                        <label>{t('vd_f_estado', { defaultValue: 'Estado' })}</label>
                        <input type="text" value={form.estado} onChange={e => set('estado', e.target.value)} placeholder="Ej. CDMX" />
                      </div>
                      <div className="vd-field">
                        <label>CP</label>
                        <input type="text" value={form.cp} onChange={e => set('cp', e.target.value)} placeholder="00000" />
                      </div>
                    </div>

                    {/* Recámaras / Baños / Estacionamientos */}
                    <div className="vw-counters-row vd-full">
                      <Counter label={t('vw_recamaras')} value={form.recamaras} onChange={v => set('recamaras', v)} />
                      <Counter label={t('vw_banos')} value={form.banos} onChange={v => set('banos', v)} />
                      <Counter label={t('vw_estacionamientos')} value={form.estacionamientos} onChange={v => set('estacionamientos', v)} min={0} />
                    </div>

                    <div className="vd-field vd-full">
                      <label>{t('vw_antiguedad')}</label>
                      <select value={form.antiguedad} onChange={e => set('antiguedad', e.target.value)} required>
                        <option value="" disabled>{t('vw_antiguedad_ph')}</option>
                        <option value="nueva">{t('vw_antiguedad_opt0')}</option>
                        <option value="lt5">{t('vw_antiguedad_opt1')}</option>
                        <option value="5-10">{t('vw_antiguedad_opt2')}</option>
                        <option value="10-20">{t('vw_antiguedad_opt3')}</option>
                        <option value="gt20">{t('vw_antiguedad_opt4')}</option>
                      </select>
                    </div>
                  </>
                )}

                {/* ═══════ PASO 2 — CREAR PUBLICACIÓN ═══════ */}
                {step === 2 && (
                  <>
                    <div className="vd-field vd-full">
                      <label>{t('vw_titulo')}</label>
                      <input type="text" placeholder={t('vw_titulo_ph')} value={form.titulo} onChange={e => set('titulo', e.target.value)} required />
                    </div>
                    <div className="vd-field">
                      <label>{t('vd_f_precio')}</label>
                      <input type="text" placeholder="$0,000,000" value={form.precio} onChange={e => set('precio', e.target.value)} required />
                    </div>
                    <div className="vd-field">
                      <label>{t('vd_f_superficie')}</label>
                      <input type="text" placeholder="000 m²" value={form.superficie} onChange={e => set('superficie', e.target.value)} />
                    </div>
                    <div className="vd-field vd-full">
                      <label>{t('vd_f_descripcion')}</label>
                      <textarea placeholder={t('vd_f_descripcion_ph')} value={form.descripcion} onChange={e => set('descripcion', e.target.value)} required />
                    </div>

                    {/* FOTOS */}
                    <div className="vd-field vd-full">
                      <label>{t('vw_fotos_label')}</label>
                      <p className="vw-sub-text">{t('vw_fotos_sub')}</p>
                      <div className="vw-fotos-grid">
                        {fotos.map((f, i) => (
                          <div key={f.id} className="vw-foto-item">
                            <img src={f.url} alt="" />
                            {i === 0 && <span className="vw-foto-cover">{t('vw_fotos_portada')}</span>}
                            <button type="button" className="vw-foto-remove" onClick={() => removeFoto(f.id)}>✕</button>
                          </div>
                        ))}
                        {fotos.length < 15 && (
                          <button type="button" className="vw-foto-add" onClick={() => fileInputRef.current?.click()}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            <span>{t('vw_fotos_add')}</span>
                          </button>
                        )}
                      </div>
                      <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={handleFotos} />
                      <div className={`vw-fotos-counter${fotos.length < 3 ? ' warn' : ''}`}>
                        {t('vw_fotos_counter', { count: fotos.length })}
                        {fotos.length < 3 && <span> — {t('vw_fotos_min_warning')}</span>}
                      </div>
                    </div>
                  </>
                )}

                {/* ═══════ PASO 3 — EXTRAS ═══════ */}
                {step === 3 && (
                  <div className="vd-field vd-full">
                    <label>{t('vw_amenidades_label')}</label>
                    <p className="vw-sub-text">{t('vw_amenidades_sub')}</p>
                    <div className="vw-chips-grid">
                      {AMENIDADES_KEYS.map(k => {
                        const active = form.amenidades.includes(k);
                        return (
                          <button key={k} type="button" className={`vw-chip${active ? ' active' : ''}`} onClick={() => toggleAmenidad(k)}>
                            {active && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><polyline points="20 6 9 17 4 12"/></svg>}
                            {t(k)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ═══════ PASO 4 — PUBLICAR ═══════ */}
                {step === 4 && (
                  <>
                    <div className="vd-field vd-full">
                      <label>{t('vw_servicios_label')}</label>
                      <p className="vw-sub-text">{t('vw_servicios_sub')}</p>
                      <div className="vw-services-grid">
                        {SERVICIOS_VIRALES.map(s => {
                          const active = form.servicios.includes(s.key);
                          return (
                            <button key={s.key} type="button" className={`vw-service-card${active ? ' active' : ''}`} onClick={() => toggleServicio(s.key)}>
                              <div className="vw-service-icon">{s.icon}</div>
                              <div className="vw-service-title">{t(s.titleKey)}</div>
                              <p className="vw-service-desc">{t(s.descKey)}</p>
                              <span className="vw-service-tag">{active ? `✓ ${t('vw_srv_incluido')}` : `+ ${t('vw_srv_agregar')}`}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="vd-field">
                      <label>{t('vd_f_nombre')}</label>
                      <input type="text" placeholder={t('vd_f_nombre_ph')} value={form.nombre} onChange={e => set('nombre', e.target.value)} required />
                    </div>
                    <div className="vd-field">
                      <label>{t('vd_f_telefono')}</label>
                      <input type="tel" placeholder="+52 000 000 0000" value={form.telefono} onChange={e => set('telefono', e.target.value)} required />
                    </div>
                  </>
                )}

                {/* ── NAVEGACIÓN ── */}
                <div className="vw-nav-row vd-full">
                  {step > 1 && (
                    <button type="button" className="vw-btn-prev" onClick={() => setStep(s => s - 1)}>
                      {t('vw_anterior')}
                    </button>
                  )}
                  <button type="submit" className="vd-submit-btn vw-btn-next" disabled={!canNext()}>
                    {step < 4 ? t('vw_siguiente') : t('vw_publicar_btn')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ══ PROCESO ══ */}
      <section className="vd-process">
        <div className="vd-section-label">{t('vd_proceso_label')}</div>
        <h2 className="vd-section-title">
          {t('vd_proceso_titulo_1')}<br />{t('vd_proceso_titulo_2')}
        </h2>
        <div className="vd-process-grid">
          <div className="vd-process-line" />
          {PASOS.map(p => (
            <div key={p.num} className="vd-step">
              <div className={`vd-step-num${p.activo ? ' active' : ''}`}>{p.num}</div>
              <div className="vd-step-title">{p.titulo}</div>
              <p className="vd-step-desc">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ STATS ══ */}
      <div className="vd-stats">
        {[
          [t('vd_stat1_num'), t('vd_stat1_unit'), t('vd_stat1_lbl'), t('vd_stat1_sub')],
          [t('vd_stat2_num'), t('vd_stat2_unit'), t('vd_stat2_lbl'), t('vd_stat2_sub')],
          [t('vd_stat3_num'), t('vd_stat3_unit'), t('vd_stat3_lbl'), t('vd_stat3_sub')],
          [t('vd_stat4_num'), t('vd_stat4_unit'), t('vd_stat4_lbl'), t('vd_stat4_sub')],
        ].map(([num, unit, lbl, sub]) => (
          <div key={lbl} className="vd-stat">
            <div className="vd-stat-num">{num}<span>{unit}</span></div>
            <div className="vd-stat-label">{lbl}</div>
            <div className="vd-stat-sub">{sub}</div>
          </div>
        ))}
      </div>

      {/* ══ BENEFICIOS ══ */}
      <section className="vd-benefits">
        <div className="vd-section-label">{t('vd_ben_label')}</div>
        <h2 className="vd-section-title vd-cream">
          {t('vd_ben_titulo_1')}<br /><em>{t('vd_ben_titulo_2')}</em>
        </h2>
        <div className="vd-benefits-grid">
          {BENEFICIOS.map(b => (
            <div key={b.titulo} className="vd-benefit-card">
              <div className="vd-benefit-icon">{b.svg}</div>
              <div>
                <div className="vd-benefit-title">{b.titulo}</div>
                <p className="vd-benefit-desc">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ CTA FINAL ══ */}
      <section className="vd-cta">
        <h2>{t('vd_cta_titulo_1')}<br />{t('vd_cta_titulo_2')}</h2>
        <p>{t('vd_cta_sub')}</p>
        <a href="#publicar" className="vd-btn-dark">{t('vd_cta_btn')}</a>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="vd-footer">
        <div className="vd-footer-logo">I N M O V I R A L</div>
        <div className="vd-footer-copy">{t('footer_rights')}</div>
        <button className="vd-back-link" onClick={onVolver}>← {t('vd_back')}</button>
      </footer>

    </div>
  );
}
