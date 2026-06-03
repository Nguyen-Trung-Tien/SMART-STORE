import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    sender: { type: String, required: true }, // Store userId string or "admin"
    receiver: { type: String, required: true }, // Store userId string or "admin"
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;
