import { NextResponse } from 'next/server';
import Expense from '@/models/Expense';
import { connectDB } from '@/lib/mongodb';
import { authMiddleware } from '@/middleware/auth';

// ✅ Get single expense
const singleExpenseHandler = async (request) => {
  try {
    await connectDB();
    const expenseId = request.url.split('/').pop();
    
    const expense = await Expense.findOne({ _id: expenseId });

    if (!expense) {
      return NextResponse.json({ message: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json(expense);
  } catch (error) {
    console.error('Error in singleExpense:', error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
};

// ✅ Update expense
const updateExpenseHandler = async (request) => {
  try {
    await connectDB();
    const expenseId = request.url.split('/').pop();
    const { title, description, rs, hidden, paymentMethod } = await request.json();

    const updatedExpense = await Expense.findByIdAndUpdate(
      expenseId,
      { title, description, rs, hidden, paymentMethod },
      { new: true } // Return updated document
    );

    if (!updatedExpense) {
      return NextResponse.json({ message: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json(updatedExpense);
  } catch (error) {
    console.error('Error in updateExpense:', error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
};

// ✅ Delete expense - FIXED: Always return JSON
const deleteExpenseHandler = async (request) => {
  try {
    await connectDB();
    const expenseId = request.url.split('/').pop();
    
    const deletedExpense = await Expense.findByIdAndDelete(expenseId);
    
    if (!deletedExpense) {
      return NextResponse.json({ message: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      message: "Expense deleted successfully",
      deletedId: expenseId 
    });
  } catch (error) {
    console.error('Error in deleteExpense:', error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
};

export const GET = authMiddleware(singleExpenseHandler);
export const PUT = authMiddleware(updateExpenseHandler);
export const DELETE = authMiddleware(deleteExpenseHandler);