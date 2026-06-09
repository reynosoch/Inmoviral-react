import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabaseClient';
import './LoginPage.css';

export default function LoginPage({ onVolver }) {
  const { i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: '¡Bienvenido de nuevo!' });
      setTimeout(() => onVolver(), 1000);
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  const eyeOpen = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  );

  const eyeOff = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a18.46 18.46 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 7 11 7a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

  return (
    <main className="login-wrapper">
      {/* Lado imagen */}
      <aside className="image-side">
        <img src="https://images.pexels.com/photos/773842/pexels-photo-773842.jpeg" alt="Premium luxury building" />
        <div className="image-overlay"></div>
        <a className="brand" onClick={onVolver}>INMOVIRAL</a>
        <div className="image-caption">
          <div className="label">Premium Real Estate</div>
          <blockquote>"Una colección curada de propiedades excepcionales para quienes valoran la exclusividad."</blockquote>
        </div>
      </aside>

      {/* Lado formulario */}
      <section className="form-side">
        <div className="lang-switcher">
          <button className={`lang-btn${i18n.language === 'es' ? ' active' : ''}`} onClick={() => i18n.changeLanguage('es')}>ES</button>
          <button className={`lang-btn${i18n.language === 'en' ? ' active' : ''}`} onClick={() => i18n.changeLanguage('en')}>EN</button>
        </div>

        <div className="form-inner">
          <div className="overline">Bienvenido de nuevo</div>
          <h1 className="title">Inicia sesión</h1>
          <p className="subtitle">Propiedades excepcionales para clientes exigentes.</p>

          {message && (
            <div className={`msg-alert ${message.type === 'error' ? 'msg-error' : 'msg-success'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <div className="field-head">
                <label htmlFor="email">Correo Electrónico</label>
              </div>
              <input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <div className="field-head">
                <label htmlFor="password">Contraseña</label>
                <button type="button" className="forgot">¿Olvidaste?</button>
              </div>
              <div className="password-wrap">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="toggle-pwd"
                  aria-label="Mostrar/ocultar contraseña"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? eyeOff : eyeOpen}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Iniciando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="divider">
            <span className="line"></span>
            <span>o</span>
            <span className="line"></span>
          </div>

          <button type="button" className="btn-google" onClick={handleGoogle}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.4 14.6 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12S6.7 21.6 12 21.6c6.9 0 9.6-4.9 9.6-9 0-.6-.1-1-.1-1.4H12z"/>
            </svg>
            Continuar con Google
          </button>

          <p className="footer-link">
            ¿No tienes una cuenta? <a href="#">Regístrate</a>
          </p>
          <p className="footer-link" style={{ marginTop: '8px' }}>
            ¿Prefieres continuar sin registrarte? <a onClick={onVolver}>Continuar como invitado</a>
          </p>
        </div>
      </section>
    </main>
  );
}