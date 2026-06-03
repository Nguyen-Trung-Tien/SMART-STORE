import { Server } from "socket.io";
import Chat from "../models/ChatModel.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173", // Assuming default Vite port for local dev
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Client (User or Admin) joins a room based on their userId
    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });

    // Handle sending message
    socket.on("sendMessage", async (data) => {
      try {
        const { sender, receiver, message } = data;
        
        // Save to database
        const newMsg = await Chat.create({
          sender,
          receiver, // Can be "admin" if sent by user, or userId if sent by admin
          message,
        });

        // Determine room to emit to
        // If sent to admin, emit to "admin" room
        // If sent to user, emit to user's room
        const emitRoom = receiver === "admin" ? "admin" : receiver;
        io.to(emitRoom).emit("newMessage", newMsg);
        
        // Also emit back to sender so their UI can update
        const senderRoom = sender === "admin" ? "admin" : sender;
        if (senderRoom !== emitRoom) {
            io.to(senderRoom).emit("newMessage", newMsg);
        }

      } catch (err) {
        console.error("Error saving message:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
