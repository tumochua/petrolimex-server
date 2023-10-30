import bcrypt from "bcryptjs";
import db from "../models/index";
const salt = bcrypt.genSaltSync(10);

const userCheckEmail = async (email) => {
  try {
    const data = await db.User.findOne({ where: { email: email } });
    if (data) {
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

const useHasPassword = async (password) => {
  try {
    const hashPassword = await bcrypt.hashSync(password, salt);
    return hashPassword;
  } catch (error) {
    console.log(error);
  }
};
const useDecodePassword = async (password, hashPassword) => {
  try {
    const decode = await bcrypt.compareSync(password, hashPassword);
    return decode;
  } catch (error) {
    console.log(error);
  }
};

const userfindOneUser = (userId, relationship = true) => {
  return new Promise(async (resolve, reject) => {
    if (relationship) {
      if (userId) {
        try {
          const user = await db.User.findOne({
            where: {
              id: userId,
            },
            attributes: {
              exclude: ["passwordHash"],
            },
            include: [
              {
                model: db.AllCode,
                as: "genderData",
                attributes: ["id", "KeyMap", "valueEn", "valueVi"],
              },
              {
                model: db.AllCode,
                as: "roleData",
                attributes: ["id", "KeyMap", "valueEn", "valueVi"],
              },
            ],
            raw: false,
            nest: true,
          });
          resolve({
            user,
          });
        } catch (error) {
          console.log(error);
          reject(error);
        }
      } else {
        resolve("profile not found");
      }
    } else {
      const user = await db.User.findOne({
        where: {
          id: userId,
          raw: false,
        },
        attributes: {
          exclude: ["passwordHash"],
        },
      });
      resolve({
        user,
      });
    }
  });
};

module.exports = {
  userCheckEmail,
  useHasPassword,
  useDecodePassword,
  userfindOneUser,
};
