import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Expense from '@/models/Expense';
import { authMiddleware } from '@/middleware/auth';
import { parsePrice, parseDate } from '@/lib/utils/parseFilters';

// GET handler with auth middleware
async function getHandler(req) {
  try {
    await connectDB();
    const userId = req.userId;

    if (!userId) {
      return NextResponse.json(
        { message: 'Invalid request' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');

    let filter = {
      hidden: false,
      userId: userId,
    };

    // Price filtering
    if (minPrice && maxPrice) {
      const minPriceParsed = parsePrice(minPrice);
      const maxPriceParsed = parsePrice(maxPrice);
      filter.rs = {
        $gte: minPriceParsed,
        $lte: maxPriceParsed,
      };
    } else if (minPrice) {
      const minPriceParsed = parsePrice(minPrice);
      filter.rs = { $gte: minPriceParsed };
    } else if (maxPrice) {
      const maxPriceParsed = parsePrice(maxPrice);
      filter.rs = { $lte: maxPriceParsed };
    }

    // Date filtering
    if (fromDate && toDate) {
      const fromDateParsed = parseDate(fromDate);
      const toDateParsed = parseDate(toDate);
      filter.createdAt = {
        $gte: fromDateParsed,
        $lte: toDateParsed,
      };
    } else if (fromDate) {
      const fromDateParsed = parseDate(fromDate);
      filter.createdAt = { $gte: fromDateParsed };
    } else if (toDate) {
      const toDateParsed = parseDate(toDate);
      filter.createdAt = { $lte: toDateParsed };
    }

    const expenses = await Expense.find(filter).sort('-createdAt');
    return NextResponse.json(expenses);
  } catch (error) {
    console.error('Expenses error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST handler with auth middleware
async function postHandler(req) {
  try {
    await connectDB();
    const userId = req.userId;

    if (!userId) {
      return NextResponse.json(
        { message: 'Invalid request' },
        { status: 403 }
      );
    }

    const { rs, hidden, paymentMethod, title, description } = await req.json();
    
    const expense = await Expense.create({
      title,
      description,
      paymentMethod,
      rs,
      hidden: hidden || false,
      userId: userId,
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error('Create expense error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Apply auth middleware to both handlers
export const GET = authMiddleware(getHandler);
export const POST = authMiddleware(postHandler);