import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { sendOTP, verifyOTP } from "./otpService.js";
import { createServer } from "http";
import { Server } from "socket.io";

import userRoutes from "./routes/userRoutes.js";
import orgRoutes from "./routes/orgRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import googleAuthRoutes from "./routes/googleAuthRoutes.js";
import Notification from "./models/Notification.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// 🧩 Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// 🧩 Routes
app.use("/api/users", userRoutes);
app.use("/api/orgs", orgRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/google-login", googleAuthRoutes);

// 🧩 Health Check
app.get("/health", (req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));




app.post("/send-otp", async (req, res) => {
  try {
    const { phone } = req.body;
    const verification = await sendOTP(phone);
    res.json({ success: true, sid: verification.sid, status: verification.status });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ API: Verify OTP
app.post("/verify-otp", async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const result = await verifyOTP(phone, otp);

    if (result.status === "approved") {
      res.json({ success: true, message: "OTP verified successfully" });
    } else {
      res.json({ success: false, message: "Invalid OTP" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});






// 🧩 HTTP + Socket.IO Server
const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// 🧩 Track connected users
export const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log(" User connected:", socket.id);

  socket.on("register", (user_id) => {
    onlineUsers.set(user_id, socket.id);
    console.log(` Registered user ${user_id} → socket ${socket.id}`);
  });

  socket.on("disconnect", () => {
    console.log(" User disconnected:", socket.id);
    for (let [key, value] of onlineUsers.entries()) {
      if (value === socket.id) onlineUsers.delete(key);
    }
  });
});

// 🧩 Function to send notifications
export const sendNotification = async ({ user_id, organization_id, message }) => {
  const notification = await Notification.createNotification({
    user_id,
    organization_id,
    message,
  });

  const socketId = onlineUsers.get(user_id);
  console.log("📡 Trying to send notification to user:", user_id);
  console.log("📡 Found socketId:", socketId);
  console.log("🧩 Current online users:", onlineUsers);

  if (socketId) {
    io.to(socketId).emit("notification", notification);
    console.log("✅ Notification emitted to socket:", socketId);
  } else {
    console.log("⚠️ No socket found for user:", user_id);
  }

  return notification;
};

httpServer.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
