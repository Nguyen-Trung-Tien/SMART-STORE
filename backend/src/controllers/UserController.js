import User from "../models/UserModel.js";
import JwtService from "../services/JwtService.js";
import UserService from "../services/UserService.js";

const createUser = async (req, res, next) => {
  try {
    const response = await UserService.createUser(req.body);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const response = await UserService.loginUser(req.body);
    const { refresh_token, ...data } = response;
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
    });
    return res.status(200).json({ ...data });
  } catch (e) {
    next(e);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    res.clearCookie("refresh_token");
    return res.status(200).json({
      status: "OK",
      message: "Logout successfully",
    });
  } catch (e) {
    next(e);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const data = req.body;
    if (!userId) {
      return res.status(400).json({
        status: "ERR",
        message: "The userId is required",
      });
    }
    const response = await UserService.updateUser(userId, data);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({
        status: "ERR",
        message: "The userId is required",
      });
    }
    const response = await UserService.deleteUser(userId);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const deleteManyUser = async (req, res, next) => {
  try {
    const ids = req.body.ids;
    if (!ids) {
      return res.status(400).json({
        status: "ERR",
        message: "The ids is required",
      });
    }
    const response = await UserService.deleteManyUser(ids);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const getAllUser = async (req, res, next) => {
  try {
    const response = await UserService.getAllUser();
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const getDetailsUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({
        status: "ERR",
        message: "The userId is required",
      });
    }
    const response = await UserService.getDetailsUser(userId);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refresh_token;
    if (!token) {
      return res.status(400).json({
        status: "ERR",
        message: "The token is required",
      });
    }
    const response = await JwtService.refreshTokenJwtService(token);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;
    const response = await UserService.updatePassword(userId, oldPassword, newPassword);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const response = await UserService.forgotPassword(email);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    const response = await UserService.resetPassword(token, newPassword);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

export default {
  createUser,
  loginUser,
  logoutUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailsUser,
  refreshToken,
  deleteManyUser,
  updatePassword,
  forgotPassword,
  resetPassword,
};
