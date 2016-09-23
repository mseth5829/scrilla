'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('scenarios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      ticker: {
        type: Sequelize.STRING
      },
      ebitdaArray: {
        type: Sequelize.STRING
      },
      waccArray: {
        type: Sequelize.STRING
      },
      grArray: {
        type: Sequelize.STRING
      },
      finalYearEbitda: {
        type: Sequelize.STRING
      },
      finalYearUFCF: {
        type: Sequelize.STRING
      },
      ebitdaMultiple: {
        type: Sequelize.STRING
      },
      perpetuityGrowthRate: {
        type: Sequelize.STRING
      },
      pvEbitdaMethod: {
        type: Sequelize.STRING
      },
      evForEbitdaMethod: {
        type: Sequelize.STRING
      },
      terminalPerpetuityValue: {
        type: Sequelize.STRING
      },
      pvPerpetuityMethod: {
        type: Sequelize.STRING
      },
      evForPerpetuityMethod: {
        type: Sequelize.STRING
      },
      totalPV: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('scenarios');
  }
};