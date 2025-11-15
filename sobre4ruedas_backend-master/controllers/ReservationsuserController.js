const models = require('../models');
const { Reservation, Vehicle } = models;

exports.getMyReservations = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: 'Usuario no autenticado' });

    const { estado, page = 1, limit = 50 } = req.query;
    const where = { id_usuario: userId };
    if (estado) where.estado = estado;

    const parsedLimit = Math.max(1, parseInt(limit, 10) || 50);
    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const offset = (parsedPage - 1) * parsedLimit;

    const { rows: reservations, count } = await Reservation.findAndCountAll({
      where,
      include: [
        { model: Vehicle, attributes: ['id', 'marca', 'modelo', 'placa'], required: false }
      ],
      order: [['createdAt', 'DESC']],
      limit: parsedLimit,
      offset
    });

    return res.json({
      reservations,
      meta: { total: count, page: parsedPage, limit: parsedLimit, pages: Math.max(1, Math.ceil(count / parsedLimit)) }
    });
  } catch (err) {
    console.error('getMyReservations error:', err);
    return res.status(500).json({ error: 'Error al obtener reservas' });
  }
};
