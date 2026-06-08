import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabaseClient';

export default function LoginPage({ onVolver }) {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [modo, setModo] = useState('login');
  const [isWide, setIsWide] = useState(window.innerWidth > 1024);

  useEffect(() => {
    const handleResize = () => setIsWide(window.innerWidth > 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isES = i18n.language === 'es';

  // Sincronización limpia con tu traductor nativo
  const txt = {
    welcome:    isES ? 'BIENVENIDO DE NUEVO' : 'WELCOME BACK',
    title:      isES ? 'Inicia sesión' : 'Sign in',
    titleReg:   isES ? 'Crear cuenta' : 'Create account',
    subtitle:   isES ? 'Propiedades excepcionales para clientes exigentes.' : 'Exceptional properties for discerning clients.',
    emailLbl:   isES ? 'CORREO ELECTRÓNICO' : 'EMAIL ADDRESS',
    pwdLbl:     isES ? 'CONTRASEÑA' : 'PASSWORD',
    forgot:     isES ? '¿OLVIDASTE?' : 'FORGOT?',
    btn:        isES ? 'INICIAR SESIÓN →' : 'SIGN IN →',
    btnReg:     isES ? 'CREAR CUENTA →' : 'CREATE ACCOUNT →',
    google:     isES ? 'CONTINUAR CON GOOGLE' : 'CONTINUE WITH GOOGLE',
    noAccount:  isES ? '¿No tienes cuenta?' : "Don't have an account?",
    hasAccount: isES ? '¿Ya tienes cuenta?' : 'Already have an account?',
    register:   isES ? 'Regístrate' : 'Register',
    login:      isES ? 'Inicia sesión' : 'Sign in',
    guest:      isES ? 'Continuar como invitado' : 'Continue as guest',
    caption:    isES ? '"Una selección curada de propiedades residenciales y de inversión para quienes valoran la exclusividad."' : '"A curated collection of residential and investment properties for those who value exclusivity."',
    captionLbl: isES ? 'BIENES RAÍCES PREMIUM' : 'PREMIUM REAL ESTATE',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      if (modo === 'login') {
        const { error: loginErr } = await supabase.auth.signInWithPassword({ email, password });
        if (loginErr) throw loginErr;
        setSuccess(isES ? '¡Sesión iniciada correctamente!' : 'Signed in successfully!');
        setTimeout(() => onVolver(), 1200);
      } else {
        const { error: registerErr } = await supabase.auth.signUp({ email, password });
        if (registerErr) throw registerErr;
        setSuccess(isES ? '¡Cuenta creada! Revisa tu correo para confirmar.' : 'Account created! Check your email to confirm.');
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
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', background: '#0F0D0A', color: '#FDFBF8', margin: 0, padding: 0, boxSizing: 'border-box' }}>
      
      {/* ─── LADO IZQUIERDO: Panel de Imagen Decorativo (Oculto en móviles) ─── */}
      <div style={{ flex: '1', position: 'relative', overflow: 'hidden', background: '#1C1812', display: isWide ? 'block' : 'none' }}>
        <img 
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }} 
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80" 
          alt="InmoViral Building" 
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(12,9,5,0.5), #0F0D0A)' }} />
        <span style={{ position: 'absolute', top: 48, left: 48, zIndex: 2, fontFamily: "'Cormorant Garamond', serif", fontSize: 24, letterSpacing: '0.35em', color: '#FDFBF8', cursor: 'pointer', textTransform: 'uppercase' }} onClick={onVolver}>
          INMOVIRAL
        </span>
        <div style={{ position: 'absolute', bottom: 64, left: 48, right: 48, zIndex: 2 }}>
          {/* Corregido el alignContent/alignItems para evitar crasheos de CSS */}
          <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C49A58', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 30, height: 1, background: '#C49A58', display: 'inline-block' }}></span>
            {txt.captionLbl}
          </div>
          <blockquote style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, lineHeight: 1.15, fontWeight: 300, margin: 0, color: '#FDFBF8', fontStyle: 'italic' }}>
            {txt.caption}
          </blockquote>
        </div>
      </div>

      {/* ─── LADO DERECHO: Formulario de Autenticación ─── */}
      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 60px', background: '#0F0D0A' }}>
        <div style={{ width: '100%', maxWidth: 400, margin: '0 auto' }}>

          {/* Selector de Idiomas */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 32 }}>
            {['es', 'en'].map(lng => (
              <button key={lng} onClick={() => i18n.changeLanguage(lng)}
                style={{ background: i18n.language === lng ? '#A07840' : 'transparent', color: 'white', border: '1px solid #A07840', padding: '6px 12px', cursor: 'pointer', fontSize: 11, letterSpacing: '0.1em' }}>
                {lng.toUpperCase()}
              </button>
            ))}
          </div>

          <div style={{ fontSize: 11, letterSpacing: '0.22em', color: '#C49A58', marginBottom: 14 }}>{txt.welcome}</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 400, letterSpacing: '0.02em', margin: '0 0 12px 0', lineHeight: 1.05, textTransform: 'uppercase' }}>
            {modo === 'login' ? txt.title : txt.titleReg}
          </h1>
          <p style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.5)', margin: '0 0 40px 0', lineHeight: 1.8 }}>{txt.subtitle}</p>

          {error && <div style={{ background: 'rgba(220,50,50,0.12)', border: '1px solid rgba(220,50,50,0.3)', color: '#ff7070', padding: '12px 16px', fontSize: 13, marginBottom: 16 }}>{error}</div>}
          {success && <div style={{ background: 'rgba(160,120,64,0.15)', border: '1px solid #A07840', color: '#C49A58', padding: '12px 16px', fontSize: 13, marginBottom: 16 }}>{success}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 22 }}>
              <label style={{ fontSize: 10, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>{txt.emailLbl}</label>
              <input type="email" placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)} required
                style={{ width: '100%', height: 48, background: '#1C1812', border: '1px solid rgba(255,255,255,0.07)', color: '#FDFBF8', padding: '0 16px', fontSize: 14, outline: 'none' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 22 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ fontSize: 10, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)' }}>{txt.pwdLbl}</label>
                {modo === 'login' && <button type="button" style={{ fontSize: 10, letterSpacing: '0.15em', color: '#C49A58', background: 'none', border: 'none', cursor: 'pointer' }}>{txt.forgot}</button>}
              </div>
              <div style={{ position: 'relative' }}>
                <input type={showPwd ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
                  style={{ width: '100%', height: 48, background: '#1C1812', border: '1px solid rgba(255,255,255,0.07)', color: '#FDFBF8', padding: '0 16px', fontSize: 14, outline: 'none' }} />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
                  {showPwd ? '👁️' : '🔒'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{ width: '100%', height: 48, background: '#A07840', color: '#FDFBF8', border: 'none', fontSize: 12, fontWeight: 400, letterSpacing: '0.16em', textTransform: 'uppercase', cursor: 'pointer', marginTop: 12, opacity: loading ? 0.7 : 1 }}>
              {loading ? '...' : (modo === 'login' ? txt.btn : txt.btnReg)}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '32px 0' }}>
            <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            <span style={{ fontSize: 10, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)' }}>O</span>
            <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
          </div>

          <button onClick={handleGoogle}
            style={{ width: '100%', height: 48, background: 'transparent', color: '#FDFBF8', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer' }}>
            <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.4 14.6 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12S6.7 21.6 12 21.6c6.9 0 9.6-4.9 9.6-9 0-.6-.1-1-.1-1.4H12z"/></svg>
            {txt.google}
          </button>

          <p style={{ marginTop: 32, textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
            {modo === 'login' ? txt.noAccount : txt.hasAccount}{' '}
            <span style={{ color: '#C49A58', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => { setModo(modo === 'login' ? 'register' : 'login'); setError(''); setSuccess(''); }}>
              {modo === 'login' ? txt.register : txt.login}
            </span>
          </p>

          <p style={{ marginTop: 12, textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
            <span style={{ color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }} onClick={onVolver}>
              ← {txt.guest}
            </span>
          </p>
        </div>
      </div>

    </div>
  );
}