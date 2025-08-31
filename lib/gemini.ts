import { GoogleGenerativeAI } from '@google/generative-ai';

const geminiApiKey = process.env.GEMINI_API_KEY!;

export const genAI = new GoogleGenerativeAI(geminiApiKey);

// You can specify the model here or when calling the embedder
export const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
// Example for a text generation model (if you need it elsewhere)
export const textModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });