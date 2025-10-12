// routes/chatRoutes.js
import express from 'express';
import { createChat, addMessage, getChatMessages } from '../controllers/chatController.js';

const router = express.Router();

// POST /api/chats → create chat
router.post('/', createChat);

// POST /api/chats/message → add message
router.post('/message', addMessage);

// GET /api/chats/:chat_id/messages → get messages
router.get('/:chat_id/messages', getChatMessages);

export default router;
