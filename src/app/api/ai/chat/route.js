import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { query } = await request.json();
    
    console.log('Received query:', query);

    // Mock response based on query
    let responseData;

    if (query.toLowerCase().includes('expense') || query.toLowerCase().includes('list')) {
      // Mock expense data
      responseData = {
        operation: "list_expense",
        result: [
          {
            _id: "1",
            title: "Groceries",
            description: "Weekly grocery shopping",
            rs: 1500,
            paymentMethod: "card",
            createdAt: new Date().toISOString()
          },
          {
            _id: "2", 
            title: "Internet Bill",
            description: "Monthly internet subscription",
            rs: 899,
            paymentMethod: "upi",
            createdAt: new Date().toISOString()
          }
        ],
        message: "Here are your recent expenses"
      };
    } else if (query.toLowerCase().includes('add') || query.toLowerCase().includes('create')) {
      responseData = {
        operation: "add_expense", 
        message: "🎉 Expense added successfully!"
      };
    } else {
      responseData = {
        operation: "unknown",
        advisor_message: `I understand you're asking about: "${query}". I can help you with expenses, budgets, or savings tips.`
      };
    }

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}