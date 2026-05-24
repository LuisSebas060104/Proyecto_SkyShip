import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Registro() {
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    correo: '',
    telefono: '',
    direccion: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('VITE_API_URL/api/auth/registro', formData);
      alert('¡Cuenta creada con éxito! Ahora inicia sesión.');
      navigate('/login'); 
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.mensaje || 'Hubo un error al registrarte');
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
          .auth-card { background: white; padding: 3rem; border-radius: 8px; width: 100%; max-width: 500px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border-top: 5px solid #ea580c; }
          .auth-title { color: #004b87; font-size: 1.8rem; font-weight: 800; margin-top: 0; margin-bottom: 0.5rem; text-align: center; }
          .auth-subtitle { color: #64748b; text-align: center; margin-bottom: 2rem; font-size: 0.95rem; }
          .form-group { margin-bottom: 1.2rem; }
          .form-input { width: 100%; padding: 0.8rem 1rem; border: 1px solid #cbd5e1; border-radius: 4px; font-family: inherit; font-size: 1rem; background-color: #f8fafc; transition: border-color 0.2s; }
          .form-input:focus { outline: none; border-color: #ea580c; background-color: white; }
          .btn-submit { width: 100%; padding: 0.9rem; background-color: #004b87; color: white; border: none; border-radius: 4px; font-weight: bold; font-size: 1.05rem; cursor: pointer; transition: background-color 0.2s; margin-top: 0.5rem; }
          .btn-submit:hover { background-color: #00335c; }
          .auth-footer { text-align: center; margin-top: 2rem; color: #64748b; font-size: 0.95rem; }
          .auth-link { color: #ea580c; text-decoration: none; font-weight: bold; }
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
            <h2 className="auth-title">Crear Cuenta</h2>
            <p className="auth-subtitle">Únete a la red logística más segura de Guatemala</p>
            
            <form onSubmit={manejarSubmit}>
              <div className="form-group">
                <input type="text" name="nombreCompleto" placeholder="Nombre completo" onChange={handleChange} required className="form-input" />
              </div>
              <div className="form-group">
                <input type="email" name="correo" placeholder="Correo electrónico" onChange={handleChange} required className="form-input" />
              </div>
              <div className="form-group">
                <input type="text" name="telefono" placeholder="Teléfono de contacto" onChange={handleChange} required className="form-input" />
              </div>
              <div className="form-group">
                <input type="text" name="direccion" placeholder="Dirección principal" onChange={handleChange} required className="form-input" />
              </div>
              <div className="form-group">
                <input type="password" name="password" placeholder="Crea una contraseña segura" onChange={handleChange} required className="form-input" />
              </div>
              
              {error && <p style={{ color: '#ef4444', fontSize: '0.9rem', textAlign: 'center', fontWeight: 'bold', margin: '0.5rem 0' }}>{error}</p>}
              
              <button type="submit" className="btn-submit">
                Completar Registro
              </button>
            </form>

            <div className="auth-footer">
              <p style={{ margin: '0 0 0.5rem 0' }}>¿Ya tienes una cuenta operativa?</p>
              <Link to="/login" className="auth-link">Inicia sesión aquí</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Registro;