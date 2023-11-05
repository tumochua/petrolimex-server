import {
    handleServiceGetAllUser, handleServiceLoginUser,
    handleRegisterUserService, handleServiceGetProfileUser,
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
    handleServiceCreateReport
} from '../services/useServices'

const handleGetAllUser = async (req, res) => {
    try {
        const data = await handleServiceGetAllUser();
        // console.log("data", data);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(200).json(error.message);
    }
};

const handleRegisterUser = async (req, res) => {
    try {
        const data = await handleRegisterUserService(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
    }
};

const handleLoginUser = async (req, res) => {
    try {
        const userInfor = req.body;
        const data = await handleServiceLoginUser(userInfor);

        if (data.accessToken && data.refreshToken) {
            res.cookie("accessToken", data.accessToken, {
                // httpOnly: true,
                // secure: true,
            });
            res.cookie("refreshToken", data.refreshToken, {
                // httpOnly: true,
                // secure: true,
            });
        }
        delete data.accessToken;
        delete data.refreshToken;

        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(200).json(error.message);
    }
}


const handleGetProfileUser = async (req, res) => {
    try {
        const userId = req.userId;
        const data = await handleServiceGetProfileUser(userId);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(200).json(error.message);
    }
}

const handleCreateNotication = async (req, res) => {
    try {
        const userId = req.userId;
        const dataShift = req.body;
        const data = await handleServiceCreateNotication(userId, dataShift);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(200).json(error.message);
    }
}

const handleCreateShift = async (req, res) => {
    try {
        const userId = req.userId;
        const notificationData = req.body;
        const data = await handleServiceCreateShift(userId, notificationData);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(200).json(error.message);
    }
}


const handleDeleteUser = async (req, res) => {
    try {
        const userId = req.userId;
        const deleteUserId = req.body;
        const data = await handleServiceDeleteUser(userId, deleteUserId);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(200).json(error.message);
    }
}
const handleCreateTimeKeeing = async (req, res) => {
    try {
        const userId = req.userId;
        const timekeeping = req.body;
        const data = await handleServiceCreateTimeKeeing(userId, timekeeping);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(200).json(error.message);
    }
}


const handleGetAllTimeKeeing = async (req, res) => {
    try {
        // console.log(req.query?.roleId);
        const userId = req.userId;
        const roleId = req.query?.roleId;
        const data = await handleServiceGetAllTimeKeeing(userId, roleId);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(200).json(error.message);
    }
}


const handleCountSalary = async (req, res) => {
    try {
        // console.log(req.query?.roleId);
        const userId = req.userId;
        const salary = req.body;
        const data = await handleServiceCountSalary(userId, salary);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(200).json(error.message);
    }
}


const handleGettAllSalary = async (req, res) => {
    try {
        const userId = req.userId;
        const roleId = req.query?.roleId;
        const data = await handleServiceGetAllSalary(userId, roleId);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(200).json(error.message);
    }
}

const handleEditRole = async (req, res) => {
    try {
        const userId = req.userId;
        const role = req.body;
        const data = await handleServiceEditRole(userId, role);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(200).json(error.message);
    }
}

const handleGetAllNotification = async (req, res) => {
    try {
        // const userId = req.userId;
        // const sales = req.body;
        const data = await handleServiceGetAllNotification();
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(200).json(error.message);
    }
}

const handleCreateSale = async (req, res) => {
    try {
        const userId = req.userId;
        const sales = req.body;
        const data = await handleServiceCreateSale(userId, sales);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(200).json(error.message);
    }
}

const handleGetAllSale = async (req, res) => {
    try {
        const userId = req.userId;
        const roleId = req.query?.roleId;
        const data = await handleServiceGetAllSale(userId, roleId);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(200).json(error.message);
    }
}

const handleResetSales = async (req, res) => {
    try {
        const timeRest = req.body
        const data = await handleServiceResetSales(timeRest);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(200).json(error.message);
    }
}

const handleGetUserById = async (req, res) => {
    try {
        const userId = req.query?.userId
        const data = await handleServiceGetUserById(userId);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(200).json(error.message);
    }
}

const handleEdittUserById = async (req, res) => {
    try {
        const users = req.body
        const data = await handleServiceEditUsersById(users);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(200).json(error.message);
    }
}

const handleCreateReport = async (req, res) => {
    try {
        const userId = req.userId
        const reportFile = req.body
        const data = await handleServiceCreateReport(reportFile, userId);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(200).json(error.message);
    }
}

module.exports = {
    handleGetAllUser,
    handleLoginUser,
    handleRegisterUser,
    handleGetProfileUser,
    handleCreateNotication,
    handleCreateShift,
    handleDeleteUser,
    handleCreateTimeKeeing,
    handleGetAllTimeKeeing,
    handleCountSalary,
    handleGettAllSalary,
    handleEditRole,
    handleGetAllNotification,
    handleCreateSale,
    handleGetAllSale,
    handleResetSales,
    handleGetUserById,
    handleEdittUserById,
    handleCreateReport
}