const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const sequelize = require('../config/database'); // Usar la configuración de database.js
const db = {};

fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Establecer asociaciones entre modelos
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Exportar los modelos principales explícitamente
db.User = db['User'];
db.Vehicle = db['Vehicle'];
db.Reservation = db['Reservation'];

// Exportar el objeto sequelize y Sequelize
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;