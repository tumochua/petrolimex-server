import {
  profileService,
  handleUpdateService,
  handleGetListStudentService,
  handleServiceCreateFamily,
  handleServiceGetAllStudentMannage,
  handleServiceGetUserById,
  handleServiceMannageEditUser,
  handleServiceMannageDeleteUser,
  handleServiceMannageGetDetailUser,
  handleServiceManageAllTeacher,
} from "../services/profileService";

const handleGetProfileUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    // const userIdQuery = +req.query.userId;
    const data = await profileService(userId);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json(error.message);
  }
};

const handleEditUser = async (req, res) => {
  try {
    const userId = req.userId;
    const data = await handleUpdateService(req.body, userId);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json(error.message);
  }
};

const handleApiGetListStudentOfClass = async (req, res) => {
  try {
    const userId = req.userId;
    // console.log("userId", userId);
    const className = req.query.className;
    const data = await handleGetListStudentService(className);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json(error.message);
  }
};

const handleCreateFamily = async (req, res) => {
  try {
    const userId = req.userId;
    const userData = req.body;
    // console.log("userId", userId);
    // const className = req.query.className;
    const data = await handleServiceCreateFamily(userId, userData);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json(error.message);
  }
};

const handleGetAllStudentMannage = async (req, res) => {
  try {
    const currentUsers = +req.query?.currentUser;
    const data = await handleServiceGetAllStudentMannage(currentUsers);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json(error.message);
  }
};

const handleGetUserById = async (req, res) => {
  try {
    const userId = +req.query.userId;
    const data = await handleServiceGetUserById(userId);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json(error.message);
  }
};

const handleMannageEditUser = async (req, res) => {
  try {
    const userData = req.body;
    const data = await handleServiceMannageEditUser(userData);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json(error.message);
  }
};
const handleMannageDeleteUser = async (req, res) => {
  try {
    const userId = req.body;
    const userIdDelete = req.userId;
    const data = await handleServiceMannageDeleteUser(userId, userIdDelete);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json(error.message);
  }
};
const handleMannageGetDetailUser = async (req, res) => {
  try {
    const userId = req.query;
    // const userIdGetDetail = req.userId;
    const data = await handleServiceMannageGetDetailUser(userId);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json(error.message);
  }
};
const handleManageAllTeacher = async (req, res) => {
  try {
    const userId = req.query;
    // const userIdGetDetail = req.userId;
    const data = await handleServiceManageAllTeacher(userId);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json(error.message);
  }
};

module.exports = {
  handleGetProfileUser,
  handleEditUser,
  handleApiGetListStudentOfClass,
  handleCreateFamily,
  handleGetAllStudentMannage,
  handleMannageEditUser,
  handleGetUserById,
  handleMannageDeleteUser,
  handleMannageGetDetailUser,
  handleManageAllTeacher,
};
