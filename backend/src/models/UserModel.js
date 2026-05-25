import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    isAdmin: { type: Boolean, default: false },
    role: { type: String, enum: ["admin", "user", "support", "vendor"], default: "user" },
    address: { type: String },
    avatar: { type: String },
    city: { type: String },
    userId: { type: String },
    oldPassword: { type: String },
    newPassword: { type: String },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
  },

  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
