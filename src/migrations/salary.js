"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("salaries", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            userId: {
                type: Sequelize.INTEGER,
            },
            roleId: {
                type: Sequelize.STRING,
            },
            basic_salary: {
                type: Sequelize.STRING,
            },
            allowance: {
                type: Sequelize.STRING,
            },
            subsidize_orther: {
                type: Sequelize.STRING,
            },
            payroll: {
                type: Sequelize.STRING,
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
        await queryInterface.dropTable("salaries");
    },
};
