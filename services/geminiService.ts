
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const SYSTEM_INSTRUCTION = "You are Nova, the intelligent AI assistant for the PayNova fintech app. PayNova is a futuristic platform for instant money transfers and currency exchange (1.5% flat fee). Your goal is to help users navigate the app, explain how to send money or swap currencies, and answer general financial questions. Keep your tone professional, tech-savvy, and concise. Always focus on PayNova's ease of use and security.";

export const generateNovaResponse = async (messages: { role: string; content: string }[], userPrompt: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  return ai.models.generateContentStream({
    model: 'gemini-3-flash-preview',
    contents: [
      ...messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      })),
      { role: 'user', parts: [{ text: userPrompt }] }
    ],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    }
  });
};
