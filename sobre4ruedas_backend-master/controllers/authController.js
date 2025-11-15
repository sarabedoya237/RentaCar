const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your-secret-key'; // Cambia esto por una clave secreta más segura en producción

exports.register = async (req, res) => {
  try {
    const { nombre, email, contraseña, rol } = req.body;

    // Validar que el rol sea válido
    const validRoles = ['Administrador', 'Cliente'];
    const userRole = rol && validRoles.includes(rol) ? rol : 'Cliente';

    // Verificar si el email ya está registrado
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Crear el usuario
    const user = await User.create({
      nombre,
      email,
      contraseña: hashedPassword,
      rol: userRole,
    });

    res.status(201).json({ message: 'Usuario registrado exitosamente', userId: user.id_usuario });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, contraseña } = req.body;

    // Buscar el usuario por email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(contraseña, user.contraseña);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    // Generar un token JWT
    const token = jwt.sign(
      { id_usuario: user.id_usuario, rol: user.rol },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login exitoso', token, user: { id_usuario: user.id_usuario, nombre: user.nombre, rol: user.rol } });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: error.message });
  }
};