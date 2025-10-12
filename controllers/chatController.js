// controllers/chatController.js
import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import User from '../models/User.js'
// Create a new chat
export const createChat = async (req, res) => {
  try {
    const { organization_id, created_by, title } = req.body;
    const chat = await Chat.createChat({ organization_id, created_by, title });
    res.status(201).json({ status: 'success', chat });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

export const addMessage = async (req, res) => {
  try {
    const { chat_id, sender_id, role, content } = req.body;

    // Deduct credits for user if role=user
    if (role === 'user') {
    
      await User.deductCredits(sender_id, 1); // deduct 1 credit per message
    }
    console.log(role)
    const message = await Message.addMessage({ chat_id, sender_id, role, content });
    res.status(201).json({ status: 'success', message });
  } catch (err) {
    res.status(400).json({ status: 'error', error: err.message });
  }
};

// Get messages for a chat
export const getChatMessages = async (req, res) => {
  try {
    const { chat_id } = req.params;
    const messages = await Message.findAll({ where: { chat_id }, order: [['id', 'ASC']] });
    res.json({ status: 'success', messages });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};
