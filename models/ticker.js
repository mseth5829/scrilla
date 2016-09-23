'use strict';
module.exports = function(sequelize, DataTypes) {
  var ticker = sequelize.define('ticker', {
    name: DataTypes.STRING,
    ticker: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return ticker;
};
