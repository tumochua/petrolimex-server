"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Shift extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Shift.belongsTo(models.User,
                {
                    foreignKey: 'userId',
                    as: "shiftData"
                });
        }
    }
    Shift.init(
        {
            // id: DataTypes.INTEGER,
            userId: DataTypes.INTEGER,
            time: DataTypes.STRING,
            size_user: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Shift",
        }
    );
    return Shift;
};
