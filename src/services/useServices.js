const cron = require('node-cron');

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
                order: [["id", "ASC"]],
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
        const { email, password, firstName, lastName, cccd, dob, education, gender, home_town, nation, mobile, address } = user;
        try {
            if (!email || !password || !firstName || !lastName || !cccd || !dob || !education || !gender || !home_town || !nation) {
                resolve({
                    status: 400,
                    message: "you are missing a required parameter",
                });
            }

            const data = await userCheckEmail(email);
            // console.log('data', data);
            const hashPassword = await useHasPassword(password);
            console.log("check hashPassword", hashPassword);

            if (!data) {
                await db.User.create({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password_hash: hashPassword,
                    cccd: cccd,
                    dob: dob,
                    education: education,
                    gender: gender,
                    home_town: home_town,
                    nation: nation,
                    mobile: mobile,
                    address: address
                });

                resolve({ statusCode: 2, message: "create user successful" });
            } else {
                resolve({ statusCode: 4, message: `${data.email} Your have not` });
            }
        } catch (error) {
            console.log('check error', error);

            // createError.InternalServerError();
            reject(error);
        }
    });
};

const handleServiceLoginUser = (userInfor) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await userCheckEmail(userInfor.email);
            // console.log(data);
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
            console.log(dataShift);

            await db.Shift.create({
                userId: dataShift.userId,
                time: dataShift?.data?.date,
                shift: dataShift?.data?.shifts,
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
            console.log(deleteUserId.userId);
            await db.User.destroy({
                where: {
                    id: deleteUserId.userId
                }
            })
            resolve({
                statusCode: 2,
                message: `the user in deleted`,
            });
        } catch (error) {
            reject(error);
        }
    });
}

const handleServiceCreateTimeKeeing = (userId, timekeeping) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.Timekeeping.create({
                userId: timekeeping.userId,
                time: timekeeping.time,
                type: timekeeping.type
            })
            resolve({ statusCode: 2, message: "create timekeeing successful" });

        } catch (error) {
            reject(error);
        }
    });
}


const handleServiceGetAllTimeKeeing = (userId, roleId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (roleId === 'R2' || roleId === 'R1') {
                const allTimekeeing = await db.Timekeeping.findAll({
                    order: [["id", "DESC"]],
                })
                resolve({ statusCode: 2, data: allTimekeeing });
            } else {
                const listTimekeeing = await db.Timekeeping.findAll({
                    where: {
                        userId: userId,
                    },
                    order: [["id", "DESC"]],
                })
                resolve({ statusCode: 2, data: listTimekeeing });
            }

        } catch (error) {
            reject(error);
        }
    });
}

const handleServiceCountSalary = (userId, salary) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (salary.type === 'nv') {
                await db.Salary.create({
                    userId: userId,
                    basic_salary: salary.data.salaryBase,
                    allowance: salary.data.allowance,
                    subsidize: salary.data.subsidize,
                    time: salary.data.time,
                })
                resolve({ statusCode: 2, message: "create salary successful" });
            } else {
                await db.Salary.create({
                    userId: userId,
                    basic_salary: salary.data.salaryBase,
                    allowance: salary.data.allowance,
                    responsibility: salary.data.subsidize,
                    time: salary.data.time,
                })
                resolve({ statusCode: 2, message: "create salary successful" });

            }

        } catch (error) {
            reject(error);
        }
    });
}

const handleServiceGetAllSalary = (userId, roleId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const allSalary = await db.Salary.findAll()
            resolve({ statusCode: 2, data: allSalary });
        } catch (error) {
            reject(error);
        }
    });
}


const handleServiceEditRole = (userId, role) => {
    return new Promise(async (resolve, reject) => {
        try {
            const userData = await db.User.findOne({
                where: {
                    id: role.userId
                },
                attributes: ['id', 'roleId'],
                raw: false,
                nest: true,
            })
            // console.log(role);
            // console.log(userData);
            if (userData) {
                userData.roleId = role.role
            }
            await userData.save();

            resolve({
                statusCode: 2,
                message: "edit role successful",
            });
        } catch (error) {
            reject(error);
        }
    });
}
const handleServiceGetAllNotification = (userId, role) => {
    return new Promise(async (resolve, reject) => {
        try {
            const allNotification = await db.Notification.findAll({
                order: [["id", "DESC"]],
            })
            resolve({
                statusCode: 2,
                message: allNotification,
            });
        } catch (error) {
            reject(error);
        }
    });
}

