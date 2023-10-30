import { Op } from "sequelize";
import db from "../models/index";
import { PAGE_SIZE } from "../utils/constants";
// import { useCheckPosts } from "../use/posts";

const handleServiceCreatePost = (posts, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log("userId", userId);
      // console.log("posts", posts);
      const { roleId } = posts;
      const { title, textMarkDown, type, textHtmlMarkDown, image } = posts;

      if (!title || !textMarkDown || !type) {
        resolve({
          status: 400,
          message: "you are missing a required parameter",
        });
      }

      const user = await db.User.findOne({
        where: {
          id: userId,
        },
      });
      if (user) {
        if (roleId === "R5" || roleId === "R4" || roleId === "R3") {
          const postsData = await db.Post.create({
            userId: userId,
            title: title,
            contentMarkdown: textMarkDown,
            contentHTML: textHtmlMarkDown,
            type: type,
            date: new Date().getTime(),
            status: "S1",
            image: image,
            // commentsId: postsData.dataValues.id,
          });
          // console.log(postsData);
          if (postsData) {
            const updatePost = await db.Post.findOne({
              where: {
                id: postsData.dataValues.id,
              },
              attributes: ["id", "commentsId"],
              raw: false,
              nest: true,
            });
            if (updatePost) {
              // console.log(updatePost);
              updatePost.commentsId = postsData.dataValues.id;
              await updatePost.save();
            }
            // resolve({
            //   statusCode: 2,
            //   postsId: postsData.dataValues.id,
            //   message: "create post successful",
            // });
            // await db.Post.create({
            //   commentsId: postsData.dataValues.id,
            // });
          }
        } else {
          const postsData = await db.Post.create({
            userId: userId,
            title: title,
            contentMarkdown: textMarkDown,
            contentHTML: textHtmlMarkDown,
            type: type,
            date: new Date().getTime(),
            image: image,
            // commentsId: postsData.dataValues.id,
          });
          if (postsData) {
            const updatePost = await db.Post.findOne({
              where: {
                id: postsData.dataValues.id,
              },
              attributes: ["id", "commentsId"],
              raw: false,
              nest: true,
            });
            if (updatePost) {
              // console.log(updatePost);
              updatePost.commentsId = postsData.dataValues.id;
              await updatePost.save();
            }
            resolve({
              statusCode: 2,
              postsId: postsData.dataValues.id,
              message: "create post successful",
            });
          }
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

const handleServiceGetListPosts = (currentPage) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (currentPage > 0) {
        const skip = (currentPage - 1) * PAGE_SIZE;
        const posts = await db.Post.findAll({
          limit: PAGE_SIZE,
          offset: skip,
          where: {
            status: "S1",
          },
          /// DESC giảm dần
          order: [["id", "DESC"]],
          /// giảm tăng
          // order: [["id", "ASC"]],
          attributes: [
            "id",
            "title",
            "date",
            "userId",
            "type",
            "image",
            "status",
          ],
          include: [
            {
              model: db.User,
              as: "userData",
              attributes: ["id", "fullName", "image", "roleId"],
            },
            {
              model: db.AllCode,
              as: "statusData",
              attributes: ["id", "KeyMap", "valueEn", "valueVi"],
            },
          ],
          raw: true,
          nest: true,
        });
        // console.log(posts);
        if (posts) {
          // console.log(posts);
          // console.log("posts", JSON.stringify(posts));
          posts.forEach(async (element) => {
            if (element.userData.image) {
              const base64 = await Buffer.from(
                element.userData.image,
                "base64"
              ).toString("binary");
              element.userData.image = base64;
            }
          });
          resolve({
            statusCode: 2,
            posts,
            currentPage,
            pageSize: PAGE_SIZE,
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

const handeServiceDetailPost = ({ postId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const posts = await db.Post.findOne({
        where: {
          id: postId,
        },
        attributes: [
          "id",
          "contentHTML",
          "contentMarkdown",
          "date",
          "image",
          "title",
          "likeSize",
          "likeId",
        ],
        // attributes: {
        //   exclude: ["createdAt", "updatedAt"],
        // },
        include: [
          {
            model: db.User,
            as: "userData",
            attributes: ["id", "fullName", "image"],
          },
          {
            model: db.Like,
            as: "likeData",
            attributes: ["id", "postId", "userId"],
          },
        ],
        raw: false,
        nest: true,
      });
      // console.log("post", post.userData.image);
      const postsCopy = JSON.parse(JSON.stringify(posts));
      // console.log("postsCopy", postsCopy);
      if (postsCopy && postsCopy.userData.image) {
        const base64 = await Buffer.from(
          postsCopy.userData.image,
          "base64"
        ).toString("binary");
        postsCopy.userData.image = base64;
      }
      resolve({
        statusCode: 2,
        post: postsCopy,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const handleServiceLikePost = (dataPost, userId) => {
  return new Promise(async (resolve, reject) => {
    // console.log(dataPost, dataUserId);
    const { postId } = dataPost;
    const postData = await db.Post.findOne({
      where: {
        id: postId,
      },
      attributes: ["id", "userId", "likeId", "likeSize"],
      raw: false,
      nest: true,
    });
    if (postData) {
      // console.log(postData);
      let sizeLike = postData.dataValues.likeSize;
      const postsId = postData.dataValues.id;
      // console.log(sizeLike);

      const likeData = await db.Like.findOne({
        where: {
          userId: userId,
          postId: postsId,
        },
      });
      if (likeData) {
        await db.Like.destroy({
          where: {
            userId: userId,
            postId: postsId,
          },
        });
        postData.likeSize = sizeLike -= 1;
        await postData.save();
        resolve({
          statusCode: 3,
          message: "user already like posts",
        });
      } else {
        postData.likeSize = sizeLike += 1;
        await postData.save();

        await db.Like.create({
          userId: userId,
          postId: postsId,
        });

        // await db.Notification.create({

        // })

        // global.io.emit("resNotificationLike", dataPost);
      }

      resolve({
        statusCode: 2,
        message: "ok",
      });
    }
  });
};

const handleServiceSearchPosts = (valueSearch) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { value, type } = valueSearch;
      // console.log(type);
      // console.log(value);
      if (value) {
        const searchPosts = await db.Post.findAll({
          where: {
            // title: value,
            title: {
              [Op.like]: "%" + value + "%",
            },
          },
          include: [
            {
              model: db.User,
              as: "userData",
              attributes: ["id", "fullName", "image"],
            },
          ],
          raw: true,
          nest: true,
        });
        // console.log(searchPosts);
        if (searchPosts) {
          resolve({
            statusCode: 2,
            data: searchPosts,
          });
        }
      }
      if (type) {
        const searchPosts = await db.Post.findAll({
          where: {
            // title: value,
            type: {
              [Op.like]: "%" + type + "%",
            },
          },
          include: [
            {
              model: db.User,
              as: "userData",
              attributes: ["id", "fullName", "image"],
            },
          ],
          raw: true,
          nest: true,
        });
        resolve({
          statusCode: 2,
          data: searchPosts,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const handleServiceGetAllPostsByUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const postData = await db.Post.findAll({
        limit: 5,
        offset: 0,
        where: {
          userId: userId,
        },
        /// DESC giảm dần
        order: [["id", "DESC"]],
        /// giảm tăng
        // order: [["id", "ASC"]],
        attributes: [
          "id",
          "userId",
          "commentsId",
          "date",
          "title",
          "contentHTML",
          "contentMarkdown",
          "description",
          "status",
          "type",
          "likeId",
          "likeSize",
          "image",
        ],
      });
      if (postData) {
        resolve({ statusCode: 2, data: postData });
      }
    } catch (error) {
      reject(error);
    }
  });
};

// const handleServiceGetAllPostsByUser = (userId) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       // console.log(userId);
//       // const skip = (currentPage - 1) * PAGE_SIZE;
//       const postsUser = await db.Post.findAll({
//         limit: 5,
//         offset: 0,
//         where: {
//           userId: userId,
//         },
//         order: [["id", "DESC"]],
//       });

//       console.log("postsUser", postsUser);
//       // if (postsUser) {
//       //   resolve({
//       //     statusCode: 2,
//       //     data: postsUser,
//       //     // data: JSON.stringify(postsUser),
//       //   });
//       // }
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

const handleServiceDeletePosts = ({ postsData }) => {
  // console.log(postsData);
  return new Promise(async (resolve, reject) => {
    try {
      if (!postsData) {
        resolve({
          statusCode: 4,
          message: "you are missing a required parameter",
        });
      } else {
        const type = postsData.type;
        const postsId = postsData.postsId;
        if (type === "delete") {
          const foundPosts = await db.Post.findOne({
            where: {
              id: postsId,
            },
            attributes: ["id", "userId", "likeId"],
          });
          if (!foundPosts) {
            resolve({
              statusCode: 4,
              message: `the posts ins't exist`,
            });
          }
          // console.log(foundPosts);
          await db.Post.destroy({
            where: {
              id: postsId,
            },
          });
          await db.Like.destroy({
            where: {
              postId: postsId,
            },
          });
          resolve({
            statusCode: 2,
            message: `the posts in deleted`,
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

const handleServiceEditPosts = (postsData) => {
  return new Promise(async (resolve, reject) => {
    // console.log(postsData);
    try {
      if (!postsData) {
        resolve({
          statusCode: 4,
          message: "you are missing a required parameter",
        });
      }
      const resultPosts = await db.Post.findOne({
        where: {
          id: postsData.postId,
        },
        raw: false,
        nest: true,
      });
      if (resultPosts && postsData.editPosts) {
        resultPosts.title = postsData.editPosts.title;
        resultPosts.contentMarkdown = postsData.editPosts.textMarkDown;
        resultPosts.contentHTML = postsData.editPosts.textHtmlMarkDown;
        resultPosts.type = postsData.editPosts.type;
        resultPosts.image = postsData.editPosts.image;

        await resultPosts.save();

        resolve({
          statusCode: 2,
          message: "update the posts succeeds",
        });
      }
      resolve({ statusCode: 2, data: resultPosts });
    } catch (error) {
      reject(error);
    }
  });
};

const handleServiceVerifyPosts = ({ status }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!status) {
        resolve({
          statusCode: 4,
          message: "you are missing a required parameter",
        });
      }
      const posts = await db.Post.findAll({
        limit: 7,
        offset: 0,
        where: {
          status: status,
        },
        order: [["id", "DESC"]],
        attributes: ["id", "title", "status", "date", "image", "userId"],
        include: [
          {
            model: db.User,
            as: "userData",
            attributes: ["id", "fullName", "roleId"],
          },
        ],
        raw: false,
        nest: true,
      });
      resolve({
        statusCode: 2,
        data: posts,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const handleServiceConfirmPosts = (statusData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const postsId = statusData.status.postsId;
      const status = statusData.status.status;
      if (!postsId) {
        resolve({
          statusCode: 4,
          message: "you are missing a required parameter",
        });
      }
      const posts = await db.Post.findOne({
        where: {
          id: postsId,
        },
        attributes: ["id", "title", "status", "date", "userId"],
        raw: false,
        nest: true,
      });
      if (posts) {
        posts.status = status;
        await posts.save();
        resolve({
          statusCode: 2,
          message: "confirm the posts succeeds",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const handleServiceGetAllPosts = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log("check", data);
      const { value, collum, name } = data;
      if (value && collum && name) {
        const postData = await db.Post.findAll({
          attributes: [
            "id",
            "userId",
            "date",
            "title",
            "contentHTML",
            "contentMarkdown",
            "description",
            "status",
            "likeId",
            "type",
            "image",
            "likeSize",
          ],
          // order: [["id", "DESC"]],
          order: [[`${collum}`, `${value}`]],
          include: [
            {
              model: db.User,
              as: "userData",
              attributes: ["id", "fullName", "roleId"],
            },
            {
              model: db.Comments,
              as: "commentsData",
              attributes: ["id", "authorId", "postId"],
            },
          ],
          raw: false,
          nest: true,
        });
        if (postData) {
          resolve({
            statusCode: 2,
            data: postData,
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  handleServiceCreatePost,
  handleServiceGetListPosts,
  handeServiceDetailPost,
  handleServiceLikePost,
  handleServiceSearchPosts,
  handleServiceGetAllPostsByUser,
  handleServiceDeletePosts,
  handleServiceEditPosts,
  handleServiceVerifyPosts,
  handleServiceConfirmPosts,
  handleServiceGetAllPosts,
  // handleServiceQuitLikePosts,
};
