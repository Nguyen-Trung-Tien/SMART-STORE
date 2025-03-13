const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const generalAccessToken = async (payload) => {
  const access_token = jwt.sign({ payload }, process.env.ACCESS_TOKEN, {
    expiresIn: "1d",
  });
  return access_token;
};
const generalRefreshToken = async (payload) => {
  const refresh_token = jwt.sign({ payload }, process.env.REFRESH_TOKEN, {
    expiresIn: "356d",
  });
  return refresh_token;
};

const refreshTokenJwtService = (token) => {
  return new Promise((resolve, reject) => {
    try {
      console.log("token", token),
        jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
          if (err) {
            resolve({
              status: "ERR",
              message: "The authentication ",
            });
          }
          const { payload } = user;
          const access_token = await generalAccessToken({
            id: payload?.id,
            isAdmin: payload?.isAdmin,
          });
          console.log("access_token", access_token);
          resolve({
            status: "OK",
            message: "SUCCESS",
            access_token,
          });
        });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  generalAccessToken,
  generalRefreshToken,
  refreshTokenJwtService,
};
