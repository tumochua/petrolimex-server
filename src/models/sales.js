"use strict";
const { Sequelize, Model } = require("sequelize");
const cron = require('node-cron');

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
            time: DataTypes.STRING,
            problem: DataTypes.STRING,
            file: DataTypes.BLOB,
        },
        {
            sequelize,
            modelName: "Sales",
        }
    );
    // Tạo công việc lên lịch để xóa dữ liệu sau 30 giây
    // cron.schedule('*/30 * * * * *', async () => { // Chạy mỗi 30 giây
    //     try {
    //         await Sales.destroy({
    //             where: {}, // Điều kiện để xóa, rỗng để xóa hết dữ liệu
    //             truncate: true // Chọn truncate để xóa dữ liệu nhanh hơn
    //         });
    //         console.log("Dữ liệu của bảng Sales đã được xóa sau 30 giây.");
    //     } catch (error) {
    //         console.error("Lỗi khi xóa dữ liệu:", error);
    //     }
    // });
    return Sales;
};
