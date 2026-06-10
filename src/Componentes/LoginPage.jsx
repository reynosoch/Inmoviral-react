import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabaseClient';
import './LoginPage.css';

export default function LoginPage({ onVolver }) {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [modo, setModo] = useState('login'); // 'login' | 'register'

  const cambiarIdioma = (idioma) => {
    i18n.changeLanguage(idioma);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    
    try {
      if (modo === 'login') {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        setSuccess(t('login_success_msg', { defaultValue: '¡Sesión iniciada correctamente!' }));
        setTimeout(() => onVolver(), 1200);
      } else {
        const { error: err } = await supabase.auth.signUp({ email, password });
        if (err) throw err;
        setSuccess(t('register_success_msg', { defaultValue: '¡Cuenta creada! Revisa tu correo para confirmar.' }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  return (
    <main className="login-wrapper">
      {/* LADO DE LA IMAGEN */}
      <aside className="image-side">
        <img src="https://images.pexels.com/photos/773842/pexels-photo-773842.jpeg" alt="Premium luxury building" />
        <div className="image-overlay"></div>
        <a className="brand" onClick={onVolver}>INMOVIRAL</a>
        <div className="image-caption">
          <div className="label">{t('login_caption_lbl', { defaultValue: 'Premium Real Estate' })}</div>
          <blockquote>{t('login_caption', { defaultValue: '"Una colección curada de propiedades excepcionales para quienes valoran la exclusividad."' })}</blockquote>
        </div>
      </aside>

      {/* LADO DEL FORMULARIO */}
      <section className="form-side">
        
        {/* Selector de Idiomas Sincronizado */}
        <div className="lang-switcher">
          <button className={`lang-btn ${i18n.language.startsWith('es') ? 'active' : ''}`} onClick={() => cambiarIdioma('es')}>ES</button>
          <button className={`lang-btn ${i18n.language.startsWith('en') ? 'active' : ''}`} onClick={() => cambiarIdioma('en')}>EN</button>
        </div>

        <div className="form-inner">
          <div className="overline">{t('login_welcome', { defaultValue: 'Bienvenido de nuevo' })}</div>
          <h1 className="title">{modo === 'login' ? t('login_title', { defaultValue: 'Inicia sesión' }) : t('login_title_reg', { defaultValue: 'Crea tu cuenta' })}</h1>
          <p className="subtitle">{t('login_subtitle', { defaultValue: 'Propiedades excepcionales para clientes exigentes.' })}</p>

          {error && <div className="msg-alert msg-error">{error}</div>}
          {success && <div className="msg-alert msg-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <div className="field-head"><label htmlFor="email">{t('login_email_lbl', { defaultValue: 'Correo Electrónico' })}</label></div>
              <input id="email" type="email" placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>

            <div className="field">
              <div className="field-head">
                <label htmlFor="password">{t('login_pwd_lbl', { defaultValue: 'Contraseña' })}</label>
                {modo === 'login' && <button type="button" className="forgot">{t('login_forgot', { defaultValue: '¿Olvidaste?' })}</button>}
              </div>
              <div className="password-wrap">
                <input id="password" type={showPwd ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
                
                <button type="button" className="toggle-pwd" aria-label="Mostrar/ocultar contraseña" onClick={() => setShowPwd(!showPwd)}>
                  {showPwd ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a18.46 18.46 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 7 11 7a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? '...' : (modo === 'login' ? t('login_btn', { defaultValue: 'Iniciar Sesión' }) : t('login_btn_reg', { defaultValue: 'Registrarme' }))}
            </button>
          </form>

          <div className="divider"><span className="line"></span><span>o</span><span className="line"></span></div>

          <button type="button" className="btn-google" onClick={handleGoogle}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.4 14.6 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12S6.7 21.6 12 21.6c6.9 0 9.6-4.9 9.6-9 0-.6-.1-1-.1-1.4H12z"/>
            </svg>
            {t('login_google', { defaultValue: 'Continuar con Google' })}
          </button>

          <p className="footer-link">
            {modo === 'login' ? t('login_no_account', { defaultValue: '¿No tienes una cuenta?' }) : t('login_has_account', { defaultValue: '¿Ya tienes una cuenta?' })}{' '}
            <a onClick={() => { setModo(modo === 'login' ? 'register' : 'login'); setError(''); setSuccess(''); }}>
              {modo === 'login' ? t('login_register_link', { defaultValue: 'Regístrate' }) : t('login_signin_link', { defaultValue: 'Inicia sesión' })}
            </a>
          </p>
          <p className="footer-link" style={{ marginTop: '12px' }}>— o —</p>
          <p className="footer-link" style={{ marginTop: '12px' }}>
            {t('login_guest_lbl', { defaultValue: '¿Prefieres continuar sin registrarte?' })} <a onClick={onVolver}>{t('login_guest_link', { defaultValue: 'Continuar como invitado' })}</a>
          </p>

        </div>
      </section>
    </main>
  );
}