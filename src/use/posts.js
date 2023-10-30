import db from "../models/index";

const useCheckPosts = (postsId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const postData = await db.Post.findOne({
        where: {
          id: postsId,
        },
        attributes: ["id", "userId", "likeId"],
      });
      resolve(postData);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

module.exports = {
  useCheckPosts,
};
