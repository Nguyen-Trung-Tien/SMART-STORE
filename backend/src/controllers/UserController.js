import User from "../models/UserModel.js";
import JwtService from "../services/JwtService.js";
import UserService from "../services/UserService.js";
import cloudinary from "../config/cloudinary.js";

const createUser = async (req, res, next) => {
  try {
    const response = await UserService.createUser(req.body);
    if (response.status === "ERR") {
      return res.status(400).json(response);
    }
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const response = await UserService.loginUser(req.body);
    if (response.status === "ERR") {
      return res.status(400).json(response);
    }
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
    let data = req.body;
    if (!userId) {
      return res.status(400).json({
        status: "ERR",
        message: "The userId is required",
      });
    }

    if (data.avatar && data.avatar.startsWith("data:image")) {
      const uploadResponse = await cloudinary.uploader.upload(data.avatar, {
        folder: "avatars",
      });
      data = { ...data, avatar: uploadResponse.secure_url };
    }

    const response = await UserService.updateUser(userId, data);
    if (response.status === "ERR") {
      return res.status(400).json(response);
    }
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
    if (response.status === "ERR") {
      return res.status(400).json(response);
    }
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
    if (response.status === "ERR") {
      return res.status(400).json(response);
    }
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const getAllUser = async (req, res, next) => {
  try {
    const response = await UserService.getAllUser();
    if (response.status === "ERR") {
      return res.status(400).json(response);
    }
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
    if (response.status === "ERR") {
      return res.status(400).json(response);
    }
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
    if (response.status === "ERR") {
      return res.status(401).json(response);
    }
    const { refresh_token, ...data } = response;
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
    });
    return res.status(200).json(data);
  } catch (e) {
    next(e);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;
    const response = await UserService.updatePassword(userId, oldPassword, newPassword);
    if (response.status === "ERR") {
      return res.status(400).json(response);
    }
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const response = await UserService.forgotPassword(email);
    if (response.status === "ERR") {
      return res.status(400).json(response);
    }
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    const response = await UserService.resetPassword(token, newPassword);
    if (response.status === "ERR") {
      return res.status(400).json(response);
    }
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const changeRole = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;
    if (!userId || !role) {
      return res.status(400).json({
        status: "ERR",
        message: "userId and role are required",
      });
    }
    // Update the user's role and handle isAdmin flag simultaneously
    const isAdmin = role !== "User"; // Simple logic: anyone not a User is considered admin-level for some views
    const response = await UserService.updateUser(userId, { role, isAdmin });
    if (response.status === "ERR") {
      return res.status(400).json(response);
    }
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
  changeRole,
};
