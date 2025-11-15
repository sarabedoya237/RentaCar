module.exports = (sequelize, DataTypes) => {
  const Reservation = sequelize.define('Reservation', {
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_vehiculo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha_inicio: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    fecha_fin: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Pendiente',
    },
  }, {
    tableName: 'reservations',
  });

  Reservation.associate = function(models) {
    Reservation.belongsTo(models.Vehicle, { foreignKey: 'id_vehiculo' });
    Reservation.belongsTo(models.User, { foreignKey: 'id_usuario' });
  };

  return Reservation;
};