const handleServiceCreateSale = (userId, sales) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.Sales.create({
                userId: userId,
                day_for_sale: sales.time,
                price: sales.price,
                sales_figures_day: sales.size,
                type: sales.type
            })
            resolve({ statusCode: 2, message: "create sale successful" });

        } catch (error) {
            reject(error);
        }
    });
}

const handleServiceGetAllSale = (userId, roleId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (roleId === "R1" || roleId === 'R2') {
                const allSales = await db.Sales.findAll()
                if (allSales) {
                    resolve({ statusCode: 2, data: allSales });
                }
            } else {
                resolve({ statusCode: 4, message: 'can not role' });
            }
        } catch (error) {
            reject(error);
        }
    });
}

// let cronJob = null;
// const startScheduledReset = (timeInSeconds) => {
//     if (cronJob) {
//         // Nếu công việc lên lịch đã tồn tại, hủy nó trước khi tạo công việc mới
//         cronJob.stop();
//     }

//     cronJob = cron.schedule(`*/${timeInSeconds} * * * * *`, async () => {
//         try {
//             await db.Sales.destroy({
//                 where: {}, // Điều kiện để xóa, rỗng để xóa hết dữ liệu
//                 truncate: true // Chọn truncate để xóa dữ liệu nhanh hơn
//             });
//             console.log('Reset sales successful');
//         } catch (error) {
//             console.error('Error resetting sales:', error);
//         }
//     });
// };

// const handleServiceResetSales = async (timeRest) => {
//     try {
//         const timeInSeconds = parseInt(timeRest.TIME_RESET); // Chuyển đổi giá trị thời gian sang số nguyên

//         if (timeRest.isResetting) {
//             if (isNaN(timeInSeconds) || timeInSeconds <= 0) {
//                 return { statusCode: 1, message: 'Invalid time value.' };
//             }

//             startScheduledReset(timeInSeconds);
//             return { statusCode: 2, message: 'Reset sales scheduled' };
//         }

//         if (cronJob) {
//             cronJob.stop();
//             cronJob = null;
//             return { statusCode: 3, message: 'Reset canceled' };
//         }

//         return { statusCode: 0, message: 'No action taken' };
//     } catch (error) {
//         return { statusCode: 4, message: 'Error handling service reset' };
//     }
// };

let resetJob = null;
const handleServiceResetSales = (timeRest) => {
    return new Promise(async (resolve, reject) => {
        try {
            const timeInSeconds = parseInt(timeRest.TIME_RESET); // Chuyển đổi giá trị thời gian sang số nguyên
            if (timeRest.isResetting) {
                resetJob = cron.schedule(`*/${timeInSeconds} * * * * *`, async () => {
                    try {
                        await db.Sales.destroy({
                            where: {}, // Điều kiện để xóa, rỗng để xóa hết dữ liệu
                            truncate: true // Chọn truncate để xóa dữ liệu nhanh hơn
                        });

                        resolve({ statusCode: 2, message: 'Reset sale successful' });

                    } catch (error) {
                        resolve({ statusCode: 4, message: 'Reset sale error' });
                    }
                });
            } else {
                resetJob.stop()
                resetJob = null
                return { statusCode: 3, message: 'Reset canceled' };
            }

        } catch (error) {
            reject(error);
        }
    });
}

