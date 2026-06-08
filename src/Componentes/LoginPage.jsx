import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabaseClient';
import './LoginPage.css';

export default function LoginPage({ onVolver }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Intentando login...");
  };

  return (
    <main className="login-wrapper">
      <aside className="image-side">
        <img src="https://images.pexels.com/photos/773842/pexels-photo-773842.jpeg" alt="Premium luxury building" />
        <div className="image-overlay"></div>
        <a className="brand" onClick={onVolver}>INMOVIRAL</a>
        <div className="image-caption">
          <div className="label">Premium Real Estate</div>
          <blockquote>"Una colección curada de propiedades excepcionales."</blockquote>
        </div>
      </aside>

      <section className="form-side">
        <div className="form-inner">
          <h1 className="title">Iniciar Sesión</h1>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Correo</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="field">
              <label>Contraseña</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn-primary">Entrar</button>
          </form>
          <button onClick={onVolver} style={{ marginTop: '20px', background: 'none', border: 'none', color: '#fff' }}>
            ← Volver como invitado
          </button>
        </div>
      </section>
    </main>
  );
}