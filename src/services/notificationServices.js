import db from "../models/index";

const handleServiceGetListNotification = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const notificationData = await db.Notification.findAll({
        // limit: 4,
        // offset: 0,
        attributes: [
          "id",
          "userName",
          "userId",
          "postsId",
          "readId",
          "title",
          "description",
          "typeId",
          "roleId",
          "image",
        ],
        order: [["id", "DESC"]],
        // include: [
        //   {
        //     model: db.User,
        //     as: "userNotificationSize",
        //     attributes: ["id", "sizeNotification", "roleId"],
        //   },
        // ],
        raw: true,
        nest: true,
      });
      // console.log(notificationData);
      if (notificationData) {
        const newNotificationData = notificationData.filter((notification) => {
          if (notification.userId !== userId) {
            return (
              notification.roleId === "R5" ||
              notification.roleId === "R4" ||
              notification.roleId === "R3"
            );
          } else {
            if (notification.userId === userId) {
              return notification.userId;
            }
          }
        });
        const userData = await db.User.findOne({
          where: {
            id: userId,
          },
          attributes: ["id", "sizeNotification", "roleId"],
        });
        // console.log(userData);
        resolve({
          statusCode: 2,
          data: newNotificationData,
          sizeNotification:
            userData && userData.sizeNotification
              ? userData.sizeNotification
              : null,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const handleServiceCleanNotification = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const userData = await db.User.findOne({
        where: {
          id: userId,
        },
        attributes: ["id", "sizeNotification", "roleId"],
        raw: false,
        nest: true,
      });
      // console.log(userData);
      userData.sizeNotification = null;
      await userData.save();

      resolve({
        statusCode: 2,
        data: "ok",
      });
    } catch (error) {
      reject(error);
    }
  });
};
const handleServiceSeeAllNotification = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const notificationData = await db.Notification.findAll({
        where: {
          userId: userId,
        },
        attributes: [
          "id",
          "userId",
          "userName",
          "statusId",
          "postsId",
          "readId",
          "roleId",
          "description",
          "title",
        ],
      });
      resolve({ statusCode: 2, data: notificationData });
    } catch (error) {
      reject(error);
    }
  });
};

const handleServiceGetListsNotificationRead = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const readData = await db.Notification_Read.findAll({
        where: {
          userId: userId,
          readId: "D0",
        },
      });
      console.log(readData);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  handleServiceGetListNotification,
  handleServiceCleanNotification,
  handleServiceSeeAllNotification,
  handleServiceGetListsNotificationRead,
};
