import dotenv from "dotenv";
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
dotenv.config();

export const createChat = async (req, res) => {
  try {
    const { organization_id, created_by, title } = req.body;

    if (!organization_id) {
      return res.status(400).json({ status: "error", message: "organization_id required" });
    }

    if (!created_by) {
      return res.status(400).json({ status: "error", message: "created_by required" });
    }

    const chatTitle = title || "New Chat";

    // Create new chat
    const chat = await Chat.createChat({
      organization_id,
      created_by,
      title: chatTitle,
    });

    // Return full chat object
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
    console.error("Error creating chat:", err);
    res.status(400).json({ status: "error", message: err.message });
  }
};

export const addMessage = async (req, res) => {
  try {
    const { chat_id, sender_id, role, content } = req.body;
    if (role === "user") await User.deductCredits(sender_id, 1);
    const message = await Message.addMessage({ chat_id, sender_id, role, content });
    res.status(201).json({ status: "success", message });
  } catch (err) { res.status(400).json({ status: "error", message: err.message }); }
};

export const getChatMessages = async (req, res) => {
  try {
    const { chat_id } = req.params;
    const messages = await Message.findAll({ where: { chat_id }, order: [["id", "ASC"]] });
    res.json({ status: "success", messages });
  } catch (err) { res.status(400).json({ status: "error", message: err.message }); }
};

export const getOrgChats = async (req, res) => {
  try {
    const { organization_id } = req.params;
    const chats = await Chat.findAll({ where: { organization_id }, order: [["id", "ASC"]] });
    res.json({ status: "success", chats });
  } catch (err) { res.status(400).json({ status: "error", message: err.message }); }
};




const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });



export const sendMessageToLLM = async (req, res) => {
  
  try {
    const { chat_id, sender_id, content } = req.body;
  console.log(chat_id)
    if (!chat_id) {
      return res.status(400).json({ status: "error", message: "chat_id is required" });
    }
console.log("hello")
    if (!sender_id) {
      return res.status(400).json({ status: "error", message: "sender_id is required" });
    }

    if (!content?.trim()) {
      return res.status(400).json({ status: "error", message: "Message content required" });
    }

    // Deduct user credits
    await User.deductCredits(sender_id, 1);

    // Save user message
    const userMessage = await Message.addMessage({
      chat_id,
      sender_id,
      role: "user",
      content,
    });

    // Fetch chat history
    const messagesHistory = await Message.findAll({
      where: { chat_id },
      order: [["id", "ASC"]],
    });

    // Prepare contents for Gemini API
    const contents = messagesHistory.map(m => ({
      role: m.role === "user" ? "user" : "model", // map assistant -> model
      parts: [{ text: m.content || " " }],
    }));

    // Include the new message
    contents.push({ role: "user", parts: [{ text: content }] });

    // Call Gemini API
    const result = await model.generateContent({ contents });
    const assistantReply = result.response.text();

    // Save assistant message
    const assistantMessage = await Message.addMessage({
      chat_id,
      sender_id: null,
      role: "assistant", // still use "assistant" in DB for frontend rendering
      content: assistantReply,
    });

    // Return both messages
    res.json({ status: "success", userMessage, assistantMessage });
  } catch (err) {
    console.error("AI generation failed:", err);
    res.status(500).json({
      status: "error",
      message: "AI generation failed. Please try again later.",
      details: err.message,
    });
  }
};