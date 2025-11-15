const { Vehicle } = require('../models');

exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll();
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createVehicle = async (req, res) => {
  try {
    const { marca, modelo, año, tipo, precio_dia, estado } = req.body;
    const vehicle = await Vehicle.create({
      marca,
      modelo,
      año,
      tipo,
      precio_dia,
      estado,
    });
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};