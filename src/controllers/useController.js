import {
    handleServiceGetAllUser, handleServiceLoginUser,
    handleRegisterUserService, handleServiceGetProfileUser,
    handleServiceCreateNotication,
    handleServiceCreateShift,
    handleServiceDeleteUser
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

module.exports = {
    handleGetAllUser,
    handleLoginUser,
    handleRegisterUser,
    handleGetProfileUser,
    handleCreateNotication,
    handleCreateShift,
    handleDeleteUser
}