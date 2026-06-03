import ChatService from "../services/ChatService.js";

const getHistory = async (req, res, next) => {
  try {
    // If admin is requesting, they must provide the target user's ID
    // If a normal user is requesting, we use their own ID
    const userId = (req.user.isAdmin || req.user.role === "Admin" || req.user.role === "Customer Support") && req.query.userId 
      ? req.query.userId 
      : req.user.id;
      
    const response = await ChatService.getChatHistory(userId);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const getActiveChats = async (req, res, next) => {
  try {
    const response = await ChatService.getActiveChats();
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const isAdmin = req.user.isAdmin || req.user.role === "Admin" || req.user.role === "Customer Support";
    const targetUserId = isAdmin && req.body.userId ? req.body.userId : req.user.id;
    
    const response = await ChatService.markAsRead(targetUserId, isAdmin);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

export default {
  getHistory,
  getActiveChats,
  markAsRead
};
