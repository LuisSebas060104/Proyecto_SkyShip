const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 

const auth = require('../middleware/authMiddleware');

router.post('/registro', async (req, res) => {
  try {
    // Extraemos los datos que vienen del frontend (o de Postman)
    const { nombreCompleto, correo, telefono, direccion, password } = req.body;

    // 1. Verificamos si el usuario ya existe en la base de datos
    let user = await User.findOne({ correo });
    if (user) {
      return res.status(400).json({ mensaje: 'El usuario ya está registrado' });
    }

    // 2. Creamos una nueva instancia del usuario (el molde se llena)
    user = new User({
      nombreCompleto,
      correo,
      telefono,
      direccion,
      password
    });

    // 3. Guardamos en la base de datos (¡Aquí se dispara el hook de Bcrypt automáticamente!)
    await user.save();

    // 4. Respondemos éxito
    res.status(201).json({ mensaje: 'Usuario registrado exitosamente en SkyShip Express' });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: 'Error interno del servidor',
      error: error.message || error
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { correo, password } = req.body;

    // 1. Verificamos si el usuario existe (buscamos por correo)
    const user = await User.findOne({ correo });
    if (!user) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas' }); // Mensaje genérico por seguridad
    }

    // 2. Comparamos la contraseña plana con el hash de la base de datos
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas' });
    }

    // 3. Si todo es correcto, armamos el "Payload" del Token
    // Aquí guardamos el ID y el Rol para saber qué permisos darle después
    const payload = {
      user: {
        id: user.id,
        rol: user.rol
      }
    };

    // 4. Firmamos y generamos el Token
    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Nuestra llave secreta del .env
      { expiresIn: '2h' },    // El token expirará en 2 horas por seguridad
      (error, token) => {
        if (error) throw error;
        res.json({ 
            mensaje: 'Inicio de sesión exitoso',
            token: token 
        });
      }
    );

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

router.get('/usuarios', auth, async (req, res) => {
  try {
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'Acceso denegado. No eres administrador.' });
    }
    // Buscamos todos los usuarios, pero excluimos el campo password por seguridad
    const usuarios = await User.find().select('-password');
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener los usuarios' });
  }
});

// Ruta: DELETE /api/auth/usuarios/:id
// Descripción: Elimina una cuenta de usuario (Solo Administradores)
router.delete('/usuarios/:id', auth, async (req, res) => {
  try {
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'Acceso denegado.' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Usuario eliminado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar el usuario' });
  }
});

module.exports = router;