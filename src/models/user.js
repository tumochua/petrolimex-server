"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.Role, {
        foreignKey: "roleId",
        targetKey: "roleId",
        as: "roleData",
      });


      User.hasMany(models.Timekeeping, {
        foreignKey: "userId",
        targetKey: "userId",
        as: "timekeepingData",
      })
      User.hasMany(models.Salary, {
        foreignKey: "userId",
        targetKey: "userId",
        as: "salaryData",
      })
      User.hasMany(models.Shift, {
        foreignKey: "userId",
        targetKey: "userId",
        as: "shiftData",
      })
      User.hasMany(models.Notification, {
        foreignKey: "userId",
        targetKey: "userId",
        as: "notificationData",
      })
      User.hasMany(models.Sales, {
        foreignKey: "userId",
        targetKey: "userId",
        as: "saleData",
      })


      // User.belongsTo(models.Timekeeping, {
      //   foreignKey: 'timeKeepingId',
      //   targetKey: "timeKeepingId",
      //   as: "timeKeepingData"
      // });
      // User.hasOne(models.Salary,
      //   {
      //     foreignKey: 'salaryId',
      //     targetKey: "salaryId",
      //     as: 'salaryData'
      //   }
      // );
    }
  }
  User.init(
    {
      // id: DataTypes.INTEGER,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      address: DataTypes.STRING,
      password_hash: DataTypes.STRING,
      dob: DataTypes.STRING,
      roleId: DataTypes.STRING,
      mobile: DataTypes.STRING,
      gender: DataTypes.STRING,
      home_town: DataTypes.STRING,
      cccd: DataTypes.INTEGER,
      nation: DataTypes.STRING,
      education: DataTypes.STRING,
      userIdNotification: DataTypes.INTEGER,
      sizeNotification: DataTypes.INTEGER,
      profile: DataTypes.TEXT,
      date_of_join: DataTypes.DATE,
      status: DataTypes.BOOLEAN,
      last_login: DataTypes.DATE,
      image: DataTypes.BLOB,
      refresh_token: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
