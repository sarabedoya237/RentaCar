// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Cargar variables de entorno

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('Encabezado Authorization:', authHeader); // Depuración

  const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer <token>"
  if (!token) {
    console.log('Token no proporcionado');
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'tu_clave_secreta_123', (err, user) => {
    if (err) {
      console.error('Error al verificar token:', err.message); // Depuración
      return res.status(403).json({ error: 'Token inválido o expirado' });
    }
    console.log('Usuario decodificado:', user); // Depuración
    req.user = user;
    next();
  });
};

const authorizeRole = (roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.rol)) {
    return res.status(403).json({ error: 'Acceso denegado: Rol insuficiente' });
  }
  next();
};

module.exports = { authenticateToken, authorizeRole };