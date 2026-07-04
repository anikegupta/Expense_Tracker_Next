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

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (rs !== undefined) updates.rs = rs;
    if (hidden !== undefined) updates.hidden = hidden;
    if (paymentMethod !== undefined) updates.paymentMethod = paymentMethod;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ message: "No update fields provided" }, { status: 400 });
    }

    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: expenseId, userId: request.userId },
      updates,
      { new: true }
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

// ✅ Delete expense - moves it to recycle bin instead of removing it permanently
const deleteExpenseHandler = async (request) => {
  try {
    await connectDB();
    const expenseId = request.url.split('/').pop();
    const userId = request.userId;

    const expense = await Expense.findOne({ _id: expenseId, userId });

    if (!expense) {
      return NextResponse.json({ message: "Expense not found" }, { status: 404 });
    }

    expense.isDeleted = true;
    expense.deletedAt = new Date();
    await expense.save();

    return NextResponse.json({
      message: "Expense moved to recycle bin",
      deletedId: expenseId,
      expense: {
        _id: expense._id,
        isDeleted: expense.isDeleted,
        deletedAt: expense.deletedAt,
      },
    });
  } catch (error) {
    console.error('Error in deleteExpense:', error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
};

export const GET = authMiddleware(singleExpenseHandler);
export const PUT = authMiddleware(updateExpenseHandler);
export const DELETE = authMiddleware(deleteExpenseHandler);