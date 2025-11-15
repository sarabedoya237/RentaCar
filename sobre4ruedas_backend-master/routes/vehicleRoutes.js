const express = require('express');
const router = express.Router();
const { Vehicle } = require('../models');

// GET /api/vehicles - Obtener todos los vehículos (público)
router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll();
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener vehículos' });
  }
});

// POST /api/admin/vehicles - Crear un nuevo vehículo (solo admin)
router.post('/', async (req, res) => {
  try {
    const { marca, modelo, año, tipo, precio_dia, estado } = req.body;
    const vehicle = await Vehicle.create({
      marca,
      modelo,
      año,
      tipo,
      precio_dia,
      estado: estado || 'Disponible',
    });
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear vehículo' });
  }
});

// PUT /api/admin/vehicles/:id - Actualizar un vehículo (solo admin)
router.put('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }
    await vehicle.update(req.body);
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar vehículo' });
  }
});

// DELETE /api/admin/vehicles/:id - Eliminar un vehículo (solo admin)
router.delete('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }
    await vehicle.destroy();
    res.json({ message: 'Vehículo eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar vehículo' });
  }
});

module.exports = router;