module.exports = (sequelize, DataTypes) => {
  const Vehicle = sequelize.define('Vehicle', {
    marca: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    modelo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    año: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    precio_dia: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Disponible',
    },
    imagen_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'vehicles',
  });

  Vehicle.associate = function(models) {
    Vehicle.hasMany(models.Reservation, { foreignKey: 'id_vehiculo' });
  };

  return Vehicle;
};