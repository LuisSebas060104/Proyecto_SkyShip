const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

// Middlewares
app.use(express.json());

const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';

// Configuración de CORS para darle acceso libre a React
app.use(cors({
  origin: allowedOrigin, // La dirección exacta de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-auth-token'] // Los gafetes que permitimos
}));

// Rutas de la API
app.use('/api/contact', require('./routes/contact'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/shipments', require('./routes/shipment'));



// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado a SkyShip DB en MongoDB Atlas'))
    .catch(err => console.error('Error de conexión:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));