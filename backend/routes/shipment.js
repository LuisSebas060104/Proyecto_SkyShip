const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); 
const Shipment = require('../models/Shipment'); 

router.get('/todos', auth, async (req, res) => {
  try {
    // Verificamos el nivel de poder
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'Acceso denegado. Solo personal logístico.' });
    }
    
    // El .populate() es magia pura: en lugar de devolvernos solo el ID raro del cliente, 
    // va a buscar su correo a la base de datos de usuarios y nos lo trae adjunto.
    const todosLosEnvios = await Shipment.find()
      .populate('cliente', 'correo') 
      .sort({ fechaCreacion: -1 });
      
    res.json(todosLosEnvios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener la base de datos de envíos' });
  }
});

router.post('/crear', auth, async (req, res) => {
  try {
    const { destino, costoEstimado } = req.body;

    const guiaTracker = 'SKY-' + Math.floor(Math.random() * 10000000);

    const nuevoEnvio = new Shipment({
      guia: guiaTracker,
      cliente: req.user.id, 
      destino,
      costoEstimado
    });

    const envioGuardado = await nuevoEnvio.save();
    res.status(201).json({
      mensaje: 'Envío creado con éxito',
      envio: envioGuardado
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear el envío' });
  }
});


router.get('/mis-envios', auth, async (req, res) => {
  try {
    const envios = await Shipment.find({ cliente: req.user.id }).sort({ fechaCreacion: -1 });
    res.json(envios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener el historial' });
  }
});

router.put('/estado/:id', auth, async (req, res) => {
  try {
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'Acceso denegado. Solo personal de logística de SkyShip.' });
    }

    const { estado } = req.body;

    const estadosValidos = ['Pendiente', 'En tránsito', 'Entregado'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ mensaje: 'Estado logístico no válido' });
    }

    let envio = await Shipment.findById(req.params.id);
    if (!envio) {
      return res.status(404).json({ mensaje: 'Guía de envío no encontrada' });
    }

    envio.estado = estado;
    await envio.save();

    res.json({
      mensaje: 'Estado del paquete actualizado exitosamente',
      envio
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el estado' });
  }
});




router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'Acceso denegado.' });
    }
    
    await Shipment.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Paquete eliminado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar el paquete' });
  }
});

module.exports = router;