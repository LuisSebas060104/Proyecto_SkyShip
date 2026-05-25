import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [envios, setEnvios] = useState([]);
  const [usuarios, setUsuarios] = useState([]); 
  const [contactos, setContactos] = useState([]); // NUEVO ESTADO PARA CONTACTOS
  const [vistaActiva, setVistaActiva] = useState('guias'); // 'guias', 'usuarios' o 'contactos'
  const navigate = useNavigate();

  useEffect(() => {
    const traerDatosDelSistema = async () => {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      try {
        const apiUrl = import.meta.env.VITE_API_URL;

        // 1. Traer Envíos
        const resEnvios = await axios.get(`${apiUrl}/api/shipments/todos`, {
          headers: { 'x-auth-token': token }
        });
        setEnvios(resEnvios.data);

        // 2. Traer Usuarios
        const resUsuarios = await axios.get(`${apiUrl}/api/auth/usuarios`, {
          headers: { 'x-auth-token': token }
        });
        setUsuarios(resUsuarios.data);

        // 3. Traer Contactos Comerciales (Ajusta la URL si en tu backend se llama distinto)
        const resContactos = await axios.get(`${apiUrl}/api/contactos`, {
          headers: { 'x-auth-token': token }
        });
        setContactos(resContactos.data);

      } catch (error) {
        console.error("Error cargando datos:", error);
        alert("Acceso denegado o error de conexión.");
        navigate('/dashboard'); 
      }
    };
    traerDatosDelSistema();
  }, [navigate]);

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL;
      await axios.put(`${apiUrl}/api/shipments/estado/${id}`, 
        { estado: nuevoEstado },
        { headers: { 'x-auth-token': token } }
      );
      setEnvios(envios.map(envio => envio._id === id ? { ...envio, estado: nuevoEstado } : envio));
    } catch (error) {
      alert('Error al actualizar estado');
    }
  };

  const eliminarPaquete = async (id) => {
    if (!window.confirm("¿Eliminar esta guía permanentemente?")) return;
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL;
      await axios.delete(`${apiUrl}/api/shipments/${id}`, {
        headers: { 'x-auth-token': token }
      });
      setEnvios(envios.filter(envio => envio._id !== id));
    } catch (error) {
      alert('Error al eliminar');
    }
  };

  const eliminarUsuario = async (id) => {
    if (!window.confirm("¿Dar de baja a este usuario?")) return;
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL;
      await axios.delete(`${apiUrl}/api/auth/usuarios/${id}`, {
        headers: { 'x-auth-token': token }
      });
      setUsuarios(usuarios.filter(usuario => usuario._id !== id));
    } catch (error) {
      alert('Error al eliminar usuario');
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    navigate('/login'); 
  };

  const formatearFecha = (fechaString) => {
    if (!fechaString) return 'Sin fecha';
    const opciones = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(fechaString).toLocaleDateString('es-GT', opciones);
  };

  // Estadísticas
  const stats = {
    total: envios.length,
    pendientes: envios.filter(e => e.estado === 'Pendiente').length,
    transito: envios.filter(e => e.estado === 'En tránsito').length,
    entregados: envios.filter(e => e.estado === 'Entregado').length
  };

  return (
    <>
      <style>{`
        html, body, #root { margin: 0; padding: 0; width: 100%; background-color: #f8fafc; font-family: 'Segoe UI', Roboto, sans-serif; }
        .header-wrapper { width: 100%; background-color: #004b87; border-bottom: 4px solid #EA580C; margin-bottom: 3rem; }
        .dash-header { display: flex; justify-content: space-between; align-items: center; padding: 1.2rem 5%; width: 100%; max-width: 1400px; margin: 0 auto; }
        .dash-header h2 { margin: 0; color: #ffffff !important; font-weight: 900; }
        .btn-nav-top { background-color: #EA580C; color: white; padding: 0.6rem 1.2rem; border-radius: 4px; border: none; font-weight: 700; cursor: pointer; margin-left: 10px; }
        .btn-red { background-color: #dc2626; }
        
        .admin-main { width: 100%; max-width: 1400px; margin: 0 auto; padding: 0 5% 3rem 5%; }
        
        /* GRID DE ESTADISTICAS */
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 3rem; }
        .stat-card { background: white; padding: 1.5rem; border-radius: 6px; border-top: 4px solid #004b87; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .stat-card.warning { border-top-color: #eab308; }
        .stat-card.info { border-top-color: #3b82f6; }
        .stat-card.success { border-top-color: #22c55e; }

        /* MENU DE SECCIONES (TABS) */
        .tabs-container { display: flex; justify-content: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem; border-bottom: 2px solid #e2e8f0; padding-bottom: 1rem; }
        .tab-button { padding: 1rem 2rem; border: none; background: white; border-radius: 6px; cursor: pointer; font-weight: 700; color: #64748b; transition: all 0.3s; border: 1px solid #e2e8f0; }
        .tab-button.active { background: #004b87; color: white; border-color: #004b87; }

        /* TARJETAS DE DATOS */
        .data-card { background: white; padding: 2rem; border-radius: 8px; border-top: 4px solid #EA580C; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .item-row { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; border: 1px solid #f1f5f9; margin-bottom: 1rem; border-radius: 6px; flex-wrap: wrap; gap: 1rem; }
        
        /* ESTILOS PARA CONTACTOS */
        .contacto-card { background: #f8fafc; padding: 1.5rem; border-left: 4px solid #3b82f6; border-radius: 6px; margin-bottom: 1rem; }
        .contacto-header { display: flex; justify-content: space-between; margin-bottom: 0.8rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem; }
        .contacto-mensaje { color: #334155; font-style: italic; background: white; padding: 1rem; border-radius: 4px; border: 1px dashed #cbd5e1; }

        .badge { padding: 0.4rem 0.8rem; border-radius: 4px; font-size: 0.8rem; font-weight: 800; text-transform: uppercase; }
        .badge-admin { background: #004b87; color: white; }
        .badge-client { background: #f1f5f9; color: #475569; }
        
        .btn-action { padding: 0.6rem 1rem; border: none; border-radius: 4px; color: white; font-weight: 700; cursor: pointer; font-size: 0.85rem; }
        .bg-blue { background: #004b87; }
        .bg-green { background: #166534; }
        .bg-red { background: #9B2236; }

        .btn-action:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          filter: grayscale(50%);
        }
      `}</style>

      <div className="header-wrapper">
        <header className="dash-header">
          <h2>SkyShip Express - Administración</h2>
          <div>
            <button onClick={() => navigate('/dashboard')} className="btn-nav-top">Portal Cliente</button>
            <button onClick={cerrarSesion} className="btn-nav-top btn-red">Cerrar Sesión</button>
          </div>
        </header>
      </div>

      <main className="admin-main">
        <div className="stats-grid">
          <div className="stat-card"><div>Total Envíos</div><div style={{fontSize:'2rem', fontWeight:'900'}}>{stats.total}</div></div>
          <div className="stat-card warning"><div>Pendientes</div><div style={{fontSize:'2rem', fontWeight:'900', color:'#eab308'}}>{stats.pendientes}</div></div>
          <div className="stat-card info"><div>En Tránsito</div><div style={{fontSize:'2rem', fontWeight:'900', color:'#3b82f6'}}>{stats.transito}</div></div>
          <div className="stat-card success"><div>Entregados</div><div style={{fontSize:'2rem', fontWeight:'900', color:'#22c55e'}}>{stats.entregados}</div></div>
        </div>

        {/* MENÚ DE PESTAÑAS (AHORA CON 3 BOTONES) */}
        <div className="tabs-container">
          <button 
            className={`tab-button ${vistaActiva === 'guias' ? 'active' : ''}`} 
            onClick={() => setVistaActiva('guias')}
          >
            Gestión Operativa de Guías
          </button>
          <button 
            className={`tab-button ${vistaActiva === 'usuarios' ? 'active' : ''}`} 
            onClick={() => setVistaActiva('usuarios')}
          >
            Control de Usuarios
          </button>
          <button 
            className={`tab-button ${vistaActiva === 'contactos' ? 'active' : ''}`} 
            onClick={() => setVistaActiva('contactos')}
          >
            Contactos Comerciales
          </button>
        </div>

        {/* CONTENIDO CONDICIONAL */}
        <div className="data-card">
          
          {/* VISTA 1: GUÍAS DE ENVÍO */}
          {vistaActiva === 'guias' && (
            <div>
              {envios.length === 0 ? <p style={{textAlign:'center', color:'#64748b'}}>No hay guías registradas.</p> : null}
              {envios.map(envio => (
                <div key={envio._id} className="item-row">
                  <div>
                    <div style={{color:'#004b87', fontWeight:'800', fontSize:'1.2rem'}}>{envio.guia}</div>
                    <div style={{fontSize:'0.9rem', color:'#555'}}>Destino: {envio.destino}</div>
                    <div style={{fontSize:'0.9rem', color:'#555'}}>Cliente: {envio.cliente?.correo}</div>
                    <div style={{fontSize:'0.8rem', fontWeight:'700', marginTop:'5px', color:'#999'}}>Estado: {envio.estado}</div>
                  </div>
                  <div style={{display:'flex', gap:'5px'}}>
                    <button onClick={() => cambiarEstado(envio._id, 'En tránsito')} disabled={envio.estado !== 'Pendiente'} className="btn-action bg-blue">Despachar</button>
                    <button onClick={() => cambiarEstado(envio._id, 'Entregado')} disabled={envio.estado === 'Entregado'} className="btn-action bg-green">Entregado</button>
                    <button onClick={() => eliminarPaquete(envio._id)} className="btn-action bg-red">Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VISTA 2: USUARIOS */}
          {vistaActiva === 'usuarios' && (
            <div>
              {usuarios.length === 0 ? <p style={{textAlign:'center', color:'#64748b'}}>No hay usuarios registrados.</p> : null}
              {usuarios.map(user => (
                <div key={user._id} className="item-row">
                  <div>
                    <span style={{fontWeight:'800', fontSize:'1.1rem'}}>{user.nombreCompleto}</span>
                    <span className={`badge ${user.rol === 'admin' ? 'badge-admin' : 'badge-client'}`} style={{marginLeft:'10px'}}>
                      {user.rol}
                    </span>
                    <div style={{fontSize:'0.9rem', color:'#555', marginTop:'5px'}}>Correo: {user.correo}</div>
                    <div style={{fontSize:'0.9rem', color:'#555'}}>Teléfono: {user.telefono}</div>
                  </div>
                  <button 
                    onClick={() => eliminarUsuario(user._id)} 
                    disabled={user.rol === 'admin'} 
                    className="btn-action bg-red"
                  >
                    Dar de Baja
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* VISTA 3: CONTACTOS COMERCIALES (NUEVA) */}
          {vistaActiva === 'contactos' && (
            <div>
              {contactos.length === 0 ? (
                <p style={{textAlign:'center', color:'#64748b', padding:'2rem'}}>No hay mensajes de contacto comercial por el momento.</p>
              ) : (
                contactos.map(contacto => (
                  <div key={contacto._id} className="contacto-card">
                    <div className="contacto-header">
                      <div>
                        <strong style={{fontSize:'1.1rem', color:'#0f172a'}}>{contacto.nombre}</strong>
                        <div style={{fontSize:'0.9rem', color:'#64748b'}}>✉️ {contacto.correo}</div>
                      </div>
                      <div style={{fontSize:'0.85rem', color:'#94a3b8', fontWeight:'bold'}}>
                        {formatearFecha(contacto.fecha)}
                      </div>
                    </div>
                    <div className="contacto-mensaje">
                      "{contacto.mensaje}"
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      </main>
    </>
  );
}

export default AdminDashboard;
