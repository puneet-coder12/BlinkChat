import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import helmet from "helmet";

import connectDB from "./config/db.js";
import mongoSanitize from "express-mongo-sanitize";
import authRoutes from "./routes/authRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoute.js";

import socketAuth from "./middleware/socketAuth.js";
import Conversation from "./models/Conversation.js";
import { setIO } from "./socket/io.js";

dotenv.config();

const app = express();

app.use(cookieParser());

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(mongoSanitize());
connectDB();

app.get("/", (req, res) => {
  res.send("Working");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

setIO(io);

// Authenticate every socket
io.use(socketAuth);

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log(
    `✅ ${socket.user.username} connected (${socket.user._id})`
  );

  // Mark user online
  onlineUsers.set(socket.user._id.toString(), socket.id);

  io.emit("online_users", Array.from(onlineUsers.keys()));

  /**
   * Join Conversation
   */
  socket.on("join_conversation", async (conversationId) => {
    try {
      const conversation = await Conversation.findById(conversationId);

      if (!conversation) {
        return socket.emit(
          "socket_error",
          "Conversation not found"
        );
      }

      const isParticipant = conversation.participants.some(
        (participant) =>
          participant.toString() === socket.user._id.toString()
      );

      if (!isParticipant) {
        return socket.emit(
          "socket_error",
          "Access denied"
        );
      }

      socket.join(conversationId);

      console.log(
        `${socket.user.username} joined ${conversationId}`
      );
    } catch (err) {
      console.error(err);

      socket.emit(
        "socket_error",
        "Unable to join conversation"
      );
    }
  });

  /**
   * Send Message
   * (We'll improve this further in the next step)
   */
  // socket.on("send_message", (message) => {
  //   socket
  //     .to(message.conversationId)
  //     .emit("receive_message", message);
  // });

  /**
   * Disconnect
   */
  socket.on("disconnect", () => {
    onlineUsers.delete(socket.user._id.toString());

    io.emit(
      "online_users",
      Array.from(onlineUsers.keys())
    );

    console.log(
      `❌ ${socket.user.username} disconnected`
    );
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});