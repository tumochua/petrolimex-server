import express from "express";

import {
  useCheckErrorToken,
} from "../middleware/index";



import {
  handleGetAllUser, handleLoginUser, handleRegisterUser,
  handleGetProfileUser, handleCreateNotication, handleCreateShift,
  handleDeleteUser
} from '../controllers/useController'

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

  router.post('/api-crate-notification', useCheckErrorToken, handleCreateNotication)

  router.post('/api-create-shifts', useCheckErrorToken, handleCreateShift)

  router.delete('/api-delete-user', useCheckErrorToken, handleDeleteUser)

  return app.use("/", router);
};

module.exports = initWebRoutes;
