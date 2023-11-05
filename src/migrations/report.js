"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("reports", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            userId: {
                type: Sequelize.INTEGER,
            },
            time: {
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
        await queryInterface.dropTable("reports");
    },
};
