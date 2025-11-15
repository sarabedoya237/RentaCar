const express = require('express');
const sequelize = require('./config/database'); // Usar database.js
const vehicleRoutes = require('./routes/vehicleRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const authRoutes = require('./routes/authRoutes');
const models = require('./models'); // Importamos el objeto db
const { User, Vehicle, Reservation } = models; // Desestructuramos los modelos
const cors = require('cors');
const { authenticateToken, authorizeRole } = require('./middleware/authMiddleware');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Montar rutas de autenticación (no protegidas)
app.use('/api/auth', authRoutes);

// Montar rutas públicas (no requieren autenticación)
app.use('/api/vehicles', vehicleRoutes);

app.use('/api/reservations', require('./routes/ReservationUserRoutes'));


// Montar rutas protegidas solo para administradores
app.use('/api/admin/vehicles', authenticateToken, authorizeRole(['Administrador']), vehicleRoutes);
app.use('/api/admin/reservations', authenticateToken, authorizeRole(['Administrador']), reservationRoutes);

// Montar rutas protegidas para clientes (por ejemplo, crear reservas)
app.use('/api/reservations', authenticateToken, reservationRoutes);

// Ruta de prueba para verificar la conexión
app.get('/', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.send('¡Conexión a MySQL exitosa!');
  } catch (error) {
    res.status(500).send('Error en la conexión: ' + error.message);
  }
})

sequelize.sync({ force: false }).then(async () => {
  console.log('Tablas creadas en la base de datos');

   //Crear un administrador por defecto
   const bcrypt = require('bcrypt');
   await User.create({
     nombre: 'julian',
     email: 'johnanacona65@gamil.com',
     contraseña: await bcrypt.hash('admin123', 10),
     rol: 'Administrador',
   });

  // // Crear un cliente por defecto
  // await User.create({
  //   nombre: 'Juan Pérez',
  //   email: 'juan@example.com',
  //   contraseña: await bcrypt.hash('contraseña123', 10),
  //   rol: 'Cliente',
  // });

  // // Crear vehículos con imágenes
  // await Vehicle.create({
  //   marca: 'Toyota',
  //   modelo: 'Corolla',
  //   año: 2020,
  //   tipo: 'Sedan',
  //   precio_dia: 50.00,
  //   estado: 'Disponible',
  //   imagen_url: 'https://via.placeholder.com/300x200?text=Toyota+Corolla',
  // });
  // await Vehicle.create({
  //   marca: 'Honda',
  //   modelo: 'Civic',
  //   año: 2019,
  //   tipo: 'Sedan',
  //   precio_dia: 45.00,
  //   estado: 'Disponible',
  //   imagen_url: 'https://via.placeholder.com/300x200?text=Honda+Civic',
  // });
  // await Vehicle.create({
  //   marca: 'Ford',
  //   modelo: 'Focus',
  //   año: 2021,
  //   tipo: 'Hatchback',
  //   precio_dia: 55.00,
  //   estado: 'Alquilado',
  //   imagen_url: 'https://via.placeholder.com/300x200?text=Ford+Focus',
  // });

  console.log('Datos iniciales creados');
}).catch(error => {
  console.error('Error al sincronizar:', error);
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});