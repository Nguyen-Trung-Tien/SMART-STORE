import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authMiddleware = (req, res, next) => {
  const token = req.headers.token?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "The token is required",
      status: "ERROR",
    });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(401).json({
        message: "The authemtication",
        status: "ERROR",
      });
    }
    if (user?.isAdmin) {
      next();
    } else {
      return res.status(401).json({
        message: "The authemtication",
        status: "ERROR",
      });
    }
  });
};

export { authMiddleware };
