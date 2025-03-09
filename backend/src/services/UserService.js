const User = require("../models/UserModel");
const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, password, confirmPassword, phone } = newUser;
    try {
      const createUser = await User.create({
        name,
        email,
        password,
        confirmPassword,
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

module.exports = {
  createUser,
};
