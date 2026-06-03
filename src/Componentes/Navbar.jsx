import React from 'react';
import styles from '../App.module.css'; // Jalamos los estilos desde aquí

function Navbar({ alCambiarVista }) {
  return (
    <nav className={styles.barraNavegacion}>
      <h2 onClick={() => alCambiarVista('inicio')} className={styles.logo}>
        InmoViral
      </h2>
      <div className={styles.menuEnlaces}>
        <span onClick={() => alCambiarVista('inicio')} className={styles.enlace}>
          Catálogo
        </span>
      </div>
      <div className={styles.menuBotones}>
        <button onClick={() => alCambiarVista('login')} className={styles.btnLogin}>
          Iniciar Sesión
        </button>
        <button onClick={() => alCambiarVista('registro')} className={styles.btnRegistro}>
          Registrarse
        </button>
      </div>
    </nav>
  );
}

export default Navbar;