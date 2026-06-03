import Chat from "../models/ChatModel.js";

const buildResponse = (data, message = "SUCCESS", extra = {}) => ({
  status: "OK",
  message,
  ...extra,
  data,
});

const getChatHistory = async (userId) => {
  // Find messages where the user is either the sender or receiver
  // This gets the conversation between this specific user and the admin
  const messages = await Chat.find({
    $or: [
      { sender: userId, receiver: "admin" },
      { sender: "admin", receiver: userId }
    ]
  }).sort({ createdAt: 1 });
  
  return buildResponse(messages);
};

const getActiveChats = async () => {
  // Admin only: Get list of users who have sent messages to admin
  // We use aggregation to group by user (excluding admin) and get the latest message
  const activeChats = await Chat.aggregate([
    {
      $match: {
        $or: [
          { receiver: "admin" },
          { sender: "admin" }
        ]
      }
    },
    {
      $sort: { createdAt: -1 } // Sort by newest first
    },
    {
      $group: {
        _id: {
          $cond: [
            { $eq: ["$sender", "admin"] },
            "$receiver",
            "$sender"
          ]
        },
        lastMessage: { $first: "$message" },
        lastMessageTime: { $first: "$createdAt" },
        unreadCount: {
          $sum: {
            $cond: [
              { $and: [{ $eq: ["$receiver", "admin"] }, { $eq: ["$isRead", false] }] },
              1,
              0
            ]
          }
        }
      }
    },
    {
      $sort: { lastMessageTime: -1 }
    }
  ]);

  // Optionally populate user details if you want names/avatars in the admin view
  // For now, returning the _id (which is userId) is enough to fetch individual histories
  
  return buildResponse(activeChats);
};

const markAsRead = async (userId, isAdmin) => {
  const query = isAdmin 
    ? { sender: userId, receiver: "admin", isRead: false }
    : { sender: "admin", receiver: userId, isRead: false };

  await Chat.updateMany(query, { isRead: true });
  return buildResponse(null, "Messages marked as read");
};

export default {
  getChatHistory,
  getActiveChats,
  markAsRead
};
