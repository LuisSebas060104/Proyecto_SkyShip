import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Landing() {
  const [mensajeContacto, setMensajeContacto] = useState({ nombre: '', correo: '', mensaje: '' });


const manejarContacto = async (e) => {
    e.preventDefault();
    try {
      await axios.post('VITE_API_URL/api/contact', mensajeContacto);
      
      alert('¡Mensaje guardado en MongoDB con éxito!');
      
      setMensajeContacto({ nombre: '', correo: '', mensaje: '' });
    } catch (error) {
      console.error(error);
      alert('Error de conexión con el backend.');
    }
  };

  return (
    <>
      <style>
        {`
          /* 1. ELIMINAR LOS BORDES DE VITE */
          html, body, #root {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            text-align: left;
            font-family: 'Segoe UI', Roboto, Helvetica, sans-serif;
            background-color: #ffffff;
            color: #333333;
            box-sizing: border-box;
          }
          
          *, *::before, *::after {
            box-sizing: inherit;
          }

          /* 2. PALETA LOGÍSTICA: ROJO CORINTO Y NARANJA */
          .navbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 5%;
            background-color: #004173; /* Rojo Corinto */
            border-bottom: 4px solid #EA580C; /* Línea Naranja */
            width: 100%;
          }
          .nav-brand {
            font-size: 1.4rem;
            font-weight: 900;
            color: #ffffff;
            margin: 0;
            letter-spacing: -0.5px;
          }
          .nav-links {
            display: flex;
            gap: 1.5rem;
            align-items: center;
          }
          .btn-outline {
            color: #ffffff;
            text-decoration: none;
            font-size: 0.95rem;
            font-weight: 700;
          }
          .btn-primary {
            background-color: #EA580C; /* Naranja Logístico */
            color: #ffffff;
            padding: 0.6rem 1.4rem;
            border-radius: 4px;
            text-decoration: none;
            font-size: 0.95rem;
            font-weight: 700;
            border: none;
            cursor: pointer;
            transition: background-color 0.2s;
          }
          .btn-primary:hover {
            background-color: #C2410C; /* Naranja más oscuro */
          }

          /* 3. HERO SECTION (Invertida: Fondo Blanco, Letras Corinto) */
          .hero-section {
            background-color: #ffffff; 
            padding: 6rem 5%;
            text-align: center;
            width: 100%;
          }
          .hero-title {
            font-size: 3rem; 
            font-weight: 900;
            color: #004173; /* Rojo Corinto */
            max-width: 800px;
            margin: 0 auto 1.2rem auto;
            line-height: 1.2;
          }
          .hero-subtitle {
            font-size: 1.1rem; 
            color: #555555; 
            max-width: 600px;
            margin: 0 auto 2.5rem auto;
            line-height: 1.6;
          }

          /* 4. SECCIONES Y TARJETAS */
          .section-white {
            background-color: #ffffff;
            padding: 5rem 5%;
            width: 100%;
          }
          .section-light {
            background-color: #f8fafc; /* Gris extra claro */
            padding: 5rem 5%;
            width: 100%;
          }
          .section-corinto {
            background-color: #004173; /* Bloque oscuro Corinto para balancear */
            padding: 5rem 5%;
            width: 100%;
          }
          .content-limit {
            max-width: 1200px;
            margin: 0 auto;
          }
          .section-title {
            font-size: 2rem;
            font-weight: 800;
            color: #004173;
            text-align: center;
            margin-top: 0;
            margin-bottom: 3rem;
          }
          .section-title.light-text {
            color: #ffffff;
          }
          .grid-3-cols {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 2rem;
          }
          .card {
            background: #ffffff;
            padding: 2.5rem;
            border-radius: 6px;
            border: 1px solid #eaeaea;
            border-top: 4px solid #EA580C; /* Acento Naranja */
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          }
          .card-title {
            font-size: 1.2rem;
            font-weight: 800;
            color: #004173;
            margin-top: 0;
            margin-bottom: 1rem;
          }
          .card-title span {
            color: #EA580C;
          }
          .card-text {
            font-size: 0.95rem;
            color: #555555;
            line-height: 1.6;
            margin: 0;
          }

          /* 5. FAQ Y FORMULARIO */
          .faq-item {
            padding: 1.5rem;
            margin-bottom: 1rem;
            background-color: #ffffff;
            border-left: 4px solid #EA580C; /* Acento Naranja */
            border-radius: 4px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          .form-container {
            max-width: 550px;
            margin: 0 auto;
            background: #ffffff;
            padding: 2.5rem;
            border-radius: 6px;
            border: 1px solid #eaeaea;
            border-top: 4px solid #004173;
            box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          }
          .form-input {
            width: 100%;
            padding: 0.9rem;
            margin-bottom: 1.2rem;
            border: 1px solid #cccccc;
            border-radius: 4px;
            font-family: inherit;
            font-size: 0.95rem;
          }
          .form-input:focus {
            outline: none;
            border-color: #7A1523;
          }
          
          /* 6. FOOTER */
          .footer {
            background-color: #004173; /* Rojo Corinto */
            color: #ffffff;
            text-align: center;
            padding: 3rem 5%;
            width: 100%;
            font-size: 0.9rem;
          }

          /* RESPONSIVIDAD */
          @media (max-width: 768px) {
            .hero-title { font-size: 2.2rem; }
            .section-title { font-size: 1.6rem; }
            .hero-section { padding: 4rem 5%; }
            .section-white, .section-light, .section-corinto { padding: 4rem 5%; }
            .navbar { flex-direction: column; gap: 1rem; }
          }
        `}
      </style>

      {/* NAVEGACIÓN */}
      <nav className="navbar">
        <h1 className="nav-brand">SkyShip Express</h1>
        <div className="nav-links">
          <Link to="/login" className="btn-outline">Iniciar Sesión</Link>
          <Link to="/registro" className="btn-primary">Crear Cuenta</Link>
        </div>
      </nav>

      {/* HERO SECTION (Ahora es Blanca) */}
      <header className="hero-section">
        <div className="content-limit">
          <h2 className="hero-title">Logística rápida y segura para toda Guatemala</h2>
          <p className="hero-subtitle">
            Gestione sus envíos nacionales con nuestra plataforma digital. Ofrecemos rastreo preciso, cotizaciones instantáneas y el respaldo que su negocio necesita.
          </p>
          <Link to="/registro" className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.05rem', display: 'inline-block' }}>
            Comenzar a Enviar Ahora
          </Link>
        </div>
      </header>

      {/* SOLUCIONES CORPORATIVAS */}
      <section className="section-light">
        <div className="content-limit">
          <h2 className="section-title">Soluciones Corporativas</h2>
          <div className="grid-3-cols">
            <div className="card">
              <h3 className="card-title">Nuestra Historia <span>.</span></h3>
              <p className="card-text">
                Nacimos con el propósito de optimizar la cadena de suministro en el país, desarrollando una infraestructura tecnológica que conecta empresas con total transparencia.
              </p>
            </div>
            <div className="card">
              <h3 className="card-title">Misión y Visión <span>.</span></h3>
              <p className="card-text">
                <strong>Misión:</strong> Proveer servicios logísticos de alta confiabilidad.<br/><br/>
                <strong>Visión:</strong> Consolidarnos como el principal operador logístico de la región centroamericana.
              </p>
            </div>
            <div className="card">
              <h3 className="card-title">Nuestros Valores <span>.</span></h3>
              <ul className="card-text" style={{ paddingLeft: '1.2rem' }}>
                <li>Integridad y transparencia total.</li>
                <li>Innovación tecnológica constante.</li>
                <li>Tiempos de entrega garantizados.</li>
                <li>Atención al cliente de primer nivel.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PREGUNTAS FRECUENTES (Fondo Corinto para hacer contraste) */}
      <section className="section-corinto">
        <div className="content-limit" style={{ maxWidth: '800px' }}>
          <h2 className="section-title light-text">Preguntas Frecuentes</h2>
          
          <div className="faq-item">
            <strong style={{ fontSize: '1.05rem', color: '#7A1523', display: 'block', marginBottom: '0.5rem' }}>
              ¿Cómo funciona el sistema de rastreo?
            </strong>
            <p className="card-text" style={{ color: '#444' }}>
              Cada envío genera un número de guía único. Desde su panel de control podrá verificar si el paquete se encuentra pendiente, en tránsito o entregado en tiempo real.
            </p>
          </div>
          
          <div className="faq-item">
            <strong style={{ fontSize: '1.05rem', color: '#7A1523', display: 'block', marginBottom: '0.5rem' }}>
              ¿Cuáles son las áreas de cobertura principal?
            </strong>
            <p className="card-text" style={{ color: '#444' }}>
              Operamos en todo el territorio nacional, con rutas prioritarias en la Ciudad de Guatemala, Antigua Guatemala y Quetzaltenango.
            </p>
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section className="section-white">
        <div className="content-limit">
          <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>Contacto Comercial</h2>
          <p style={{ textAlign: 'center', color: '#555555', marginBottom: '2.5rem', fontSize: '1rem' }}>
            Nuestro equipo de soporte está listo para atender sus requerimientos operativos.
          </p>
          
          <div className="form-container">
            <form onSubmit={manejarContacto}>
              <input 
                type="text" 
                placeholder="Nombre de la empresa o cliente" 
                required 
                className="form-input"
                value={mensajeContacto.nombre}
                onChange={(e) => setMensajeContacto({...mensajeContacto, nombre: e.target.value})}
              />
              <input 
                type="email" 
                placeholder="Correo electrónico" 
                required 
                className="form-input"
                value={mensajeContacto.correo}
                onChange={(e) => setMensajeContacto({...mensajeContacto, correo: e.target.value})}
              />
              <textarea 
                placeholder="Detalle su consulta..." 
                required 
                rows="4" 
                className="form-input"
                style={{ resize: 'vertical' }}
                value={mensajeContacto.mensaje}
                onChange={(e) => setMensajeContacto({...mensajeContacto, mensaje: e.target.value})}
              ></textarea>
              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.05rem' }}>
                Enviar Solicitud
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p style={{ margin: 0, fontWeight: '700', fontSize: '1.1rem' }}>© 2026 SkyShip Express.</p>
        <p style={{ margin: '0.5rem 0 0 0', opacity: 0.8 }}>Sistema Integral de Logística y Paquetería.</p>
      </footer>
    </>
  );
}

export default Landing;