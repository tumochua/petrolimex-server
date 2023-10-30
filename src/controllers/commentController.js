import {
  handleServiceCreateComment,
  handleServiceGetListsComment,
  handleServiceEditCommnet,
  handleServiceDeleteCommnet,
  handleServiceLikeComment,
} from "../services/commentService";

const handleCreateComment = async (req, res) => {
  try {
    const userId = req.userId;
    const commentData = req.body;
    const data = await handleServiceCreateComment(commentData, userId);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json(error.message);
  }
};

const handleGetListsComment = async (req, res) => {
  try {
    // const userId = req.userId;
    const postId = req.query;
    const data = await handleServiceGetListsComment(postId);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json(error.message);
  }
};

const handleEditCommnet = async (req, res) => {
  try {
    // const userId = req.userId;
    const dataComment = req.body;
    const data = await handleServiceEditCommnet(dataComment);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json(error.message);
  }
};

const handleDeleteCommnet = async (req, res) => {
  try {
    // const userId = req.userId;
    const dataComment = req.body;
    const data = await handleServiceDeleteCommnet(dataComment);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json(error.message);
  }
};

const handleLikeComment = async (req, res) => {
  try {
    // const userId = req.userId;
    const dataComment = req.body;
    const data = await handleServiceLikeComment(dataComment);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json(error.message);
  }
};

module.exports = {
  handleCreateComment,
  handleGetListsComment,
  handleEditCommnet,
  handleDeleteCommnet,
  handleLikeComment,
};
