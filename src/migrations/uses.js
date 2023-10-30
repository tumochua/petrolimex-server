"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Users", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            firstName: {
                type: Sequelize.STRING,
            },
            lastName: {
                type: Sequelize.STRING,
            },
            email: {
                type: Sequelize.STRING,
                unique: true,
                isEmail: true,
            },
            address: {
                type: Sequelize.STRING,
            },
            password_hash: {
                type: Sequelize.STRING,
            },
            dob: {
                type: Sequelize.STRING,
            },
            roleId: {
                type: Sequelize.STRING,
                defaultValue: "R0",
            },
            mobile: {
                type: Sequelize.STRING,
                unique: true,
            },
            gender: {
                type: Sequelize.STRING,
                defaultValue: "Nam",
            },
            home_town: {
                type: Sequelize.STRING,
            },
            cccd: {
                type: Sequelize.INTEGER,
            },
            nation: {
                type: Sequelize.STRING,
            },
            education: {
                type: Sequelize.STRING,
            },
            userIdNotification: {
                type: Sequelize.INTEGER,
            },
            sizeNotification: {
                type: Sequelize.INTEGER,
            },
            profile: {
                type: Sequelize.TEXT,
            },
            date_of_join: {
                type: Sequelize.DATE,
            },
            status: {
                type: Sequelize.BOOLEAN,
            },
            last_login: {
                type: Sequelize.DATE,
            },
            image: {
                type: Sequelize.BLOB("long"),
            },
            refresh_token: {
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
        await queryInterface.dropTable("Users");
    },
};
