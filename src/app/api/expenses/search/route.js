import { NextResponse } from 'next/server';
import Expense from '@/models/Expense';
import { authMiddleware } from '@/middleware/auth';

async function searchByTitleHandler(req) {
  try {
    const userId = req.userId;
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title');
    
    const expenses = await Expense.find({
      userId: userId,
      title: { $regex: title, $options: "i" }
    });

    return NextResponse.json(expenses);
  } catch (error) {
    console.error('Error in searchByTitle:', error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export const GET = authMiddleware(searchByTitleHandler);