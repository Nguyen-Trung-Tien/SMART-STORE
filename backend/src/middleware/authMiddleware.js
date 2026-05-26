import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import dotenv from "dotenv";
dotenv.config();

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.token;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization token is missing or invalid",
        status: "ERROR",
      });
    }

    const token = authHeader.split(" ")[1];
    
    jwt.verify(token, process.env.ACCESS_TOKEN, async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: "Token has expired or is invalid",
          status: "ERROR",
        });
      }
      
      const user = await User.findById(decoded?.id || decoded?._id);
      if (!user) {
        return res.status(404).json({
          message: "User not found",
          status: "ERROR",
        });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error in authentication",
      status: "ERROR",
      error: error.message
    });
  }
};

export { authMiddleware };
