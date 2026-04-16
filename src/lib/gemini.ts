import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set. AI features will be disabled.");
}

export const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getAIResponse = async (prompt: string, systemInstruction?: string) => {
  if (!ai) return "AI is not configured. Please add GEMINI_API_KEY to your environment.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction: systemInstruction || "You are a helpful browser assistant.",
      },
    });
    return response.text || "No response from AI.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating response.";
  }
};
