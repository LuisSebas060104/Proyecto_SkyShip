import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  
  const navigate = useNavigate();

const manejarSubmit = async (e) => {
    e.preventDefault();
    try {
      // Usamos backticks (`) para inyectar la variable y concatenar la ruta
      const respuesta = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        correo,
        password
      });
      
      const token = respuesta.data.token;
      localStorage.setItem('token', token); 
      navigate('/dashboard');
      
    } catch (error) {
      console.error("Error real:", error); 
      setMensaje(error.response?.data?.mensaje || 'Error interno del servidor');
    }
  };

  return (
    <>
      <style>
        {`
          html, body, #root { margin: 0; padding: 0; width: 100%; min-height: 100vh; font-family: 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; }
          * { box-sizing: border-box; }
          .auth-wrapper { display: flex; flex-direction: column; min-height: 100vh; }
          .auth-nav { padding: 1.5rem 5%; background-color: transparent; }
          .btn-back { color: #004b87; text-decoration: none; font-weight: 700; font-size: 1rem; display: flex; align-items: center; gap: 0.5rem; transition: color 0.2s; }
          .btn-back:hover { color: #ea580c; }
          .auth-content { flex: 1; display: flex; justify-content: center; align-items: center; padding: 2rem 5%; }
          .auth-card { background: white; padding: 3rem; border-radius: 8px; width: 100%; max-width: 450px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border-top: 5px solid #004b87; }
          .auth-title { color: #004b87; font-size: 1.8rem; font-weight: 800; margin-top: 0; margin-bottom: 0.5rem; text-align: center; }
          .auth-subtitle { color: #64748b; text-align: center; margin-bottom: 2rem; font-size: 0.95rem; }
          .form-group { margin-bottom: 1.2rem; }
          .form-input { width: 100%; padding: 0.8rem 1rem; border: 1px solid #cbd5e1; border-radius: 4px; font-family: inherit; font-size: 1rem; background-color: #f8fafc; transition: border-color 0.2s; }
          .form-input:focus { outline: none; border-color: #004b87; background-color: white; }
          .btn-submit { width: 100%; padding: 0.9rem; background-color: #ea580c; color: white; border: none; border-radius: 4px; font-weight: bold; font-size: 1.05rem; cursor: pointer; transition: background-color 0.2s; margin-top: 1rem; }
          .btn-submit:hover { background-color: #c2410c; }
          .auth-footer { text-align: center; margin-top: 2rem; color: #64748b; font-size: 0.95rem; }
          .auth-link { color: #004b87; text-decoration: none; font-weight: bold; }
          .auth-link:hover { text-decoration: underline; }
        `}
      </style>

      <div className="auth-wrapper">
        {/* Botón para volver al Landing */}
        <nav className="auth-nav">
          <Link to="/" className="btn-back">
            <span>←</span> Volver al inicio
          </Link>
        </nav>

        <div className="auth-content">
          <div className="auth-card">
            <h2 className="auth-title">SkyShip Express</h2>
            <p className="auth-subtitle">Ingrese sus credenciales para continuar</p>
            
            <form onSubmit={manejarSubmit}>
              <div className="form-group">
                <input 
                  type="email" 
                  placeholder="Correo electrónico" 
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <input 
                  type="password" 
                  placeholder="Contraseña" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              
              {mensaje && <p style={{ color: '#ef4444', fontSize: '0.9rem', textAlign: 'center', fontWeight: 'bold', margin: '0.5rem 0' }}>{mensaje}</p>}
              
              <button type="submit" className="btn-submit">
                Iniciar Sesión
              </button>
            </form>

            <div className="auth-footer">
              <p style={{ margin: '0 0 0.5rem 0' }}>¿Aún no tienes cuenta?</p>
              <Link to="/registro" className="auth-link">Regístrate como cliente</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
