require("dotenv").config();
import express from "express";
const http = require("http");
const app = express();
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import connectDB from "./config/connectDB";
import cors from "cors";
import createErrors from "http-errors";
import cookieParser from "cookie-parser";
// const socketio = require("socket.io");
// import {
//   SocketIo,
//   useNotificationLikePosts,
//   useCreateNotificationComment,
//   useCreateNotificationLkeComment,
// } from "./use/SocketIo";
// // import { useNotificationLikePosts } from "./use/SocketIo";
// import {
//   useCreateNotificationPosts,
//   useApproveNotificationPosts,
//   useDeleteNotificationPost,
// } from "./middleware";
const server = http.createServer(app);
app.use(
  cors({
    origin: process.env.REACTJS_URL,
    credentials: true,
  })
);
// const io = SocketIo(server);
// // global.io = io;
// // export const socketio = io;
// // app.set("socketio", io);
// // export const io = socketio;
// // console.log(io);
// io.on("connection", (socket) => {
//   // console.log("User has connection!!");
//   // socket.on("postsNotification", (arg) => {
//   //   useCreateNotificationPost(arg, socket);
//   //   // socket.broadcast.emit("notification", arg);
//   // });
//   socket.on("createNotificationPosts", (arg) => {
//     useCreateNotificationPosts(arg, socket);
//   });
//   socket.on("approveNotificationPosts", (arg) => {
//     useApproveNotificationPosts(arg, socket);
//   });
//   socket.on("deleteNotificationPosts", (arg) => {
//     // console.log(arg);
//     useDeleteNotificationPost(arg, socket);
//     // socket.broadcast.emit("resDeleteNotificationPosts");
//   });
//   socket.on("readPostsNotifications", () => {
//     socket.broadcast.emit("resReadPostsNotifications");
//   });
//   socket.on("notificationLikePost", (arg) => {
//     if (arg) {
//       // console.log(arg);
//       useNotificationLikePosts(arg, socket);
//     }
//   });
//   socket.on("createNotificationComment", (arg) => {
//     useCreateNotificationComment(arg, socket);
//   });
//   socket.on("createLikeComment", (arg) => {
//     useCreateNotificationLkeComment(arg, socket);
//   });
// });
// app.use(bodyParser.json({ limit: "50mb" }));
// app.use(bodyParser.urlencoded({ limit: "50mb" }));
app.use(cookieParser());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }, { limit: "50mb" }));

viewEngine(app);
initWebRoutes(app);

app.use((req, res, next) => {
  next(createErrors.NotFound("This route does not exits"));
});

app.use((eror, req, res, next) => {
  res.json({
    status: eror.status || 500,
    message: eror.message,
  });
});

connectDB();

let port = process.env.PORT || 6969;

server.listen(port, () => {
  console.log("backend nodejs in runing on the port" + port);
});

// module.exports = {
//   socketio,
// };
