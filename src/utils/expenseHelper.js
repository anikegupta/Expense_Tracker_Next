import Expense from '@/models/Expense';
import mongoose from 'mongoose';

export const getExpenseData = async (userId) => {
    console.log("Getting data");

    // Last 7 days
    const endDate = new Date();
    const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 6);

    console.log(userId);
    console.log(startDate, endDate);

    const total = await Expense.aggregate([
        {$match: {userId: new mongoose.Types.ObjectId(userId), createdAt: {$gte: startDate, $lte: endDate}}},
        {$group: {_id: null, total: {$sum: "$rs"}}}
    ]);

    console.log(total);

    // Previous 7 days
    const endDateP = new Date();
    endDateP.setDate(endDateP.getDate() - 8);
    const startDateP = new Date(new Date().getFullYear(), new Date().getMonth(), endDateP.getDate() - 6);

    console.log(startDateP, endDateP);

    const totalP = await Expense.aggregate([
        {$match: {userId: new mongoose.Types.ObjectId(userId), createdAt: {$gte: startDateP, $lte: endDateP}}},
        {$group: {_id: null, total: {$sum: "$rs"}}}
    ]);

    // Payment method breakdown
    const topPaymentMethodUsed = await Expense.aggregate([
        {$match: {userId: new mongoose.Types.ObjectId(userId), createdAt: {$gte: startDate, $lte: endDate}}},
        {$group: {_id: "$paymentMethod", amount: {$sum: "$rs"}}},
        {$sort: {amount: -1}},
    ]);

    // Daily breakdown
    const breakdown = await Expense.aggregate([
        {$match: {userId: new mongoose.Types.ObjectId(userId), createdAt: {$gte: startDate, $lte: endDate}}},
        {
            $group: {
                _id: {$dateToString: {format: "%Y-%m-%d", date: "$createdAt"}},
                amount: {$sum: "$rs"}
            }
        },
        {$sort: {_id: -1}}
    ]);

    // Recent transactions
    const recent = await Expense.find({userId})
        .sort({createdAt: -1})
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