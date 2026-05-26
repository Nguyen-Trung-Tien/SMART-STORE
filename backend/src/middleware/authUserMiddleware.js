import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authUserMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.token;
  const token = authHeader?.split(" ")[1];
  const userId = req.params.id;

  if (!token) {
    return res.status(401).json({
      message: "The token is required",
      status: "ERROR",
    });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(401).json({
        message: "Authentication failed",
        status: "ERROR",
      });
    }

    req.user = user;

    if (user?.isAdmin || !userId || user?.id === userId) {
      return next();
    }

    return res.status(401).json({
      message: "Authentication failed",
      status: "ERROR",
    });
  });
};

export { authUserMiddleware };
