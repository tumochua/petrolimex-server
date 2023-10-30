import {
  handleServiceCreatePost,
  handleServiceGetListPosts,
  handeServiceDetailPost,
  handleServiceLikePost,
  handleServiceQuitLikePosts,
  handleServiceSearchPosts,
  handleServiceGetAllPostsByUser,
  handleServiceDeletePosts,
  handleServiceEditPosts,
  handleServiceVerifyPosts,
  handleServiceConfirmPosts,
  handleServiceGetAllPosts,
} from "../services/postService";

const handleCreatePost = async (req, res) => {
  try {
    const userId = req.userId;
    const post = req.body;
    // console.log(post);
    // const userIdQuery = +req.query.userId;
    const data = await handleServiceCreatePost(post, userId);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json(error.message);
  }
};

const handleGetListPosts = async (req, res) => {
  try {
    const currentPage = +req.query.page;
    // console.log("currentPage", currentPage);
    const data = await handleServiceGetListPosts(currentPage);
    // console.log(data);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json(error.message);
  }
};

const handeDetailPost = async (req, res) => {
  try {
    // console.log(req.query);
    // const userId = req.userId;
    const postId = req.query;
    // console.log(postId);
    const data = await handeServiceDetailPost(postId);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json(error.message);
  }
};

const handleLikePost = async (req, res) => {
  try {
    const reqData = req.body;
    const userId = req.userId;

    const data = await handleServiceLikePost(reqData, userId);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json(error.message);
  }
};

const handleQuitLikePost = async (req, res) => {
  try {
    const reqData = req.body;
    const data = await handleServiceQuitLikePosts(reqData);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json(error.message);
  }
};

const handleSearchPosts = async (req, res) => {
  try {
    // console.log(req.query);
    const searchValue = req.query;
    // const currentPage = +req.query.page;
    const data = await handleServiceSearchPosts(searchValue);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json(error.message);
  }
};

const handleGetAllPostsByUser = async (req, res) => {
  try {
    const userId = req.userId;
    const data = await handleServiceGetAllPostsByUser(userId);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json(error.message);
  }
};

const handleDeletePosts = async (req, res) => {
  try {
    const postsData = req.body;
    const data = await handleServiceDeletePosts(postsData);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json(error.message);
  }
};

const handleEditPosts = async (req, res) => {
  try {
    const postsData = req.body;
    const data = await handleServiceEditPosts(postsData);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json(error.message);
  }
};

const handleVerifyPosts = async (req, res) => {
  try {
    const status = req.query;
    const data = await handleServiceVerifyPosts(status);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json(error.message);
  }
};

const handleConfirmPosts = async (req, res) => {
  try {
    const statusData = req.body;
    const data = await handleServiceConfirmPosts(statusData);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json(error.message);
  }
};
const handleGetAllPosts = async (req, res) => {
  try {
    const data = await handleServiceGetAllPosts(req.query.data);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json(error.message);
  }
};
module.exports = {
  handleCreatePost,
  handleGetListPosts,
  handeDetailPost,
  handleLikePost,
  handleQuitLikePost,
  handleSearchPosts,
  handleGetAllPostsByUser,
  handleDeletePosts,
  handleEditPosts,
  handleVerifyPosts,
  handleConfirmPosts,
  handleGetAllPosts,
};
