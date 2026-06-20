import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Expense from '@/models/Expense';
import { authMiddleware } from '@/middleware/auth';
import { parsePrice, parseDate } from '@/lib/utils/parseFilters';

async function getHiddenExpensesHandler(req) {
  try {
    await connectDB();
    const userId = req.userId;

    if (!userId) {
      return NextResponse.json({ message: 'Invalid request' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');

    const filter = {
      hidden: true,
      isDeleted: false,
      userId,
    };

    if (minPrice && maxPrice) {
      const minPriceParsed = parsePrice(minPrice);
      const maxPriceParsed = parsePrice(maxPrice);
      if (minPriceParsed !== null && maxPriceParsed !== null) {
        filter.rs = { $gte: minPriceParsed, $lte: maxPriceParsed };
      }
    } else if (minPrice) {
      const minPriceParsed = parsePrice(minPrice);
      if (minPriceParsed !== null) filter.rs = { $gte: minPriceParsed };
    } else if (maxPrice) {
      const maxPriceParsed = parsePrice(maxPrice);
      if (maxPriceParsed !== null) filter.rs = { $lte: maxPriceParsed };
    }

    if (fromDate && toDate) {
      const fromDateParsed = parseDate(fromDate);
      const toDateParsed = parseDate(toDate, true);
      if (fromDateParsed && toDateParsed) {
        filter.createdAt = { $gte: fromDateParsed, $lte: toDateParsed };
      }
    } else if (fromDate) {
      const fromDateParsed = parseDate(fromDate);
      if (fromDateParsed) filter.createdAt = { $gte: fromDateParsed };
    } else if (toDate) {
      const toDateParsed = parseDate(toDate, true);
      if (toDateParsed) filter.createdAt = { $lte: toDateParsed };
    }

    const expenses = await Expense.find(filter).sort('-createdAt');
    return NextResponse.json(expenses);
  } catch (error) {
    console.error('Hidden expenses error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export const GET = authMiddleware(getHiddenExpensesHandler);
