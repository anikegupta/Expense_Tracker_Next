import Groq from "groq-sdk";

const GROQ_API_KEY = process.env.GROQ_API_KEY || process.env.GEMINI_KEY;

const groqClientInstance = new Groq({
  apiKey: GROQ_API_KEY,
});

const extractTextFromResponse = (response) => {
  const choice = response?.choices?.[0];
  if (!choice) return null;

  const content = choice.message?.content;
  if (typeof content === "string") {
    return content.trim();
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part === "string" ? part : part?.text ?? ""))
      .join("")
      .trim();
  }

  return typeof content?.text === "string"
    ? content.text.trim()
    : null;
};

export const groqClient = {
  generate: async ({ prompt, systemPrompt = "" }) => {
    if (!GROQ_API_KEY) {
      throw new Error("Missing GROQ_API_KEY environment variable");
    }

    const messages = [];
    if (systemPrompt) {
      messages.push({ role: "system", content: systemPrompt.trim() });
    }
    messages.push({ role: "user", content: prompt });

    try {
      const response = await groqClientInstance.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages,
        temperature: 0.2,
        max_tokens: 512,
      });

      const text = extractTextFromResponse(response);
      if (!text) {
        console.error("Groq raw response:", JSON.stringify(response, null, 2));
        throw new Error("No response text from Groq");
      }

      return text;
    } catch (error) {
      console.error("Groq API error:", error);
      const message =
        error?.message ||
        (error?.response?.data?.error?.message ?? "Unknown Groq error");
      throw new Error(`Groq request failed: ${message}`);
    }
  },
};