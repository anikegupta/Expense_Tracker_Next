import { NextResponse } from 'next/server';
import Expense from '@/models/Expense';
import { connectDB } from '@/lib/mongodb';
import { authMiddleware } from '@/middleware/auth';

const restoreExpensesHandler = async (request) => {
  try {
    await connectDB();
    const userId = request.userId;
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ message: "No expenses selected" }, { status: 400 });
    }

    // Restore expenses - set isDeleted to false
    const result = await Expense.updateMany(
      { 
        _id: { $in: ids },
        userId 
      },
      { 
        $set: { 
          isDeleted: false,
          deletedAt: null
        } 
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: "No expenses found to restore" }, { status: 404 });
    }

    return NextResponse.json({ 
      message: `${result.modifiedCount} expense(s) restored successfully`,
      restoredCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error restoring expenses:', error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
};

export const POST = authMiddleware(restoreExpensesHandler);