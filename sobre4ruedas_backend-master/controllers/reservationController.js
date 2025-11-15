const { Reservation, Vehicle, User } = require('../models');

exports.createReservation = async (req, res) => {
  try {
    console.log('Iniciando creación de reserva...');
    console.log('Datos recibidos:', req.body);

    const { id_vehiculo, fecha_inicio, fecha_fin, estado } = req.body;
    const id_usuario = req.user.id_usuario; // Obtener id_usuario del token

    // Verificar si el vehículo existe
    const vehicle = await Vehicle.findByPk(id_vehiculo);
    console.log('Vehículo encontrado:', vehicle);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }

    // Verificar si el vehículo ya está reservado
    if (vehicle.estado === 'Alquilado') {
      return res.status(400).json({ error: 'El vehículo ya está reservado' });
    }

    // Verificar si el usuario existe
    const user = await User.findByPk(id_usuario);
    console.log('Usuario encontrado:', user);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Crear la reserva
    console.log('Creando reserva con datos:', { id_usuario, id_vehiculo, fecha_inicio, fecha_fin, estado });
    const reservation = await Reservation.create({
      id_usuario,
      id_vehiculo,
      fecha_inicio,
      fecha_fin,
      estado,
    });

    // Actualizar el estado del vehículo a "Alquilado"
    await vehicle.update({ estado: 'Alquilado' });

    console.log('Reserva creada exitosamente:', reservation);
    res.status(201).json(reservation);
  } catch (error) {
    console.error('Error al crear reserva:', error);
    res.status(500).json({ error: error.message });
  }

  // exports.getAllReservations = async (req, res) => {
  //   try {
  //     const reservations = await Reservation.findAll({
  //       include: [
  //         { model: User, attributes: ['id_usuario', 'nombre'] },
  //         { model: Vehicle, attributes: ['id_vehiculo', 'marca', 'modelo'] },
  //       ],
  //     });
  //     res.json(reservations);
  //   } catch (error) {
  //     console.error('Error al obtener reservas:', error);
  //     res.status(500).json({ error: error.message });
  //   }}

};
