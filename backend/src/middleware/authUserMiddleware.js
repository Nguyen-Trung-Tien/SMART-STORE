const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const authUserMiddleware = (req, res, next) => {
  const token = req.headers.token.split(" ")[1];
  const userId = req.params.id;
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(401).json({
        message: "The authentication",
        status: "ERROR",
      });
    }
    if (user?.isAdmin || user?.id === userId) {
      next();
    } else {
      return res.status(404).json({
        message: "The authentication",
        status: "ERROR",
      });
    }
  });
};

module.exports = {
  authUserMiddleware,
};
