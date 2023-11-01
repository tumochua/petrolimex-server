import db from "../models/index";
import {
    userCheckEmail,
    useHasPassword,
    useDecodePassword,
} from "../use/hooks";

import {
    useAccessToken,
    useRefreshToken,
    userVervifyRefreshToken,
} from "../jwt/useJwt";


const handleServiceGetAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {

            const allUsers = await db.User.findAll({
                attributes: {
                    exclude: ["password_hash", 'refresh_token'],
                },
                include: [
                    {
                        model: db.Role,
                        as: "roleData",
                        // attributes: [
                        //     "id",
                        //     "roleId",
                        //     "role_name",
                        // ],
                    },
                    {
                        model: db.Timekeeping,
                        as: "timekeepingData",
                        // attributes: [
                        //     "id",
                        //     "userId",
                        //     "hour_come",
                        //     "return_time"
                        // ],
                    },
                    {
                        model: db.Salary,
                        as: "salaryData",
                        // attributes: [
                        //     "id",
                        //     "userId",
                        //     "roleId",
                        //     "basic_salary"
                        // ],
                    },
                ],
                raw: false,
                nest: true,
            });
            // console.log("allUsers", allUsers);
            resolve({
                statusCode: 2,
                data: allUsers,
            });
        } catch (error) {
            reject(error);
        }
    });
}

const handleRegisterUserService = (user) => {
    return new Promise(async (resolve, reject) => {
        const { email, password, firstName, lastName } = user;
        try {
            if (!email || !password || !firstName || !lastName) {
                resolve({
                    status: 400,
                    message: "you are missing a required parameter",
                });
            }

            const data = await userCheckEmail(email);
            console.log('data', data);
            const hashPassword = await useHasPassword(password);
            if (!data) {
                await db.User.create({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password_hash: hashPassword,
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

const handleServiceLoginUser = (userInfor) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await userCheckEmail(userInfor.email);
            if (!data) {
                resolve({
                    statusCode: 4,
                    message: "Your login information is incorrect",
                });
                return;
            }
            if (data) {
                const passwordHash = data.password_hash;
                const userId = data.id;

                const password = await useDecodePassword(userInfor.password, passwordHash);
                if (password && data) {
                    const accessToken = await useAccessToken(userId);
                    const refreshToken = await useRefreshToken(userId);
                    delete data.password_hash;

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
}

const handleServiceGetProfileUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            /// findAll
            const data = await db.User.findOne({
                where: {
                    id: userId,
                },
                attributes: {
                    exclude: ["password_hash", 'refresh_token'],
                },
                include: [
                    {
                        model: db.Role,
                        as: "roleData",
                        // attributes: [
                        //     "id",
                        //     "roleId",
                        //     "role_name",
                        // ],
                    },
                    {
                        model: db.Timekeeping,
                        as: "timekeepingData",
                        // attributes: [
                        //     "id",
                        //     "userId",
                        //     "hour_come",
                        //     "return_time"
                        // ],
                    },
                    {
                        model: db.Salary,
                        as: "salaryData",
                        // attributes: [
                        //     "id",
                        //     "userId",
                        //     "roleId",
                        //     "basic_salary"
                        // ],
                    },
                    {
                        model: db.Shift,
                        as: "shiftData",
                    },
                    // {
                    //     model: db.Notification,
                    //     as: "notificationData",
                    // },
                    // {
                    //     model: db.Sales,
                    //     as: "saleData",
                    // },
                ],
                raw: false,
                nest: true,
            });

            resolve({
                statusCode: 2,
                data,
            });
        } catch (error) {
            reject(error);
        }
    });
}

const handleServiceCreateNotication = (userId, notificationData) => {
    return new Promise(async (resolve, reject) => {
        try {
            // console.log(userId || notificationData.title || notificationData.content);
            if (!userId || !notificationData.title || !notificationData.content) {
                resolve({
                    status: 400,
                    message: "you are missing a required parameter",
                });
            }
            await db.Notification.create({
                userId: userId,
                title: notificationData.title,
                content: notificationData.content
            })
            resolve({ statusCode: 2, message: "create notification successful" });
        } catch (error) {
            reject(error);
        }
    });
}


const handleServiceCreateShift = (id, dataShift) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.Shift.create({
                userId: dataShift.userId,
                time: dataShift?.data?.shifts
            })
            resolve({ statusCode: 2, message: "create notification successful" });

        } catch (error) {
            reject(error);
        }
    });
}


const handleServiceDeleteUser = (userId, deleteUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(userId, deleteUserId);
        } catch (error) {
            reject(error);
        }
    });
}


module.exports = {
    handleServiceGetAllUser,
    handleServiceLoginUser,
    handleRegisterUserService,
    handleServiceGetProfileUser,
    handleServiceCreateNotication,
    handleServiceCreateShift,
    handleServiceDeleteUser
}