import db from "../models/index";

import {
  useAccessToken,
  useVerifyAccessToken,
  userVervifyRefreshToken,
} from "../jwt/useJwt";

const useCheckErrorToken = (req, res, next) => {
  return new Promise(async (resolve, reject) => {
    try {
      const token = req.cookies;
      if (token) {
        const accessToken = token.accessToken;
        const refreshToken = token.refreshToken;
        const data = await useVerifyAccessToken(accessToken);
        // console.log('data', data);
        if (Number.isInteger(data)) {
          req.userId = data;
          return next();
        }
        if (data === "invalid token") {
          res.json({
            statusCode: 403,
            message: "invalid token",
          });
        }
        if (data === "jwt expired") {
          const tokenRefreshToken = await userVervifyRefreshToken(refreshToken);
          // console.log(tokenRefreshToken);
          // console.log(tokenRefreshToken === "invalid token");
          if (tokenRefreshToken === "invalid token") {
            res.json({
              statusCode: 403,
              message: "invalid token",
            });
          }
          const userId = tokenRefreshToken.userId;
          const newAccessToken = await useAccessToken(userId);
          res.cookie("accessToken", newAccessToken, {
            // httpOnly: true,
            // secure: true,
          });
          req.userId = userId;
          return next();
        }
      } else {
        res.json({
          statusCode: 404,
          message: "invalid token",
        });
      }
    } catch (error) {
      console.log(error);
      res.json({
        statusCode: 500,
        message: "error from serve",
      });
    }
  });
};

const useCheckRoles = (req, res, next) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findOne({
        where: {
          id: req.userId,
        },
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.AllCode,
            as: "genderData",
            attributes: ["id", "KeyMap", "valueEn", "valueVi"],
          },
          {
            model: db.AllCode,
            as: "roleData",
            attributes: ["id", "KeyMap", "valueEn", "valueVi"],
          },
        ],
        raw: true,
        nest: true,
      });
      if (user) {
        req.role = user.roleData;
        next();
      }
    } catch (error) {
      console.log(error);
      res.json({
        statusCode: 500,
        message: "error from serve",
      });
    }
  });
};

const useCreateNotificationPosts = (notification, socket) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { roleId, userId } = notification;
      if (roleId === "R5" || roleId === "R4" || roleId === "R3") {
        const userData = await db.User.findAll({
          attributes: [
            "id",
            "roleId",
            "userIdNotification",
            "sizeNotification",
          ],
          raw: false,
          nest: true,
        });
        if (userData) {
          userData.forEach(async (element) => {
            if (
              element.roleId === "R0" ||
              element.roleId === "R1" ||
              element.roleId === "R2"
            ) {
              let size = element.dataValues.sizeNotification;
              // console.log(size);
              element.sizeNotification = size += 1;
              // element.sizeNotification = +1;
              await element.save();
              resolve("ok");
            }
          });
          await db.Notification.create({
            userId: notification.userId,
            userName: notification.userName,
            // statusId: notification.statusId,
            postsId: notification.postsId,
            roleId: notification.roleId,
            description: notification.description,
            title: notification.title,
            image: notification.image,
            readId: notification.readId,
            typeId: "PN",
          });
          resolve("ok");
        }
      } else {
        const userData = await db.User.findOne({
          where: {
            id: userId,
          },
          attributes: [
            "id",
            "roleId",
            "userIdNotification",
            "sizeNotification",
          ],
          raw: false,
          nest: true,
        });

        if (userData) {
          // console.log(userData);
          let size = userData.dataValues.sizeNotification;
          // console.log(size);
          userData.sizeNotification = size += 1;
          await userData.save();

          resolve("ok");
        }

        await db.Notification.create({
          userId: notification.userId,
          userName: notification.userName,
          // statusId: notification.statusId,
          postsId: notification.postsId,
          roleId: notification.roleId,
          description: notification.description,
          title: notification.title,
          image: notification.image,
          readId: notification.readId,
          typeId: "PN",
        });
      }
      socket.broadcast.emit("resCreateMesPosts", notification);
    } catch (error) {
      reject(error);
    }
  });
};

const useApproveNotificationPosts = (notification, socket) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { userId } = notification;

      const userData = await db.User.findOne({
        where: {
          id: userId,
        },
        attributes: ["id", "roleId", "userIdNotification", "sizeNotification"],
        raw: false,
        nest: true,
      });

      if (userData) {
        let size = userData.dataValues.sizeNotification;
        // console.log(size);
        userData.sizeNotification = size += 1;
        await userData.save();
        socket.broadcast.emit("resApprovedPosts", notification);
        resolve("ok");
      }

      await db.Notification.create({
        userId: notification.userId,
        userName: notification.userName,
        statusId: notification.statusId,
        postsId: notification.postsId,
        roleId: notification.roleId,
        description: notification.description,
        userIdApprove: notification.userIdApprove,
        readId: notification.readId,
        typeId: "PN",
        title: notification.title,
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

const useDeleteNotificationPost = (notification, socket) => {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log(notification);
      const { description, reason, userId } = notification;
      const newDescription = `${description} ${reason}`;
      const userData = await db.User.findOne({
        where: {
          id: userId,
        },
        attributes: ["id", "roleId", "userIdNotification", "sizeNotification"],
        raw: false,
        nest: true,
      });

      if (userData) {
        let size = userData.dataValues.sizeNotification;
        // console.log(size);
        userData.sizeNotification = size += 1;
        await userData.save();
        resolve("ok");
      }
      await db.Notification.create({
        userId: notification.userId,
        userName: notification.userName,
        statusId: notification.statusId,
        postsId: notification.postsId,
        roleId: notification.roleId,
        description: newDescription,
        userIdApprove: notification.userIdApprove,
        readId: notification.readId,
        typeId: "PN",
        title: notification.title,
      });
      socket.broadcast.emit("resDeleteNotificationPosts");
    } catch (error) {
      reject(error);
    }
  });
};

const useSortMiddleware = (req, res, next) => {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log(req.query.data);
      const { value, collum, name } = req.query.data;
      // console.log(value, collum, name);
      if ((!value, !collum, !name)) {
        resolve({
          statusCode: 3,
          message: "you are missing a required parameter",
        });
      }
      next();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  useCheckErrorToken,
  useCheckRoles,
  useCreateNotificationPosts,
  useApproveNotificationPosts,
  useDeleteNotificationPost,
  useSortMiddleware,
};
