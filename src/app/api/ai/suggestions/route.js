import { NextResponse } from 'next/server';
import { groqClient } from '@/lib/config/geminiClient';
import { connectDB } from '@/lib/mongodb';
import { getExpenseData } from '@/lib/utils/expenseHelper';
import { authMiddleware } from '@/middleware/auth';

async function getSuggestionsHandler(req) {
  try {
    const userId = req.userId;
    console.log('Fetching suggestions for user:', userId);

    await connectDB();
    const data = await getExpenseData(userId);

    const systemPrompt = `
You are a concise financial dashboard assistant. 
Always return **only valid JSON**, no markdown, no explanations.
Follow schema exactly.
    `;

    const userPrompt = `
The user's last 7 days expense data:
${JSON.stringify(data, null, 2)}

Now return an object matching this schema:
{
  "headline": string,
  "total": number,
  "currency": string,
  "trend": "up" | "down" | "flat",
  "pct_change": number,
  "topPaymentMethodUsed": { "name": string, "amount": number, "pct": number },
  "peakDay": { "date": "YYYY-MM-DD", "amount": number },
  "chart": { "type": "sparkline", "series": [number,...], "labels": ["YYYY-MM-DD", ...] },
  "paymentMethodBreakdown": [ { "method": string, "amount": number } ],
  "recentTransactions": [ { "id": string, "title": string, "description": string, "amount": number, "date": "YYYY-MM-DD", "paymentmethod": string } ],
  "action": { "label": string, "url": string, "tip": string },
  "severity": "ok" | "caution" | "alert"
}
`;

    const responseText = await groqClient.generate({
      prompt: userPrompt,
      systemPrompt,
    });

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Gemini suggestion output:", responseText);
      throw new Error("Gemini did not return valid JSON");
    }

    let result;
    try {
      result = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("Failed to parse Gemini JSON:", jsonMatch[0]);
      throw new Error("Failed to parse JSON returned by Gemini");
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in getSuggestions:", error);
    return NextResponse.json(
      { error: "AI suggestion failed", details: error.message },
      { status: 500 }
    );
  }
}

export const POST = authMiddleware(getSuggestionsHandler);