// let resetJob = null;
// // let isResetting = false
// const handleServiceResetSales = (timeRest) => {
//     try {
//         const timeInSeconds = parseInt(timeRest.TIME_RESET);
//         console.log(timeRest);
//         // isResetting = true
//         if (timeRest.isResetting) {
//             // isResetting = false
//             if (!resetJob) {
//                 resetJob = cron.schedule(`*/${timeInSeconds} * * * * *`, async () => {
//                     try {
//                         await db.Sales.destroy({
//                             where: {}, // Điều kiện để xóa, rỗng để xóa hết dữ liệu
//                             truncate: true // Chọn truncate để xóa dữ liệu nhanh hơn
//                         });
//                         console.log('Reset sale successful');
//                     } catch (error) {
//                         console.error('Reset sale error:', error);
//                     }
//                 });
//                 resolve({ statusCode: 2, message: 'Reset sale successful' });
//             } else {
//                 return { statusCode: 1, message: 'Reset already scheduled' };
//             }
//         } else {
//             if (resetJob) {
//                 resetJob.stop();
//                 resetJob = null;
//                 return { statusCode: 3, message: 'Reset canceled' };
//             } else {
//                 return { statusCode: 4, message: 'No action taken' };
//             }
//         }

//     } catch (error) {
//         return { statusCode: 0, message: 'Error occurred in handling reset' };
//     } finally {
//         // isResetting = false
//     }
// };



const handleServiceGetUserById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const findUserById = await db.User.findOne({
                where: {
                    id: userId
                },
                exclude: ['password_hash', 'refresh_token']
            })
            if (findUserById) {
                resolve({ statusCode: 2, data: findUserById });
            }
        } catch (error) {
            reject(error);
        }
    });
}

const handleServiceEditUsersById = (users) => {
    return new Promise(async (resolve, reject) => {
        try {
            // console.log(users.users);
            const findUser = await db.User.findOne({
                where: {
                    id: users.users.userId
                },
                attributes: {
                    exclude: ["password_hash", 'refresh_token'],
                },
                raw: false,
                nest: true,
            })
            if (findUser) {
                findUser.firstName = users.users.firstName
                findUser.lastName = users.users.lastName
                findUser.address = users.users.address
                findUser.dob = users.users.dob
                findUser.home_town = users.users.home_town
                findUser.gender = users.users.gender
                findUser.education = users.users.education
                findUser.nation = users.users.nation
                findUser.mobile = users.users.mobile ? users.users.mobile : null
                findUser.cccd = users.users.cccd
            }
            await findUser.save();
            resolve({
                statusCode: 2,
                message: "edit user successful",
            });
        } catch (error) {
            reject(error);
        }
    });
}
const handleServiceCreateReport = (reportFile, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (reportFile) {

                await db.Report.create({
                    userId: userId,
                    file: reportFile
                })

                resolve({
                    statusCode: 2,
                    message: "edit user successful",
                });
            }
        } catch (error) {
            reject(error);
        }
    });
}

const handleServiceListShift = (r) => {
    return new Promise(async (resolve, reject) => {
        try {
            const listShift = await db.Shift.findAll({
                include: [
                    {
                        model: db.User,
                        as: "shiftData",
                        attributes: ["id", "firstName", "lastName", "email"] // chỉ lấy field cần
                    }
                ],
                raw: true, // ép trả về plain object
                nest: true // giúp giữ nested object đúng theo `as`
            });

            resolve({
                statusCode: 2,
                data: listShift
            });
        } catch (error) {
            reject(error);
        }
    });
};


const handleServiceListSale = (r) => {
    return new Promise(async (resolve, reject) => {
        try {
            const listSale = await db.Sales.findAll({

            });

            resolve({
                statusCode: 2,
                data: listSale
            });
        } catch (error) {
            reject(error);
        }
    });
};


module.exports = {
    handleServiceGetAllUser,
    handleServiceLoginUser,
    handleRegisterUserService,
    handleServiceGetProfileUser,
    handleServiceCreateNotication,
    handleServiceCreateShift,
    handleServiceDeleteUser,
    handleServiceCreateTimeKeeing,
    handleServiceGetAllTimeKeeing,
    handleServiceCountSalary,
    handleServiceGetAllSalary,
    handleServiceEditRole,
    handleServiceGetAllNotification,
    handleServiceCreateSale,
    handleServiceGetAllSale,
    handleServiceResetSales,
    handleServiceGetUserById,
    handleServiceEditUsersById,
    handleServiceCreateReport,
    handleServiceListShift,
    handleServiceListSale
}