import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import orgRoutes from './routes/orgRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import Notification from './models/Notification.js';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json()); // JSON body parser
app.use(morgan('dev'));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/orgs', orgRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/health', (req, res) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
);

// Create HTTP server for Socket.IO
const httpServer = createServer(app);

// Socket.IO server
export const io = new Server(httpServer, {
  cors: {
    origin: '*', // allow all origins for testing
    methods: ['GET', 'POST'],
  },
});

// Track online users
const onlineUsers = new Map();

// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('register', (user_id) => {
    onlineUsers.set(user_id, socket.id);
    console.log(`User ${user_id} registered with socket ${socket.id}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    for (let [key, value] of onlineUsers.entries()) {
      if (value === socket.id) onlineUsers.delete(key);
    }
  });
});

// Function to send notification
export const sendNotification = async ({ user_id, organization_id, message }) => {
  // 1️⃣ Store in DB
  const notification = await Notification.createNotification({ user_id, organization_id, message });

  // 2️⃣ Emit to specific user if online
  const socketId = onlineUsers.get(user_id);
  if (socketId) io.to(socketId).emit('notification', notification);

  // 3️⃣ Optional global broadcast
  // io.emit('notification', notification);

  return notification;
};

// Start server
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
