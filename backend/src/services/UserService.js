const User = require("../models/UserModel");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const { generalAccessToken, generalRefreshToken } = require("./JwtService");
const { sendEmailResetPassword } = require("../services/EmailService");
dotenv.config();

const crypto = require("crypto");

const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, password, confirmPassword, phone } = newUser;
    try {
      const checkUser = await User.findOne({ email: email });
      if (checkUser !== null) {
        return resolve({ status: "ERR", message: "The email is already" });
      }
      const hash = await bcrypt.hash(password, 10);
      const createUser = await User.create({
        name,
        email,
        password: hash,
        phone,
      });
      if (createUser) {
        resolve({
          status: "OK",
          message: "Success",
          data: createUser,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const loginUser = (userLogin) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = userLogin;
    try {
      const checkUser = await User.findOne({ email: email });
      if (checkUser === null) {
        return resolve({ status: "ERR", message: "The user is not defined" });
      }

      const comparePassword = await bcrypt.compareSync(
        password,
        checkUser.password
      );

      if (!comparePassword) {
        return resolve({
          status: "ERR",
          message: "The password or user is incorrect",
        });
      }

      const access_token = await generalAccessToken({
        id: checkUser.id,
        isAdmin: checkUser.isAdmin,
      });

      const refresh_token = await generalRefreshToken({
        id: checkUser.id,
        isAdmin: checkUser.isAdmin,
      });

      resolve({
        status: "OK",
        message: "SUCCESS",
        access_token,
        refresh_token,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateUser = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({ _id: id });
      if (checkUser === null) {
        resolve({ status: "OK", message: "The user is not defined" });
      }

      const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updatedUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({ _id: id });
      if (checkUser === null) {
        resolve({ status: "OK", message: "The user is not defined" });
      }

      await User.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Delete user success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteManyUser = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await User.deleteMany({ _id: ids });
      resolve({
        status: "OK",
        message: "Delete user success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allUser = await User.find().sort({ createdAt: -1 }).lean();
      resolve({
        status: "OK",
        message: "Success",
        data: allUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailsUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ _id: id });
      if (user === null) {
        return resolve({ status: "OK", message: "The user is not defined" });
      }

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: user,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updatePassword = (id, oldPassword, newPassword) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(id);
      if (!user) {
        return resolve({ status: "ERR", message: "User not found" });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return resolve({ status: "ERR", message: "Old password is incorrect" });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedNewPassword;
      await user.save();

      resolve({
        status: "OK",
        message: "Password updated successfully",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const resetPassword = async (token, newPassword) => {
  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    });
    console.log("Found user:", user);
    if (!user) {
      return { status: "ERR", message: "Invalid or expired token" };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return { status: "OK", message: "Password reset successfully" };
  } catch (err) {
    console.error(err);
    return { status: "ERR", message: err.message };
  }
};

const forgotPassword = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return resolve({ status: "ERR", message: "Email not found" });
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = Date.now() + 3600000;

      user.resetToken = resetToken;
      user.resetTokenExpiry = resetTokenExpiry;
      await user.save();

      console.log("Saved resetToken to user:", resetToken);
      await sendEmailResetPassword(
        email,
        `${process.env.URL_PORT_GET_EMAIL}/reset-password/${resetToken}`
      );

      resolve({
        status: "OK",
        message: "Reset password link has been sent to your email",
        resetToken,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailsUser,
  deleteManyUser,
  forgotPassword,
  resetPassword,
  updatePassword,
};
