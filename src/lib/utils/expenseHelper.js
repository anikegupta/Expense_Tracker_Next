import Expense from '@/models/Expense';
import mongoose from 'mongoose';

export const getExpenseData = async (userId) => {
    console.log("Getting expense data for user:", userId);

    // Last 7 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    console.log("Date range:", startDate, "to", endDate);

    const total = await Expense.aggregate([
        { 
            $match: { 
                userId: new mongoose.Types.ObjectId(userId), 
                createdAt: { $gte: startDate, $lte: endDate } 
            }
        },
        { $group: { _id: null, total: { $sum: "$rs" } } }
    ]);

    console.log("Total for week:", total);

    // Previous 7 days
    const endDateP = new Date(startDate);
    endDateP.setDate(endDateP.getDate() - 1);
    endDateP.setHours(23, 59, 59, 999);
    const startDateP = new Date(endDateP);
    startDateP.setDate(startDateP.getDate() - 6);
    startDateP.setHours(0, 0, 0, 0);

    console.log("Previous week range:", startDateP, "to", endDateP);

    const totalP = await Expense.aggregate([
        { 
            $match: { 
                userId: new mongoose.Types.ObjectId(userId), 
                createdAt: { $gte: startDateP, $lte: endDateP } 
            }
        },
        { $group: { _id: null, total: { $sum: "$rs" } } }
    ]);

    // Payment method breakdown
    const topPaymentMethodUsed = await Expense.aggregate([
        { 
            $match: { 
                userId: new mongoose.Types.ObjectId(userId), 
                createdAt: { $gte: startDate, $lte: endDate } 
            }
        },
        { $group: { _id: "$paymentMethod", amount: { $sum: "$rs" } } },
        { $sort: { amount: -1 } },
    ]);

    // Daily breakdown
    const breakdown = await Expense.aggregate([
        { 
            $match: { 
                userId: new mongoose.Types.ObjectId(userId), 
                createdAt: { $gte: startDate, $lte: endDate } 
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                amount: { $sum: "$rs" }
            }
        },
        { $sort: { _id: 1 } } // Sort chronologically
    ]);

    // Recent transactions
    const recent = await Expense.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title description rs createdAt paymentMethod");

    return {
        period: "Last 7 days",
        currency: "INR",
        totalForTheWeek: total[0]?.total || 0,
        totalPreviousWeek: totalP[0]?.total || 0,
        payMethodUsedBreakdown: topPaymentMethodUsed,
        dailyBreakdown: breakdown,
        recentTransactions: recent,
        weeklyBudget: 3000,
        locale: "en-IN"
    };
};