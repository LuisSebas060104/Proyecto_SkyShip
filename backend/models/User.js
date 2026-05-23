const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nombreCompleto: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  telefono: { type: String, required: true },
  direccion: { type: String, required: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ['cliente', 'admin'], default: 'cliente' }
}, { timestamps: true });

// Este es el bloque que encripta antes de guardar
// Este es el bloque que encripta antes de guardar (Versión Moderna)
userSchema.pre('save', async function() {
  // Si la contraseña no ha sido modificada, simplemente hacemos return
  if (!this.isModified('password')) return;
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);