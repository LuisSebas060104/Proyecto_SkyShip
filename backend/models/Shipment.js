const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  guia: { type: String, required: true, unique: true }, // Código de rastreo
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Amarra el paquete a tu usuario
  destino: { type: String, required: true },
  costoEstimado: { type: Number, required: true },
  estado: { 
    type: String, 
    enum: ['Pendiente', 'En tránsito', 'Entregado'], 
    default: 'Pendiente' 
  },
  fechaCreacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Shipment', shipmentSchema);