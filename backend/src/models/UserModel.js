const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    isAdmin: { type: Boolean, default: false },
    address: { type: String },
    avatar: { type: String },
    city: { type: String },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
  },

  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
