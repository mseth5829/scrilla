'use strict';
module.exports = function(sequelize, DataTypes) {
  var scenario = sequelize.define('scenario', {
    name: DataTypes.STRING,
    ticker: DataTypes.STRING,
    ebitdaArray: DataTypes.STRING,
    waccArray: DataTypes.STRING,
    grArray: DataTypes.STRING,
    finalYearEbitda: DataTypes.STRING,
    finalYearUFCF: DataTypes.STRING,
    ebitdaMultiple: DataTypes.STRING,
    perpetuityGrowthRate: DataTypes.STRING,
    pvEbitdaMethod: DataTypes.STRING,
    evForEbitdaMethod: DataTypes.STRING,
    terminalPerpetuityValue: DataTypes.STRING,
    pvPerpetuityMethod: DataTypes.STRING,
    evForPerpetuityMethod: DataTypes.STRING,
    totalPV: DataTypes.STRING,
    userId: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        models.scenario.belongsTo(models.user);
      }
    }
  });
  return scenario;
};

// sequelize model:create --name scenario --attributes name:string,ticker:string,ebitdaArray:string,waccArray:string,grArray:string,finalYearEbitda:string,finalYearUFCF:string,ebitdaMultiple:string,perpetuityGrowthRate:string,pvEbitdaMethod:string,evForEbitdaMethod:string,terminalPerpetuityValue:string,pvPerpetuityMethod:string,evForPerpetuityMethod:string,totalPV:string,userId:string
