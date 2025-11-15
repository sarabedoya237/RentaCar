// routes/reservationRoutes.js
const express = require('express');
const router = express.Router();
const { Reservation, Vehicle, User } = require('../models');
const sequelize = require('../config/database'); // Importamos la instancia de sequelize
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// Middleware para validar fechas
const validateDates = (fecha_inicio, fecha_fin) => {
  const start = new Date(fecha_inicio);
  const end = new Date(fecha_fin);
  const today = new Date();

  if (isNaN(start) || isNaN(end)) {
    return { valid: false, error: 'Fechas inválidas' };
  }
  if (start < today.setHours(0, 0, 0, 0)) {
    return { valid: false, error: 'La fecha de inicio no puede ser anterior a hoy' };
  }
  if (end <= start) {
    return { valid: false, error: 'La fecha de fin debe ser posterior a la fecha de inicio' };
  }
  return { valid: true };
};

// Servicio para verificar disponibilidad del vehículo
const checkVehicleAvailability = async (id_vehiculo, fecha_inicio, fecha_fin) => {
  const overlappingReservations = await Reservation.findAll({
    where: {
      id_vehiculo,
      estado: { [Op.notIn]: ['Cancelada', 'Rechazada'] },
      [Op.or]: [
        {
          fecha_inicio: { [Op.between]: [fecha_inicio, fecha_fin] },
        },
        {
          fecha_fin: { [Op.between]: [fecha_inicio, fecha_fin] },
        },
        {
          [Op.and]: [
            { fecha_inicio: { [Op.lte]: fecha_inicio } },
            { fecha_fin: { [Op.gte]: fecha_fin } },
          ],
        },
      ],
    },
  });

  return overlappingReservations.length === 0;
};

// GET /api/admin/reservations - Obtener todas las reservas (solo admin)
router.get('/', async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      include: [
        { model: Vehicle, attributes: ['marca', 'modelo'] },
        { model: User, attributes: ['nombre', 'email'] },
      ],
    });
    res.json(reservations);
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
});

// POST /api/reservations - Crear una nueva reserva (clientes autenticados)
router.post('/', async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    console.log('Solicitud recibida:', req.body); // Depuración
    const { id_vehiculo, fecha_inicio, fecha_fin, estado } = req.body;

    // Validar que req.user esté presente
    if (!req.user || !req.user.id) {
      await transaction.rollback();
      return res.status(401).json({ error: 'Usuario no autenticado o ID no disponible' });
    }
    const userId = req.user.id;

    // Validar campos requeridos
    if (!id_vehiculo || !fecha_inicio || !fecha_fin) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Faltan campos requeridos (id_vehiculo, fecha_inicio, fecha_fin)' });
    }

    // Validar fechas
    const dateValidation = validateDates(fecha_inicio, fecha_fin);
    if (!dateValidation.valid) {
      await transaction.rollback();
      return res.status(400).json({ error: dateValidation.error });
    }

    // Verificar si el vehículo existe
    const vehicle = await Vehicle.findByPk(id_vehiculo, { transaction });
    if (!vehicle) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }

    // Verificar disponibilidad del vehículo
    const isAvailable = await checkVehicleAvailability(id_vehiculo, fecha_inicio, fecha_fin);
    if (!isAvailable) {
      await transaction.rollback();
      return res.status(400).json({ error: 'El vehículo no está disponible en el rango de fechas solicitado' });
    }

    // Crear la reserva
    const reservation = await Reservation.create(
      {
        id_usuario: userId,
        id_vehiculo,
        fecha_inicio,
        fecha_fin,
        estado: estado || 'Pendiente',
      },
      { transaction }
    );

    // Actualizar el estado del vehículo
    await vehicle.update({ estado: 'Alquilado' }, { transaction });

    await transaction.commit();
    res.status(201).json(reservation);
  } catch (error) {
    await transaction.rollback();
    console.error('Error al crear reserva:', error); // Depuración detallada
    res.status(500).json({ error: 'Error al crear reserva' });
  }
});

// PUT /api/admin/reservations/:id/approve - Aprobar una reserva (solo admin)
router.put('/:id/approve', async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    await reservation.update({ estado: 'Aprobada' });
    res.json(reservation);
  } catch (error) {
    console.error('Error al aprobar reserva:', error);
    res.status(500).json({ error: 'Error al aprobar reserva' });
  }
});

// PUT /api/admin/reservations/:id/reject - Rechazar una reserva (solo admin)
router.put('/:id/reject', async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    const vehicle = await Vehicle.findByPk(reservation.id_vehiculo);
    await reservation.update({ estado: 'Rechazada' });
    if (vehicle) {
      await vehicle.update({ estado: 'Disponible' });
    }
    res.json(reservation);
  } catch (error) {
    console.error('Error al rechazar reserva:', error);
    res.status(500).json({ error: 'Error al rechazar reserva' });
  }
});

// DELETE /api/admin/reservations/:id - Cancelar una reserva (solo admin)
router.delete('/:id', async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    const vehicle = await Vehicle.findByPk(reservation.id_vehiculo);
    await reservation.destroy();
    if (vehicle) {
      await vehicle.update({ estado: 'Disponible' });
    }
    res.json({ message: 'Reserva cancelada' });
  } catch (error) {
    console.error('Error al cancelar reserva:', error);
    res.status(500).json({ error: 'Error al cancelar reserva' });
  }
});

module.exports = router;