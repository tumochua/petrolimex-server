"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("sales", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            userId: {
                type: Sequelize.STRING,
            },
            day_for_sale: {
                type: Sequelize.STRING,
            },
            sales_figures_day: {
                type: Sequelize.STRING,
            },
            sales_figures_month: {
                type: Sequelize.STRING,
            },
            price: {
                type: Sequelize.STRING,
            },
            file: {
                type: Sequelize.BLOB,
            },

            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("sales");
    },
};
