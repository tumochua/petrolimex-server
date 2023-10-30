import createError from "http-errors";
import db from "../models";
import {
  useAccessToken,
  useRefreshToken,
  userVervifyRefreshToken,
} from "../jwt/useJwt";

import {
  userCheckEmail,
  useHasPassword,
  useDecodePassword,
} from "../use/hooks";
import client from "../helpers/connection-redis";

const handleRegisterService = (user) => {
  return new Promise(async (resolve, reject) => {
    const { email, password, fullName } = user;
    try {
      if (!email || !password || !fullName) {
        resolve({
          status: 400,
          message: "you are missing a required parameter",
        });
      }

      const data = await userCheckEmail(email);
      const hashPassword = await useHasPassword(password);
      if (!data) {
        await db.User.create({
          fullName: fullName,
          email: email,
          passwordHash: hashPassword,
        });

        resolve({ statusCode: 2, message: "create user successful" });
      } else {
        resolve({ statusCode: 4, message: `${data.email} Your have not` });
      }
    } catch (error) {
      createError.InternalServerError();
      reject(error);
    }
  });
};

const handleLoginService = (user) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await userCheckEmail(user.email);
      if (!data) {
        resolve({
          statusCode: 4,
          message: "Your login information is incorrect",
        });
        return;
      }
      if (data) {
        const passwordHash = data.passwordHash;
        const userId = data.id;

        const password = await useDecodePassword(user.password, passwordHash);
        if (password && data) {
          const accessToken = await useAccessToken(userId);
          const refreshToken = await useRefreshToken(userId);
          delete data.passwordHash;

          resolve({
            statusCode: 2,
            user: data,
            accessToken: accessToken,
            refreshToken: refreshToken,
          });
        } else {
          resolve({
            statusCode: 4,
            message: "Your login information is incorrect",
          });
        }
      } else {
        resolve({
          statusCode: 4,
          message: "Your login information is incorrect",
        });
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

const handleRefreshTokenService = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log(params);
      const authHeader = params.authorization;
      if (!authHeader) {
        resolve("token not found");
      }
      const tokenBearer = authHeader.split(" ");
      const token = tokenBearer[1];
      const data = await userVervifyRefreshToken(token);
      const { userId } = data;
      const accessToken = await useAccessToken(userId);
      // const refreshToken = await useRefreshToken(userId);
      // console.log("refreshToken", refreshToken);
      resolve({ accessToken });
    } catch (error) {
      reject(error);
    }
  });
};
const handleLogoutService = (header) => {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log(params);
      const authHeader = header.authorization;
      if (!authHeader) {
        resolve("token not found");
      }
      const tokenBearer = authHeader.split(" ");
      const token = tokenBearer[1];
      // console.log("check token", token);
      const data = await userVervifyRefreshToken(token);
      const userId = data.userId;
      if (userId) {
        const deleteKeyRedis = await client.del(userId.toString());
        if (deleteKeyRedis === 1) {
          resolve("logout");
        } else {
          resolve("not found");
        }
      } else {
        resolve("token not found");
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  handleRegisterService,
  handleLoginService,
  handleRefreshTokenService,
  handleLogoutService,
};
