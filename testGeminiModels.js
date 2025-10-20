import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

// Initialize client for v1 API
const genAI = new GoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  // force use v1 endpoint
  apiEndpoint: "https://generativelanguage.googleapis.com/v1"
});

async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: "models/text-bison-001" });
    const result = await model.generateContent("Hello, test!");
    console.log("✅ LLM Response:", result.response.text());
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

test();
