import { NextResponse } from 'next/server';
import Expense from '@/models/Expense';
import { connectDB } from '@/lib/mongodb';
import { authMiddleware } from '@/middleware/auth';

const hardDeleteHandler = async (request) => {
  try {
    await connectDB();
    const userId = request.userId;
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ message: "No expenses selected" }, { status: 400 });
    }

    // Permanently delete expenses from database
    const result = await Expense.deleteMany({
      _id: { $in: ids },
      userId,
      isDeleted: true // Only delete already soft-deleted expenses
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "No expenses found to delete" }, { status: 404 });
    }

    return NextResponse.json({ 
      message: `${result.deletedCount} expense(s) permanently deleted`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error in hard delete:', error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
};

export const DELETE = authMiddleware(hardDeleteHandler);