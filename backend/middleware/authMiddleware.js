const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ mensaje: 'No hay token, permiso denegado para operar en SkyShip' });
  }

  try {
    const cifrado = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = cifrado.user;
    next(); 
  } catch (error) {
    res.status(401).json({ mensaje: 'Token corrupto o expirado' });
  }
};