"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Sales extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Sales.belongsTo(models.User,
                {
                    foreignKey: 'userId',
                    as: "saleData"
                });
        }
    }

    Sales.init(
        {
            userId: DataTypes.INTEGER,
            day_for_sale: DataTypes.STRING,
            sales_figures_day: DataTypes.STRING,
            sales_figures_month: DataTypes.STRING,
            price: DataTypes.STRING,
            file: DataTypes.BLOB,
        },
        {
            sequelize,
            modelName: "Sales",
        }
    );
    return Sales;
};
