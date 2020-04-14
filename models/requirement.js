'use strict';
module.exports = (sequelize, DataTypes) => {
  const Requirement = sequelize.define('Requirement', {
    name: DataTypes.STRING,
    quantity: DataTypes.DOUBLE,
    email: DataTypes.STRING,
    contact: DataTypes.STRING,
    latitude: DataTypes.DOUBLE,
    longitude: DataTypes.DOUBLE,
    canBuy: DataTypes.BOOLEAN,
    resolved: DataTypes.BOOLEAN,
    connected: DataTypes.BOOLEAN,
  }, {});
  Requirement.associate = function(models) {
    // associations can be defined here
    Requirement.belongsTo(models.PPEType, {
      onDelete: "SET NULL",
      foreignKey: {
        allowNull: true
      }
    });
    Requirement.belongsTo(models.Proof, {
      onDelete: "SET NULL",
      foreignKey: {
        allowNull: true
      }
    });
  };
  return Requirement;
};
