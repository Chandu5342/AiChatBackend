import dotenv from "dotenv";
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { io, onlineUsers } from "../server.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

/* ----------------------------- CREATE CHAT ----------------------------- */
export const createChat = async (req, res) => {
  try {
    const { organization_id, created_by, title } = req.body;
    if (!organization_id || !created_by)
      return res.status(400).json({ status: "error", message: "organization_id and created_by required" });

    const chatTitle = title || "New Chat";
    const chat = await Chat.createChat({ organization_id, created_by, title: chatTitle });

    res.status(201).json({
      status: "success",
      chat: {
        id: chat.id,
        organization_id: chat.organization_id,
        title: chat.title,
        created_by: chat.created_by,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
      },
    });
  } catch (err) {
    console.error("❌ Error creating chat:", err);
    res.status(400).json({ status: "error", message: err.message });
  }
};

/* ----------------------------- ADD MESSAGE ----------------------------- */
export const addMessage = async (req, res) => {
  try {
    const { chat_id, sender_id, role, content } = req.body;

    // Deduct credits if user message
    if (role === "user") {
      const newCredits = await User.deductCredits(sender_id, 1);

      // Emit updated credits
      const socketId = onlineUsers.get(sender_id);
      if (socketId) {
        io.to(socketId).emit("credit-update", newCredits);
        console.log(`💸 Emitted credit-update to ${sender_id}: ${newCredits}`);
      }
    }

    const message = await Message.addMessage({ chat_id, sender_id, role, content });
    res.status(201).json({ status: "success", message });
  } catch (err) {
    console.error("❌ Error adding message:", err);
    res.status(400).json({ status: "error", message: err.message });
  }
};

/* ----------------------------- GET CHAT MESSAGES ----------------------------- */
export const getChatMessages = async (req, res) => {
  try {
    const { chat_id } = req.params;
    const messages = await Message.findAll({ where: { chat_id }, order: [["id", "ASC"]] });
    res.json({ status: "success", messages });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};

/* ----------------------------- GET ORG CHATS ----------------------------- */
export const getOrgChats = async (req, res) => {
  try {
    const { organization_id } = req.params;
    const chats = await Chat.findAll({ where: { organization_id }, order: [["id", "ASC"]] });
    res.json({ status: "success", chats });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};

/* ----------------------------- SEND MESSAGE TO GEMINI ----------------------------- */
export const sendMessageToLLM = async (req, res) => {
  try {
    const { chat_id, sender_id, content } = req.body;
    if (!chat_id || !sender_id || !content?.trim())
      return res.status(400).json({ status: "error", message: "Missing required fields" });

    // Deduct credits and emit update
    const newCredits = await User.deductCredits(sender_id, 1);
    const socketId = onlineUsers.get(sender_id);
    if (socketId) {
      io.to(socketId).emit("credit-update", newCredits);
      console.log(`💸 Emitted credit-update to ${sender_id}: ${newCredits}`);
    }

    // Save user message
    const userMessage = await Message.addMessage({
      chat_id,
      sender_id,
      role: "user",
      content,
    });

    // Fetch chat history
    const messagesHistory = await Message.findAll({ where: { chat_id }, order: [["id", "ASC"]] });
    const contents = messagesHistory.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content || " " }],
    }));
    contents.push({ role: "user", parts: [{ text: content }] });

    // Call Gemini API
    const result = await model.generateContent({ contents });
    const assistantReply = result.response.text();

    // Save assistant reply
    const assistantMessage = await Message.addMessage({
      chat_id,
      sender_id: null,
      role: "assistant",
      content: assistantReply,
    });

    res.json({ status: "success", userMessage, assistantMessage });
  } catch (err) {
    console.error("❌ AI generation failed:", err);
    res.status(500).json({
      status: "error",
      message: "AI generation failed",
      details: err.message,
    });
  }
};
