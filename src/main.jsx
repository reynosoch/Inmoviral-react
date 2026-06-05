import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './i18n'; // 👈 Asegúrate de que tenga el punto y la diagonal antes del nombre

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)