// routes/chatRoutes.js
import express from 'express';
import { createChat, addMessage, getChatMessages, getOrgChats } from '../controllers/chatController.js';
import { isOrgMember } from '../middleware/checkMembership.js';
const router = express.Router();

router.post('/', isOrgMember, createChat);

// Add message only if user belongs to org
router.post('/message', isOrgMember, addMessage);

// GET /api/chats/:chat_id/messages → get messages
router.get('/:chat_id/messages', getChatMessages);
// GET /api/chats/org/:organization_id → get all chats for org
router.get('/org/:organization_id', isOrgMember, getOrgChats);

export default router;
