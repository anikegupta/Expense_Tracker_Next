import Expense from "@/models/Expense";
import mongoose from "mongoose";

export const getExpenseData = async (userId) => {
  const objectId = new mongoose.Types.ObjectId(userId);

  // -----------------------------
  // Current Week
  // -----------------------------
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 6);
  startDate.setHours(0, 0, 0, 0);

  // -----------------------------
  // Previous Week
  // -----------------------------
  const previousEnd = new Date(startDate);
  previousEnd.setDate(previousEnd.getDate() - 1);
  previousEnd.setHours(23, 59, 59, 999);

  const previousStart = new Date(previousEnd);
  previousStart.setDate(previousStart.getDate() - 6);
  previousStart.setHours(0, 0, 0, 0);

  // ==========================
  // Current Week Total
  // ==========================

  const currentWeek = await Expense.aggregate([
    {
      $match: {
        userId: objectId,
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: "$rs",
        },
      },
    },
  ]);

  // ==========================
  // Previous Week Total
  // ==========================

  const previousWeek = await Expense.aggregate([
    {
      $match: {
        userId: objectId,
        createdAt: {
          $gte: previousStart,
          $lte: previousEnd,
        },
      },
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: "$rs",
        },
      },
    },
  ]);

  // ==========================
  // Payment Method Breakdown
  // ==========================

  const payMethodUsedBreakdown = await Expense.aggregate([
    {
      $match: {
        userId: objectId,
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: "$paymentMethod",
        amount: {
          $sum: "$rs",
        },
      },
    },
    {
      $sort: {
        amount: -1,
      },
    },
  ]);

  // ==========================
  // Daily Breakdown
  // ==========================

  const dailyBreakdown = await Expense.aggregate([
    {
      $match: {
        userId: objectId,
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
          },
        },
        amount: {
          $sum: "$rs",
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);

  // ==========================
  // Recent Transactions
  // ==========================

  const recentTransactions = await Expense.find({
    userId: objectId,
  })
    .sort({
      createdAt: -1,
    })
    .limit(5)
    .select(
      "_id title description rs paymentMethod createdAt"
    );

  return {
    currency: "INR",

    totalForTheWeek:
      currentWeek[0]?.total || 0,

    totalPreviousWeek:
      previousWeek[0]?.total || 0,

    payMethodUsedBreakdown,

    dailyBreakdown,

    recentTransactions,

    weeklyBudget: 3000,
  };
};