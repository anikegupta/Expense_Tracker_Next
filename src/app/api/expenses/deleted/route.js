import { NextResponse } from 'next/server';
import Expense from '@/models/Expense';
import { connectDB } from '@/lib/mongodb';
import { authMiddleware } from '@/middleware/auth';

const getDeletedExpensesHandler = async (request) => {
  try {
    await connectDB();
    const userId = request.userId;
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const searchTerm = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';
    const sortBy = searchParams.get('sortBy') || 'deletedAt';
    const sortDir = searchParams.get('sortDir') || 'desc';

    // Build query for deleted expenses
    let query = { 
      userId, 
      isDeleted: true 
    };

    // Add search filter
    if (searchTerm) {
      query.$or = [
        { title: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } }
      ];
    }

    // Add category filter
    if (category) {
      query.paymentMethod = category;
    }

    // Add date range filter
    if (startDate || endDate) {
      query.deletedAt = {};
      if (startDate) query.deletedAt.$gte = new Date(startDate);
      if (endDate) query.deletedAt.$lte = new Date(endDate + 'T23:59:59.999Z');
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortDir === 'desc' ? -1 : 1;

    // Get deleted expenses with pagination
    const [expenses, total] = await Promise.all([
      Expense.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select('title description rs paymentMethod createdAt deletedAt'),
      Expense.countDocuments(query)
    ]);

    const pages = Math.ceil(total / limit);

    return NextResponse.json({
      items: expenses,
      total,
      page,
      pages,
      pageSize: limit,
      hasNext: page < pages,
      hasPrev: page > 1
    });
  } catch (error) {
    console.error('Error fetching deleted expenses:', error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
};

export const GET = authMiddleware(getDeletedExpensesHandler);