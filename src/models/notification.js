"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

    }
  }

  Notification.init(
    {
      userId: DataTypes.INTEGER,
      userIdApprove: DataTypes.INTEGER,
      userIdLikePost: DataTypes.INTEGER,
      commentsId: DataTypes.INTEGER,
      socketId: DataTypes.STRING,
      userName: DataTypes.STRING,
      statusId: DataTypes.STRING,
      postsId: DataTypes.INTEGER,
      roleId: DataTypes.STRING,
      readId: DataTypes.STRING,
      reason: DataTypes.STRING,
      typeId: DataTypes.STRING,
      content: DataTypes.STRING,
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Notification",
    }
  );
  return Notification;
};
