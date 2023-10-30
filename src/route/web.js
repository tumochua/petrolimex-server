import express from "express";
import homeController from "../controllers/homeController";
import auth from "../controllers/authController.js";
import {
  useCheckErrorToken,
  useCheckRoles,
  useCreateNotificationPost,
  useApproveNotificationPosts,
  useSortMiddleware,
} from "../middleware/index";
import {
  handleEditUser,
  handleApiGetListStudentOfClass,
  handleCreateFamily,
  handleGetAllStudentMannage,
  handleGetUserById,
  handleMannageEditUser,
  handleMannageDeleteUser,
  handleMannageGetDetailUser,
  handleManageAllTeacher,
} from "../controllers/profileController";
import {
  handleCreatePost,
  handleGetListPosts,
  handeDetailPost,
  handleLikePost,
  handleSearchPosts,
  handleGetAllPostsByUser,
  handleDeletePosts,
  handleEditPosts,
  handleVerifyPosts,
  handleConfirmPosts,
  handleGetAllPosts,
} from "../controllers/postController";

import {
  handleGetListNotification,
  handleCleanNotification,
  handleSeeAllNotification,
  handleApiTestRead,
} from "../controllers/notificationController";

import {
  handleCreateComment,
  handleGetListsComment,
  handleEditCommnet,
  handleDeleteCommnet,
  handleLikeComment,
} from "../controllers/commentController";


import { handleGetAllUser, handleLoginUser, handleRegisterUser, handleGetProfileUser } from '../controllers/useController'

///// router
let router = express.Router();

let initWebRoutes = (app) => {

  /// auth
  router.post("/api-register-user", handleRegisterUser);
  router.post("/api-login", handleLoginUser);

  /// profile
  router.get(
    "/api-get-user-by-id",
    useCheckErrorToken,
    handleGetProfileUser
  );

  router.get(
    "/api-get-all-users",
    useCheckErrorToken,
    // useCheckRoles,
    handleGetAllUser
  );



  /// auth
  router.post("/api-refresh-token", auth.handleRefreshToken);
  router.delete("/api-logout", auth.handeLogout);
  // router.post("/api-refresh-token", useVerifyAccessToken);
  // router.get("/api-verify-token", useVerifyAccessToken);


  router.put("/api-edit-user", useCheckErrorToken, handleEditUser);
  router.get(
    "/api-list-students-of-class",
    useCheckErrorToken,
    handleApiGetListStudentOfClass
  );
  router.post("/api-create-family", useCheckErrorToken, handleCreateFamily);

  /// posts
  router.post("/api-create-post", useCheckErrorToken, handleCreatePost);
  router.get("/api-get-list-posts", useCheckErrorToken, handleGetListPosts);
  router.get("/api-get-detail-post-by-id", useCheckErrorToken, handeDetailPost);
  router.put("/api-like-post", useCheckErrorToken, handleLikePost);
  router.get("/api-search-posts", useCheckErrorToken, handleSearchPosts);
  router.get(
    "/api-get-all-posts-by-user",
    useCheckErrorToken,
    handleGetAllPostsByUser
  );
  router.delete("/api-delete-posts", useCheckErrorToken, handleDeletePosts);
  router.put("/api-edit-posts-by-user", useCheckErrorToken, handleEditPosts);
  router.get("/api-get-verify-posts", useCheckErrorToken, handleVerifyPosts);
  router.put("/api-confirm-posts", useCheckErrorToken, handleConfirmPosts);

  // router.delete("/api-quit-like-post", useCheckErrorToken, handleQuitLikePost);

  //// Notification
  router.get(
    "/api-list-notification",
    useCheckErrorToken,
    handleGetListNotification
  );
  router.put(
    "/api-clean-notification",
    useCheckErrorToken,
    handleCleanNotification
  );
  router.get(
    "/api-list-see-all-notification",
    useCheckErrorToken,
    handleSeeAllNotification
  );
  router.get("/api-test-read", handleApiTestRead);
  router.get("/api-get-lists-notification-read", useCheckErrorToken);

  /// commnets
  router.post("/api-create-comment", useCheckErrorToken, handleCreateComment);
  router.get(
    "/api-get-list-comments",
    useCheckErrorToken,
    handleGetListsComment
  );
  router.put("/api-eidt-comment", useCheckErrorToken, handleEditCommnet);
  router.delete("/api-delete-comment", useCheckErrorToken, handleDeleteCommnet);
  router.put("/api-likes-comment", useCheckErrorToken, handleLikeComment);

  /// manage
  router.get(
    "/api-get-all-posts",
    useCheckErrorToken,
    // useSortMiddleware,
    handleGetAllPosts
  );
  router.get(
    "/api-get-all-student-manage",
    useCheckErrorToken,
    handleGetAllStudentMannage
  );
  router.get("/api-get-user-by-id", useCheckErrorToken, handleGetUserById);
  router.put(
    "/api-manage-eidt-user",
    useCheckErrorToken,
    handleMannageEditUser
  );
  router.delete(
    "/api-manage-delete-user",
    useCheckErrorToken,
    handleMannageDeleteUser
  );
  router.get(
    "/api-manage-get-detail-user",
    useCheckErrorToken,
    handleMannageGetDetailUser
  );
  router.get(
    "/api-get-all-teachers",
    useCheckErrorToken,
    handleManageAllTeacher
  );

  return app.use("/", router);
};

module.exports = initWebRoutes;
