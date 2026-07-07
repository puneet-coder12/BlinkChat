import jwt from "jsonwebtoken";
import * as cookie from "cookie";

import User from "../models/User.js";

const socketAuth = async (socket, next) => {
  try {
    // Parse cookies from the handshake
    const cookies = cookie.parse(socket.handshake.headers.cookie || "");

    const token = cookies.token;

    if (!token) {
      return next(new Error("Authentication required"));
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Load user
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return next(new Error("User not found"));
    }

    // Attach authenticated user to socket
    socket.user = user;

    next();
  } catch (error) {
    next(new Error("Unauthorized"));
  }
};

export default socketAuth;
