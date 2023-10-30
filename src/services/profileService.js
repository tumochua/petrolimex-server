import { Op } from "sequelize";
import db from "../models";
import { ConvertBuffer } from "../use/Avatarts";

const profileService = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      /// findAll
      const data = await db.User.findOne({
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
          {
            model: db.Parents,
            as: "parentData",
            attributes: [
              "id",
              "userId",
              "mobile",
              "fullNameFather",
              "fullNameMommy",
            ],
            include: [
              {
                model: db.AllCode,
                as: "genderMommyData",
                attributes: ["id", "KeyMap", "valueEn", "valueVi"],
              },
              {
                model: db.AllCode,
                as: "genderFatherData",
                attributes: ["id", "KeyMap", "valueEn", "valueVi"],
              },
            ],
          },
          {
            model: db.Class_Students,
            as: "classData",
            attributes: ["id", "keyMap", "studentId", "className"],
          },
        ],
        raw: true,
        nest: true,
      });
      // console.log(data);
      // console.log("data", data.classId);
      // console.log(data);
      if (data && data.image) {
        const base64 = await Buffer.from(data.image, "base64").toString(
          "binary"
        );
        data.image = base64;
      }
      resolve({
        statusCode: 2,
        data,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const handleUpdateService = (data, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const userData = await db.User.findOne({
        where: {
          id: userId,
        },
        attributes: {
          exclude: ["passwordHash", "createdAt", "updatedAt"],
        },
        include: [
          {
            model: db.Parents,
            as: "parentData",
            attributes: [
              "id",
              "userId",
              "mobile",
              "fullNameFather",
              "fullNameMommy",
            ],
          },
        ],
        raw: false,
        nest: true,
      });
      // console.log(!userData.dataValues.parentData);
      // console.log(data);
      if (userData) {
        userData.fullName = data.userName;
        userData.email = data.email;
        userData.dob = data.birthday;
        userData.image = data.avatar;
        userData.mobile = data.mobile;
        userData.genderId = data.gender;
        userData.classId = data.className;
        userData.address = data.address;
        await userData.save();
        if (!userData.dataValues.parentData) {
          await db.Parents.create({
            userId: userId,
            fullNameFather: data.userDad,
            fullNameMommy: data.userMother,
            mobile: data.mobileContact,
          });
        } else {
          const familyData = await db.Parents.findOne({
            where: {
              userId: userId,
            },
            attributes: [
              "id",
              "userId",
              "mobile",
              "fullNameFather",
              "fullNameMommy",
            ],
            raw: false,
            nest: true,
          });
          if (familyData) {
            (familyData.mobile = data.mobileContact),
              (familyData.fullNameFather = data.userDad),
              (familyData.fullNameMommy = data.userMother);
          }
          await familyData.save();
        }
        resolve({
          statusCode: 2,
          message: "update the user and family succeeds",
        });
      } else {
        resolve({
          statusCode: 4,
          errMessage: `user's not found`,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const handleGetListStudentService = (className) => {
  // console.log("className", className);
  return new Promise(async (resolve, reject) => {
    try {
      /// findAll
      const resopnseClass = await db.Class_Students.findOne({
        where: {
          className: className,
        },
        attributes: ["id", "keyMap", "className"],
        include: [
          // {
          //   // separate: true,
          //   model: db.User,
          //   as: "classData",
          //   attributes: ["id", "fullName", "dob", "classId"],
          //   // separate: true, // <--- Run separate query
          //   // limit: 2,
          // },
        ],
        raw: false,
        nest: true,
      });
      // console.log("resopnseClass", resopnseClass);
      resolve({
        statusCode: 2,
        data: JSON.stringify(resopnseClass),
      });
    } catch (error) {
      reject(error);
    }
  });
};

const handleServiceCreateFamily = (userId, userData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!userId) {
        resolve({
          statusCode: 4,
          message: "you are missing a required parameter",
        });
      }
      const familyData = await db.Parents.findOne({
        where: {
          userId: userId,
        },
      });
      if (!familyData) {
        await db.Parents.create({
          userId: userId,
          fullNameFather: userData.userDad,
          fullNameMommy: userData.userMother,
          mobile: userData.mobileContact,
        });
        resolve({
          statusCode: 2,
          message: "create family succeeds",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const handleServiceGetAllStudentMannage = (currentUsers) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (currentUsers) {
        // console.log(currentUsers);
        const studentsData = await db.User.findAll({
          limit: currentUsers,
          offset: 0,
          where: {
            roleId: {
              [Op.or]: ["R0", "R1"],
            },
          },
          attributes: [
            "id",
            "fullName",
            "email",
            "address",
            "dob",
            "roleId",
            "mobile",
            "genderId",
            "classId",
            "image",
          ],
          order: [["id", "DESC"]],
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
            {
              model: db.Parents,
              as: "parentData",
              attributes: [
                "id",
                "userId",
                "mobile",
                "fullNameFather",
                "fullNameMommy",
              ],
              include: [
                {
                  model: db.AllCode,
                  as: "genderMommyData",
                  attributes: ["id", "KeyMap", "valueEn", "valueVi"],
                },
                {
                  model: db.AllCode,
                  as: "genderFatherData",
                  attributes: ["id", "KeyMap", "valueEn", "valueVi"],
                },
              ],
            },
          ],
          raw: true,
          nest: true,
        });
        // console.log(studentsLength.length);
        if (studentsData) {
          const studentsLength = await db.User.findAll({
            where: {
              roleId: {
                [Op.or]: ["R0", "R1"],
              },
            },
            attributes: ["id", "roleId"],
          });
          // console.log(studentsData);
          studentsData.forEach(async (element) => {
            if (element.image) {
              const base64 = await Buffer.from(
                element.image,
                "base64"
              ).toString("binary");
              element.image = base64;
            }
          });
          // if(studentsData && studentsData)
          resolve({
            statusCode: 2,
            data: studentsData,
            sizeUser: studentsLength.length,
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

const handleServiceGetUserById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (userId) {
        const userData = await db.User.findOne({
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
            {
              model: db.Parents,
              as: "parentData",
              attributes: [
                "id",
                "userId",
                "mobile",
                "fullNameFather",
                "fullNameMommy",
              ],
              include: [
                {
                  model: db.AllCode,
                  as: "genderMommyData",
                  attributes: ["id", "KeyMap", "valueEn", "valueVi"],
                },
                {
                  model: db.AllCode,
                  as: "genderFatherData",
                  attributes: ["id", "KeyMap", "valueEn", "valueVi"],
                },
              ],
            },
            {
              model: db.Class_Students,
              as: "classData",
              attributes: ["id", "keyMap", "studentId", "className"],
            },
          ],
          raw: true,
          nest: true,
        });
        if (userData) {
          resolve({ statusCode: 2, data: userData });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

const handleServiceMannageEditUser = (userData) => {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log(userData);
      const {
        userId,
        userName,
        email,
        birthday,
        avatar,
        address,
        mobile,
        gender,
        className,
        userDad,
        userMother,
        mobileContact,
        roleId,
      } = userData;
      // console.log(
      //   userId,
      //   userName,
      //   email,
      //   birthday,
      //   // avatar,
      //   address,
      //   mobile,
      //   gender,
      //   className,
      //   userDad,
      //   userMother,
      //   mobileContact
      // );
      if (userId) {
        const findUser = await db.User.findOne({
          where: {
            id: userId,
          },
          attributes: {
            exclude: [
              "passwordHash",
              "profile",
              "createdAt",
              "updatedAt",
              "date_of_join",
              "status",
              "last_login",
            ],
          },
          include: [
            {
              model: db.Parents,
              as: "parentData",
              attributes: [
                "id",
                "userId",
                "mobile",
                "fullNameFather",
                "fullNameMommy",
              ],
            },
          ],
          raw: false,
          nest: true,
        });
        if (findUser) {
          findUser.fullName = userName;
          findUser.email = email;
          findUser.dob = birthday;
          findUser.image = avatar;
          findUser.mobile = mobile;
          findUser.genderId = gender;
          findUser.classId = className;
          findUser.address = address;
          findUser.roleId = roleId;
          await findUser.save();
          if (!findUser.dataValues.parentData) {
            await db.Parents.create({
              userId: userId,
              fullNameFather: userDad,
              fullNameMommy: userMother,
              mobile: mobileContact,
            });
          } else {
            const familyData = await db.Parents.findOne({
              where: {
                userId: userId,
              },
              attributes: [
                "id",
                "userId",
                "mobile",
                "fullNameFather",
                "fullNameMommy",
              ],
              raw: false,
              nest: true,
            });
            if (familyData) {
              (familyData.mobile = mobileContact),
                (familyData.fullNameFather = userDad),
                (familyData.fullNameMommy = userMother);
            }
            await familyData.save();
          }
          resolve({
            statusCode: 2,
            message: "update the user and family succeeds",
          });
        } else {
          resolve({
            statusCode: 4,
            errMessage: `user's not found`,
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
const handleServiceMannageDeleteUser = ({ userId }, userIdDelete) => {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log(userId);
      const userRole = await db.User.findOne({
        where: {
          id: userIdDelete,
        },
        attributes: ["id", "roleId"],
      });
      if (userRole) {
        const roleId = userRole.roleId;
        if (roleId === "R5" || roleId === "R4" || roleId === "R3") {
          const userData = await db.User.findOne({
            where: {
              id: userId,
            },
            attributes: ["id", "roleId"],
          });
          // console.log(userData);
          if (userData) {
            await db.User.destroy({
              where: {
                id: userData.id,
              },
            });
            await db.Post.destroy({
              where: {
                userId: userData.id,
              },
            });
            await db.Parents.destroy({
              where: {
                userId: userData.id,
              },
            });
            await db.Like.destroy({
              where: {
                userId: userData.id,
              },
            });
            await db.Comments.destroy({
              where: {
                authorId: userData.id,
              },
            });
            await db.Notification.destroy({
              where: {
                userId: userData.id,
              },
            });

            resolve({
              statusCode: 2,
              message: `the user in deleted`,
            });
          }
        } else {
          resolve({ statusCode: 3, message: "Bạn Không Đủ Quyền Xóa User" });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

const handleServiceMannageGetDetailUser = ({ userId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (userId) {
        const userData = await db.User.findOne({
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
            {
              model: db.Parents,
              as: "parentData",
              attributes: [
                "id",
                "userId",
                "mobile",
                "fullNameFather",
                "fullNameMommy",
              ],
              include: [
                {
                  model: db.AllCode,
                  as: "genderMommyData",
                  attributes: ["id", "KeyMap", "valueEn", "valueVi"],
                },
                {
                  model: db.AllCode,
                  as: "genderFatherData",
                  attributes: ["id", "KeyMap", "valueEn", "valueVi"],
                },
              ],
            },
            {
              model: db.Class_Students,
              as: "classData",
              attributes: ["id", "keyMap", "studentId", "className"],
            },
          ],
          raw: true,
          nest: true,
        });
        if (userData) {
          const base64 = await ConvertBuffer(userData.image);
          if (base64) {
            userData.image = base64;
          }
          resolve({ statusCode: 2, data: userData });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
const handleServiceManageAllTeacher = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const teachData = await db.User.findAll({
        limit: 15,
        // limit: currentUsers,
        offset: 0,
        where: {
          roleId: "R2",
        },
        attributes: {
          exclude: ["passwordHash"],
        },
        order: [["id", "DESC"]],
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
        raw: true,
        nest: true,
      });

      if (teachData) {
        ///ConvertBuffer
        teachData.forEach(async (element) => {
          if (element.image) {
            const base64 = await Buffer.from(element.image, "base64").toString(
              "binary"
            );
            element.image = base64;
          }
        });
        // console.log(teachData);
        resolve({ statusCode: 2, data: teachData });
      }
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
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
};
