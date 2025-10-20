import express from 'express';
import { createChat, addMessage, getChatMessages, getOrgChats, sendMessageToLLM } from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';
import { isOrgMember } from '../middleware/checkMembership.js';
const router = express.Router();
router.post('/', protect, isOrgMember, createChat);
router.post('/message', protect, isOrgMember, addMessage);
router.get('/:chat_id/messages', protect, getChatMessages);
router.get('/org/:organization_id', protect, isOrgMember, getOrgChats);
router.post('/send', protect, sendMessageToLLM);
export default router;





