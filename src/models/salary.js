"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Salary extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Salary.belongsTo(models.User, {
                foreignKey: 'userId',
                // targetKey: "userId",
                as: 'salaryData'
            });
        }
    }
    Salary.init(
        {
            // id: DataTypes.INTEGER,
            userId: DataTypes.INTEGER,
            roleId: DataTypes.STRING,
            time: DataTypes.STRING,
            basic_salary: DataTypes.STRING,
            allowance: DataTypes.STRING,
            subsidize: DataTypes.STRING,
            responsibility: DataTypes.STRING,
            payroll: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Salary",
        }
    );
    return Salary;
};
