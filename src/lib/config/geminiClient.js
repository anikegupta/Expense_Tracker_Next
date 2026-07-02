import OpenAI from "openai";

export const openRouterClient = {
  generate: async ({ prompt, systemPrompt = "" }) => {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      throw new Error("Missing OPENROUTER_API_KEY environment variable");
    }

    const messages = [];

    if (systemPrompt) {
      messages.push({
        role: "system",
        content: systemPrompt.trim(),
      });
    }

    messages.push({
      role: "user",
      content: prompt,
    });

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Expense Tracker",
          },
          body: JSON.stringify({
            model: "openai/gpt-4.1-mini",
            messages,
            temperature: 0.2,
            max_tokens: 600,
             response_format: {
    type: "json_object",
  },
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        throw new Error(
          data?.error?.message || "OpenRouter request failed"
        );
      }

      return data.choices[0].message.content.trim();
    } catch (err) {
      console.error("OpenRouter Error:", err);
      throw err;
    }
  },
};

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

