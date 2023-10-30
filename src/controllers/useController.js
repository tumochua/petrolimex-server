import { handleServiceGetAllUser, handleServiceLoginUser, handleRegisterUserService, handleServiceGetProfileUser } from '../services/useServices'

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

module.exports = {
    handleGetAllUser,
    handleLoginUser,
    handleRegisterUser,
    handleGetProfileUser
}