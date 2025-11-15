module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    contraseña: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rol: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Cliente',
    },
  }, {
    tableName: 'users',
  });

  User.associate = function(models) {
    User.hasMany(models.Reservation, { foreignKey: 'id_usuario' });
  };

  return User;
};