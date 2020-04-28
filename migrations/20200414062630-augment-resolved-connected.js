'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'Availabilities',
      'resolved',
      {
        type: Sequelize.BOOLEAN
      }
    );
    await queryInterface.addColumn(
      'Availabilities',
      'connected',
      {
        type: Sequelize.BOOLEAN
      }
    );

    await queryInterface.addColumn(
      'Requirements',
      'resolved',
      {
        type: Sequelize.BOOLEAN
      }
    );
    await queryInterface.addColumn(
      'Requirements',
      'connected',
      {
        type: Sequelize.BOOLEAN
      }
    );

    await queryInterface.addColumn(
      'Manufacturings',
      'resolved',
      {
        type: Sequelize.BOOLEAN
      }
    );
    return queryInterface.addColumn(
      'Manufacturings',
      'connected',
      {
        type: Sequelize.BOOLEAN
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'Availabilities',
      'resolved'
    );
    await queryInterface.removeColumn(
      'Availabilities',
      'connected'
    );

    await queryInterface.removeColumn(
      'Requirements',
      'resolved'
    );
    await queryInterface.removeColumn(
      'Requirements',
      'connected'
    );

    await queryInterface.removeColumn(
      'Manufacturings',
      'resolved'
    );
    return queryInterface.removeColumn(
      'Manufacturings',
      'connected'
    );
  }
};
