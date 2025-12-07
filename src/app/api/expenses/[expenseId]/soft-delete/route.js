import { NextResponse } from 'next/server';
import Expense from '@/models/Expense';
import { connectDB } from '@/lib/mongodb';
import { authMiddleware } from '@/middleware/auth';

const softDeleteHandler = async (request) => {
  try {
    await connectDB();
    const expenseId = request.url.split('/').pop();
    
    const expense = await Expense.findById(expenseId);
    
    if (!expense) {
      return NextResponse.json({ message: "Expense not found" }, { status: 404 });
    }

    // Soft delete - mark as deleted but don't remove from database
    expense.isDeleted = true;
    expense.deletedAt = new Date();
    await expense.save();

    return NextResponse.json({ 
      message: "Expense moved to recycle bin",
      expense: {
        _id: expense._id,
        title: expense.title,
        isDeleted: expense.isDeleted,
        deletedAt: expense.deletedAt
      }
    });
  } catch (error) {
    console.error('Error in soft delete:', error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
};

export const PUT = authMiddleware(softDeleteHandler);