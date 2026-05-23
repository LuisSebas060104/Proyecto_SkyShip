import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [envios, setEnvios] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false); 

  const tarifas = {
    'Ciudad de Guatemala': 25.00,
    'Villa Nueva': 35.00,
    'Antigua Guatemala': 40.00,
    'Chimaltenango': 45.00,
    'Escuintla Costa Sur': 50.00,
    'Quetzaltenango Xela': 60.00,
    'Coban Alta Verapaz': 65.00,
    'Zacapa': 70.00,
    'Huehuetenango': 80.00,
    'Izabal Puerto Barrios': 85.00,
    'Peten': 95.00,
    'Resto del Pais Departamental': 75.00
  };

  const [destino, setDestino] = useState('Ciudad de Guatemala'); 
  const [direccionExacta, setDireccionExacta] = useState(''); // NUEVO: Estado para la calle/zona
  
  const navigate = useNavigate();
  const costoCalculado = tarifas[destino];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.user.rol === 'admin') {
        setIsAdmin(true); 
      }
    } catch (error) {
      console.error("Error leyendo el token", error);
    }

    const traerDatos = async () => {
      try {
        const resEnvios = await axios.get('http://localhost:5000/api/shipments/mis-envios', {
          headers: { 'x-auth-token': token }
        });
        setEnvios(resEnvios.data); 
      } catch (error) {
        console.error("Fallo al traer la data:", error);
      }
    };

    traerDatos();
  }, [navigate]);

  const manejarCrearEnvio = async (e) => {
    e.preventDefault(); 
    try {
      const token = localStorage.getItem('token');
      
      // NUEVA LÓGICA: Unimos la región con la dirección exacta en un solo string
      const destinoCompleto = `${destino} | ${direccionExacta}`;

      const respuesta = await axios.post('http://localhost:5000/api/shipments/crear', {
        destino: destinoCompleto, // Se guarda todo junto en la DB
        costoEstimado: costoCalculado
      }, {
        headers: { 'x-auth-token': token } 
      });

      setEnvios([respuesta.data.envio, ...envios]);
      setDestino('Ciudad de Guatemala');
      setDireccionExacta(''); // Limpiamos la cajita de texto al terminar
    } catch (error) {
      console.error("Error al crear el envío:", error);
      alert("Fallo al crear la guía de envío.");
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    navigate('/login'); 
  };

  const formatearFecha = (fechaString) => {
    const opciones = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(fechaString).toLocaleDateString('es-GT', opciones);
  };

  return (
    <>
      <style>
        {`
          html, body, #root { 
            margin: 0 !important; 
            padding: 0 !important; 
            width: 100% !important; 
            max-width: 100% !important; 
            background-color: #f8fafc !important; 
            font-family: 'Segoe UI', Roboto, sans-serif; 
          }
          * { box-sizing: border-box; }
          
          /* BARRA DE NAVEGACIÓN INFINITA */
          .header-wrapper {
            width: 100%;
            background-color: #004b87; 
            border-bottom: 4px solid #EA580C; 
            margin-bottom: 3rem;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          }
          .dash-header { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            padding: 1.2rem 5%; 
            width: 100%;
          }
          .dash-header h2 { 
            margin: 0; 
            font-size: 1.6rem; 
            font-weight: 900; 
            letter-spacing: -0.5px; 
            color: #ffffff !important; 
          }
          .header-actions { display: flex; gap: 1rem; align-items: center; }
          
          /* BOTONES SUPERIORES */
          .btn-admin { 
            background-color: #EA580C; 
            color: #ffffff; 
            padding: 0.6rem 1.2rem; 
            border-radius: 4px; 
            text-decoration: none; 
            font-weight: 700; 
            border: none; 
            transition: background-color 0.2s; 
            font-size: 0.95rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .btn-admin:hover { 
            background-color: #C2410C; 
          }

          .btn-logout { 
            background-color: #dc2626; 
            color: #ffffff; 
            padding: 0.6rem 1.2rem; 
            border-radius: 4px; 
            text-decoration: none; 
            font-weight: 700; 
            border: none; 
            transition: background-color 0.2s; 
            font-size: 0.95rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .btn-logout:hover { 
            background-color: #b91c1c; 
          }
          
          /* CONTENEDOR PRINCIPAL */
          .dashboard-main {
            width: 100%;
            max-width: 1400px; 
            margin: 0 auto; 
            padding: 0 5% 3rem 5%;
          }

          /* REJILLA PROPORCIONAL */
          .dash-grid { 
            display: grid; 
            grid-template-columns: 380px minmax(0, 1fr); 
            gap: 2.5rem; 
            align-items: start; 
          }
          
          /* TARJETAS */
          .card { 
            background: white; 
            padding: 2.5rem; 
            border-radius: 6px; 
            box-shadow: 0 4px 6px rgba(0,0,0,0.05); 
            border: 1px solid #eaeaea; 
            border-top: 4px solid #EA580C; 
          }
          .card-title { 
            margin-top: 0; 
            color: #004b87; 
            font-size: 1.4rem; 
            font-weight: 800;
            border-bottom: 2px solid #f8fafc; 
            padding-bottom: 1rem; 
            margin-bottom: 2rem; 
          }
          
          /* FORMULARIO MEJORADO */
          .form-group { margin-bottom: 1.5rem; }
          .form-label { display: block; font-size: 0.95rem; font-weight: bold; color: #555555; margin-bottom: 0.6rem; }
          
          /* NUEVO: ESTILO PARA EL INPUT DE TEXTO */
          .form-input {
            width: 100%; 
            padding: 1rem 1.2rem; 
            border-radius: 6px; 
            border: 1px solid #cbd5e1; 
            font-size: 0.95rem; 
            background-color: #ffffff; 
            color: #1e293b; 
            transition: all 0.2s ease; 
            font-family: inherit;
          }
          .form-input:focus {
            outline: none; 
            border-color: #EA580C; 
            box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.1); 
          }

          .form-select { 
            width: 100%; 
            padding: 1rem 1.2rem; 
            border-radius: 6px; 
            border: 1px solid #cbd5e1; 
            font-size: 0.95rem; 
            background-color: #ffffff; 
            color: #1e293b; 
            cursor: pointer; 
            transition: all 0.2s ease; 
            font-family: inherit;
            appearance: none; 
            background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23004b87%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
            background-repeat: no-repeat;
            background-position: right 1rem top 50%;
            background-size: 0.65rem auto;
          }
          .form-select:hover { border-color: #004b87; }
          .form-select:focus { 
            outline: none; 
            border-color: #EA580C; 
            box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.1); 
          }
          
          .price-display { background-color: #f8fafc; padding: 1.5rem; border-radius: 6px; border: 1px dashed #cbd5e1; display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
          
          .btn-submit { 
            width: 100%; 
            padding: 1.1rem; 
            background-color: #EA580C; 
            color: white; 
            border: none; 
            border-radius: 6px; 
            font-weight: 700; 
            font-size: 1.05rem; 
            cursor: pointer; 
            transition: background-color 0.2s, transform 0.1s; 
          }
          .btn-submit:hover { background-color: #C2410C; }
          .btn-submit:active { transform: scale(0.98); }
          
          /* HISTORIAL LISTA */
          .history-list { list-style: none; padding: 0; margin: 0; }
          .history-item { border: 1px solid #eaeaea; margin-bottom: 1.2rem; padding: 1.5rem; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; transition: box-shadow 0.2s; background-color: #ffffff; }
          .history-item:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.05); border-color: #cbd5e1; }
          .item-meta { color: #555555; font-size: 0.95rem; margin-top: 0.4rem; display: flex; gap: 1.5rem; flex-wrap: wrap; }
          
          /* BADGES DE ESTADO */
          .status-badge { padding: 0.5rem 1.2rem; border-radius: 4px; font-weight: 700; font-size: 0.9rem; letter-spacing: 0.3px; }
          .status-entregado { background-color: #dcfce7; color: #166534; }
          .status-transito { background-color: #dbeafe; color: #1e40af; }
          .status-pendiente { background-color: #ffedd5; color: #9a3412; }

          @media (max-width: 950px) {
            .dash-grid { grid-template-columns: 1fr; }
            .history-item { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
            .dash-header { flex-direction: column; text-align: center; }
            .card { padding: 1.5rem; }
          }
        `}
      </style>

      <div className="header-wrapper">
        <header className="dash-header">
          <h2>SkyShip Express - Portal Cliente</h2>
          <div className="header-actions">
            {isAdmin && (
              <button onClick={() => navigate('/admin')} className="btn-admin">
                Panel Admin
              </button>
            )}
            <button onClick={cerrarSesion} className="btn-logout">
              Cerrar Sesión
            </button>
          </div>
        </header>
      </div>

      <main className="dashboard-main">
        <div className="dash-grid">
          
          {/* COLUMNA IZQUIERDA: FORMULARIO */}
          <div className="card" style={{ position: 'sticky', top: '2rem' }}>
            <h3 className="card-title">Generar Nueva Guía</h3>
            
            <form onSubmit={manejarCrearEnvio}>
              <div className="form-group">
                <label className="form-label">Región (Define la tarifa):</label>
                <select 
                  className="form-select"
                  value={destino}
                  onChange={(e) => setDestino(e.target.value)}
                  required
                >
                  {Object.keys(tarifas).map((opcion) => (
                    <option key={opcion} value={opcion}>{opcion}</option>
                  ))}
                </select>
              </div>

              {/* NUEVO CAMPO: Dirección Exacta */}
              <div className="form-group">
                <label className="form-label">Dirección exacta de entrega:</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="Ej. 4ta Avenida 3-20, Zona 1, Casa Blanca"
                  value={direccionExacta}
                  onChange={(e) => setDireccionExacta(e.target.value)}
                  required
                />
              </div>
              
              <div className="price-display">
                <span style={{ color: '#555555', fontWeight: 'bold' }}>Tarifa del sistema:</span>
                <span style={{ color: '#000000', fontSize: '1.8rem', fontWeight: '900' }}>Q{costoCalculado.toFixed(2)}</span>
              </div>
              
              <button type="submit" className="btn-submit">
                Emitir Guía de Envío
              </button>
            </form>
          </div>

          {/* COLUMNA DERECHA: HISTORIAL */}
          <div className="card">
            <h3 className="card-title">Mi Historial Logístico</h3>
            
            {envios.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: '#94a3b8' }}>
                <p style={{ fontSize: '1.1rem' }}>Aún no has generado ninguna guía de envío.</p>
              </div>
            ) : (
              <ul className="history-list">
                {envios.map(envio => (
                  <li key={envio._id} className="history-item">
                    <div>
                      <strong style={{ fontSize: '1.3rem', color: '#004b87', display: 'block', marginBottom: '0.4rem' }}>
                        {envio.guia}
                      </strong>
                      <div className="item-meta">
                        {/* Se mostrará "Región | Dirección" tal cual lo enviamos */}
                        <span>Destino: <strong>{envio.destino}</strong></span>
                        <span>Costo: <strong>Q{envio.costoEstimado.toFixed(2)}</strong></span>
                      </div>
                      <div style={{ color: '#888888', fontSize: '0.9rem', marginTop: '0.8rem' }}>
                        Creado: {formatearFecha(envio.fechaCreacion)}
                      </div>
                    </div>
                    
                    <div>
                      <span className={`status-badge ${
                        envio.estado === 'Entregado' ? 'status-entregado' 
                        : envio.estado === 'En tránsito' ? 'status-transito' 
                        : 'status-pendiente'
                      }`}>
                        {envio.estado}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </main>
    </>
  );
}

export default Dashboard;