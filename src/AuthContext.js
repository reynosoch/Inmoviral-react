import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from './supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Revisa si ya había una sesión guardada al abrir la app
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };
    checkSession();

    // Escucha en tiempo real si el usuario cambia de estado
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Funciones globales de autenticación
  const signIn = (email, password) => supabase.auth.signInWithPassword({ email, password });
  const signUp = (email, password) => supabase.auth.signUp({ email, password });
  const signOut = () => supabase.auth.signOut();

  // 🌟 Usamos React.createElement en lugar de JSX para que Vite no truene con la extensión .js
  return React.createElement(
    AuthContext.Provider,
    { value: { user, loading, signIn, signUp, signOut } },
    children
  );
};

// Hook personalizado para usar la autenticación en cualquier pantalla
export const useAuth = () => useContext(AuthContext);