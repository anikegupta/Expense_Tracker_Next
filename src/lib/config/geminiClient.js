import axios from "axios";

const GEMINI_KEY = process.env.GEMINI_KEY;

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export const geminiClient = {
  generate: async ({ prompt, systemPrompt = "", key = GEMINI_KEY }) => {
    try {
      const finalPrompt = systemPrompt
        ? `${systemPrompt.trim()}\n\nUser Query:\n${prompt}`
        : prompt;

      const response = await axios.post(
        GEMINI_API_URL,
        {
          contents: [{ parts: [{ text: finalPrompt }] }],
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": key,
          },
        }
      );

      const text =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (!text) {
        throw new Error("No response text from Gemini");
      }

      return text;
    } catch (error) {
      console.error("Gemini API error:", error.response?.data || error.message);
      throw new Error("Gemini request failed: " + (error.response?.data?.error?.message || error.message));
    }
  },
};