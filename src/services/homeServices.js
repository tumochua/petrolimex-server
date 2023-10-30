import db from "../models/index";

const handleGetlistUsers = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const listUsers = await db.User.findAll({
        attributes: {
          exclude: ["passwordHash"],
        },
      });
      resolve({
        statusCode: 2,
        data: listUsers,
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  handleGetlistUsers,
};
