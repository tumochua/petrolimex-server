import db from "../models/index";

import {
  handleServiceGetListNotification,
  handleServiceCleanNotification,
  handleServiceSeeAllNotification,
  handleServiceGetListsNotificationRead,
} from "../services/notificationServices";
const handleGetListNotification = async (req, res) => {
  try {
    const userId = req.userId;
    const data = await handleServiceGetListNotification(userId);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json(error.message);
  }
};

const handleCleanNotification = async (req, res) => {
  try {
    const userId = req.userId;
    const data = await handleServiceCleanNotification(userId);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json(error.message);
  }
};

const handleSeeAllNotification = async (req, res) => {
  try {
    const userId = req.userId;
    const data = await handleServiceSeeAllNotification(userId);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json(error.message);
  }
};

const handleApiTestRead = async (req, res) => {
  try {
    const readData = await db.Notification_Read.findAll();
    console.log(readData);
  } catch (error) {
    console.log(error);
    return res.status(200).json(error.message);
  }
};
const handleGetListsNotificationRead = async (req, res) => {
  try {
    const userId = req.userId;
    const readData = await handleGetListsNotificationRead(userId);
    console.log(readData);
  } catch (error) {
    console.log(error);
    return res.status(200).json(error.message);
  }
};
module.exports = {
  handleGetListNotification,
  handleCleanNotification,
  handleSeeAllNotification,
  handleApiTestRead,
  handleGetListsNotificationRead,
};
