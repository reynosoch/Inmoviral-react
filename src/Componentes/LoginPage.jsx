import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabaseClient';
import './LoginPage.css';

// Ejemplo de función que puedes usar en el catálogo para traer las casas desde la Base de Datos
import { supabase } from '../supabaseClient';

export async function obtenerPropiedades() {
  const { data, error } = await supabase
    .from('propiedades')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error al obtener propiedades:', error);
    return [];
  }
  return data; // Retorna el arreglo de casas con sus URLs de imágenes listas para renderizar
}

export default function LoginPage({ onVolver }) {
  const { t, i18n } = useTranslation();
  
  // Estados comunes
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [modo, setModo] = useState('login'); // 'login' | 'register'

  // Estados nuevos para el Registro
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [clientType, setClientType] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

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
        // Validación del Checkbox de Términos antes de registrar
        if (!acceptTerms) {
          throw new Error(i18n.language.startsWith('es') ? 'Debes aceptar los términos y condiciones.' : 'You must accept the terms and conditions.');
        }

        // Registro en Supabase pasando los metadatos del formulario para guardarlos en auth.users
        const { data: signUpData, error: err } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone: phone,
              client_type: clientType
            }
          }
        });
        if (err) throw err;

        // Validar si requiere confirmación por correo electrónico o inicia directo
        if (signUpData?.user && signUpData.session === null) {
          setSuccess(t('register_success_confirm', { defaultValue: '¡Cuenta creada! Revisa tu correo electrónico para confirmar tu cuenta.' }));
        } else {
          setSuccess(t('register_success_msg', { defaultValue: '¡Cuenta creada e inicio de sesión exitoso!' }));
          setTimeout(() => onVolver(), 1200);
        }
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
      {/* LADO DE LA IMAGEN (Cambia el fondo dinámicamente según el modo) */}
      <aside className="image-side">
        <img 
          src={modo === 'login' 
            ? "https://images.pexels.com/photos/773842/pexels-photo-773842.jpeg" 
            : "https://images.unsplash.com/photo-1613621792067-8e28d16b735c?crop=entropy&cs=srgb&fm=jpg&q=85"
          } 
          alt="Luxury property interior" 
        />
        <div className="image-overlay"></div>
        <a className="brand" onClick={onVolver}>INMOVIRAL</a>
        <div className="image-caption">
          <div className="label">
            {modo === 'login' ? t('login_caption_lbl', { defaultValue: 'Premium Real Estate' }) : t('register_caption_lbl', { defaultValue: 'Únete a la colección' })}
          </div>
          {/* Aquí corregí la llave de apertura < que faltaba */}
          <blockquote>
            {modo === 'login' 
              ? t('login_caption', { defaultValue: '"Una colección curada de propiedades excepcionales para quienes valoran la exclusividad."' })
              : t('register_caption', { defaultValue: '"Cada propiedad es una solución a medida, diseñada en torno a la visión del cliente."' })
            }
          </blockquote>
        </div>
      </aside>

      {/* LADO DEL FORMULARIO */}
      <section className="form-side">
        <div className="lang-switcher">
          <button className={`lang-btn ${i18n.language.startsWith('es') ? 'active' : ''}`} onClick={() => cambiarIdioma('es')}>ES</button>
          <button className={`lang-btn ${i18n.language.startsWith('en') ? 'active' : ''}`} onClick={() => cambiarIdioma('en')}>EN</button>
        </div>

        <div className="form-inner">
          <div className="overline">
            {modo === 'login' ? t('login_welcome', { defaultValue: 'Bienvenido de nuevo' }) : t('register_overline', { defaultValue: 'Acceso Privado' })}
          </div>
          <h1 className="title">
            {modo === 'login' ? t('login_title', { defaultValue: 'Inicia sesión' }) : t('login_title_reg', { defaultValue: 'Crear cuenta' })}
          </h1>
          <p className="subtitle">
            {modo === 'login' ? t('login_subtitle', { defaultValue: 'Propiedades excepcionales para clientes exigentes.' }) : t('register_subtitle', { defaultValue: 'Accede a las propiedades más exclusivas del mercado.' })}
          </p>

          {error && <div className="msg-alert msg-error">{error}</div>}
          {success && <div className="msg-alert msg-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            {/* CAMPOS EXCLUSIVOS DEL REGISTRO */}
            {modo === 'register' && (
              <>
                <div className="field">
                  <div className="field-head"><label htmlFor="fullName">{t('register_name_lbl', { defaultValue: 'Nombre Completo' })}</label></div>
                  <input id="fullName" type="text" placeholder="Ej. Juan Pérez" value={fullName} onChange={e => setFullName(e.target.value)} required />
                </div>

                <div className="field">
                  <div className="field-head"><label htmlFor="phone">{t('register_phone_lbl', { defaultValue: 'Teléfono' })}</label></div>
                  <input id="phone" type="tel" placeholder="+34 600 000 000" value={phone} onChange={e => setPhone(e.target.value)} required />
                </div>
              </>
            )}

            {/* CAMPOS COMUNES */}
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
                <input id="password" type={showPwd ? 'text' : 'password'} placeholder={modo === 'login' ? "••••••••" : "Mínimo 6 caracteres"} value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
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

            {/* SELECCIÓN DE TIPO DE CLIENTE Y TÉRMINOS (SÓLO REGISTRO) */}
            {modo === 'register' && (
              <>
                <div className="field">
                  <div className="field-head"><label htmlFor="clientType">{t('register_type_lbl', { defaultValue: 'Tipo de Cliente' })}</label></div>
                  <div className="select-wrap">
                    <select id="clientType" className={clientType ? 'has-value' : ''} value={clientType} onChange={e => setClientType(e.target.value)} required>
                      <option value="" disabled>{t('register_type_placeholder', { defaultValue: 'Selecciona una opción' })}</option>
                      <option value="Comprador">{t('register_type_opt1', { defaultValue: 'Comprador' })}</option>
                      <option value="Vendedor">{t('register_type_opt2', { defaultValue: 'Vendedor' })}</option>
                      <option value="Inversionista">{t('register_type_opt3', { defaultValue: 'Inversionista' })}</option>
                    </select>
                  </div>
                </div>

                <label className="terms">
                  <input type="checkbox" checked={acceptTerms} onChange={e => setAcceptTerms(e.target.checked)} />
                  <span>
                    {t('register_terms_1', { defaultValue: 'Acepto los ' })}
                    <em>{t('register_terms_em', { defaultValue: 'términos y condiciones' })}</em>
                    {t('register_terms_2', { defaultValue: ' y la política de privacidad de INMOVIRAL.' })}
                  </span>
                </label>
              </>
            )}

            <button type="submit" className="btn-primary" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? '...' : (modo === 'login' ? t('login_btn', { defaultValue: 'Iniciar Sesión' }) : t('login_btn_reg', { defaultValue: 'Registrarse' }))}
            </button>
          </form>

          <div className="divider"><span className="line"></span><span>o</span><span className="line"></span></div>

          <button type="button" className="btn-google" onClick={handleGoogle}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.4 14.6 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12S6.7 21.6 12 21.6c6.9 0 9.6-4.9 9.6-9 0-.6-.1-1-.1-1.4H12z"/>
            </svg>
            {modo === 'login' ? t('login_google', { defaultValue: 'Continuar con Google' }) : t('register_google', { defaultValue: 'Registrarse con Google' })}
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