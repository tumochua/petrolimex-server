require("dotenv").config();
const socketio = require("socket.io");
import db from "../models";
// import { io } from "../server";
function SocketIo(server) {
  const io = socketio(server, {
    cors: {
      origin: process.env.REACTJS_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  return io;
}

const useNotificationLikePosts = (arg, socket) => {
  // console.log(arg);
  return new Promise(async (resolve, reject) => {
    try {
      const {
        userIdCreatePost,
        postId,
        description,
        userName,
        typeId,
        readId,
        statusId,
        userIdLikePost,
      } = arg;
      const newDescription = userName.concat(description);
      const postData = await db.Post.findOne({
        where: {
          id: postId,
          userId: userIdCreatePost,
        },
        attributes: ["id", "userId"],
      });
      if (postData) {
        const notificationData = await db.Notification.findOne({
          where: {
            userIdLikePost: userIdLikePost,
            postsId: postId,
          },
        });
        if (!notificationData) {
          await db.Notification.create({
            userId: userIdCreatePost,
            userName: userName,
            statusId: statusId,
            postsId: postId,
            description: newDescription,
            readId: readId,
            typeId: typeId,
            userIdLikePost: userIdLikePost,
          });
          const userData = await db.User.findOne({
            where: {
              id: userIdCreatePost,
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
            let size = userData.dataValues.sizeNotification;
            // console.log(size);
            userData.sizeNotification = size += 1;
            await userData.save();
            socket.broadcast.emit("resNotificationLike", arg);
            resolve("ok");
          }
        }
        // console.log(io);
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

const useCreateNotificationComment = (arg, socket) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { postId, userId, description, typeId, readId, userName } = arg;
      const postData = await db.Post.findOne({
        where: {
          id: postId,
        },
        attributes: ["id", "userId"],
      });
      // console.log(postData);
      // console.log(postId, userId, description, typeId, readId, userName);
      if (postData) {
        if (postData.userId !== userId) {
          await db.Notification.create({
            userId: postData.userId,
            postsId: postId,
            userName: userName,
            description: description,
            typeId: typeId,
            readId: readId,
          });
          const userData = await db.User.findOne({
            where: {
              id: postData.userId,
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
            let size = userData.dataValues.sizeNotification;
            // console.log(size);
            userData.sizeNotification = size += 1;
            await userData.save();
            socket.broadcast.emit("resNotificationComment", arg);
            resolve("ok");
          }
          // socket.broadcast.emit("resNotificationLike", arg);
          resolve({
            statusCode: 2,
            message: "ok",
          });
        }
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
const useCreateNotificationLkeComment = (arg, socket) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        postId,
        userId,
        description,
        typeId,
        readId,
        userName,
        commentId,
      } = arg;

      // console.log(
      //   postId,
      //   userId,
      //   description,
      //   typeId,
      //   readId,
      //   userName,
      //   commentId
      // );

      const commentData = await db.Comments.findOne({
        where: {
          id: commentId,
        },
        attributes: ["id", "authorId"],
      });
      // console.log(commentData);
      if (commentData) {
        if (commentData.authorId !== userId) {
          const userData = await db.User.findOne({
            where: {
              id: commentData.authorId,
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
            let size = userData.dataValues.sizeNotification;
            // console.log(size);
            userData.sizeNotification = size += 1;
            await userData.save();
            resolve("ok");
            await db.Notification.create({
              userId: commentData.authorId,
              postsId: postId,
              userName: userName,
              description: description,
              typeId: typeId,
              readId: readId,
            });
            socket.broadcast.emit("resNotificationLikeComment", arg);
            resolve({
              statusCode: 2,
              message: "ok",
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

module.exports = {
  SocketIo,
  useNotificationLikePosts,
  useCreateNotificationComment,
  useCreateNotificationLkeComment,
};
