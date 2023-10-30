import db from "../models";
const handleServiceCreateComment = (comment, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if ((comment, userId)) {
        await db.Comments.create({
          authorId: userId,
          postId: comment.postId,
          time: new Date().getTime(),
          text: comment.text,
        });
        resolve({
          statusCode: 2,
          data: "ok",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const handleServiceGetListsComment = ({ postId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      //   console.log(postId);
      const dataComment = await db.Comments.findAll({
        where: {
          postId: postId,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        order: [["id", "DESC"]],
        include: [
          {
            model: db.User,
            as: "authorData",
            attributes: ["id", "fullName", "image", "roleId"],
          },
        ],
        raw: true,
        nest: true,
      });
      if (dataComment) {
        dataComment.forEach(async (element) => {
          if (element.authorData && element.authorData.image) {
            const base64 = await Buffer.from(
              element.authorData.image,
              "base64"
            ).toString("binary");
            element.authorData.image = base64;
          }
        });
      }
      resolve({
        statusCode: 2,
        data: dataComment,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const handleServiceEditCommnet = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { type, postId, commentId, authorId, textComment } = data;
      if (!postId || !commentId || !authorId) {
        resolve({
          statusCode: 4,
          message: "you are missing a required parameter",
        });
      }
      const commentData = await db.Comments.findOne({
        where: {
          id: commentId,
          postId: postId,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        raw: false,
        nest: true,
      });
      if (commentData) {
        // console.log(commentData);
        commentData.text = textComment;
        commentData.time = new Date().getTime();
        await commentData.save();
        resolve({
          statusCode: 2,
          message: "ok",
        });
        // console.log(type, postId, commentId, authorId, textComment);
        // textComment.
      }
    } catch (error) {
      reject(error);
    }
  });
};

const handleServiceDeleteCommnet = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { type, postId, commentId, authorId } = data;
      if (!postId || !commentId || !authorId) {
        resolve({
          statusCode: 4,
          message: "you are missing a required parameter",
        });
      }
      if (type === "delete") {
        const commentData = await db.Comments.findOne({
          where: {
            id: commentId,
            postId: postId,
          },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          // raw: false,
          // nest: true,
        });
        // console.log(commentData);
        if (commentData) {
          await db.Comments.destroy({
            where: {
              id: commentId,
              postId: postId,
            },
          });
          resolve({
            statusCode: 2,
            message: `the Comment in deleted`,
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

const handleServiceLikeComment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { postId, commentId, authorId, userName, userId, description } =
        data;
      // console.log(postId, commentId, authorId, userName, userId, description);
      const commentData = await db.Comments.findOne({
        where: {
          id: commentId,
          postId: postId,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        raw: false,
        nest: true,
      });
      if (commentData) {
        if (commentData.dataValues.comment_likes) {
          const newCommentLikes = JSON.parse(
            commentData.dataValues.comment_likes
          );
          const isUserLikeCommnet = newCommentLikes.includes(userId.toString());
          newCommentLikes.push(`${userId}`);
          // console.log(newCommentLikes);
          if (!isUserLikeCommnet) {
            commentData.comment_likes = newCommentLikes;
            await commentData.save();
            resolve({
              statusCode: 2,
              message: `ok`,
            });
          } else {
            const commentLikeFiler = newCommentLikes.filter((likeUserId) => {
              return likeUserId !== userId.toString();
            });
            commentData.comment_likes = commentLikeFiler;
            await commentData.save();
            resolve({
              statusCode: 2,
              message: `ok`,
            });
          }
        } else {
          commentData.comment_likes = [`${userId}`];
          await commentData.save();
          resolve({
            statusCode: 2,
            message: `ok`,
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  handleServiceCreateComment,
  handleServiceGetListsComment,
  handleServiceEditCommnet,
  handleServiceDeleteCommnet,
  handleServiceLikeComment,
};
