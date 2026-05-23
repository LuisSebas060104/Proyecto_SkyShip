const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// Ruta: POST /api/contact
// Descripción: Guarda un nuevo mensaje de contacto en la base de datos
router.post('/', async (req, res) => {
  try {
    const { nombre, correo, mensaje } = req.body;
    
    const nuevoMensaje = new Contact({ nombre, correo, mensaje });
    await nuevoMensaje.save(); // ¡Magia, guardado en MongoDB!
    
    res.status(201).json({ mensaje: 'Mensaje de contacto guardado con éxito' });
  } catch (error) {
    console.error("Error al guardar contacto:", error);
    res.status(500).json({ mensaje: 'Hubo un error al enviar tu mensaje' });
  }
});

module.exports = router;