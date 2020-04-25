'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      },
      unique: true
    },
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    contact: DataTypes.STRING,
    verified: DataTypes.BOOLEAN,
    token:{
      type: DataTypes.STRING,
      unique: true
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
