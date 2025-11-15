// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Cargar variables de entorno
const { User } = require('../models');

// Ruta para login
router.post('/login', async (req, res) => {
  try {
    const { email, contraseña } = req.body;
    if (!email || !contraseña) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(contraseña, user.contraseña);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET || 'tu_clave_secreta_123',
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol },
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Ruta para registro
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, contraseña, rol } = req.body;
    if (!nombre || !email || !contraseña) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const user = await User.create({
      nombre,
      email,
      contraseña: hashedPassword,
      rol: rol || 'Cliente',
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET || 'tu_clave_secreta_123',
      { expiresIn: '1h' }
    );

    res.status(201).json({
      token,
      user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol },
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;