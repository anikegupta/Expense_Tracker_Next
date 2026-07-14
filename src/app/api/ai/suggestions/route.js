import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getExpenseData } from "@/lib/utils/expenseHelper";
import { authMiddleware } from "@/middleware/auth";

async function handler(req) {
  try {
    await connectDB();

    const userId = req.userId;

    const data = await getExpenseData(userId);

    const current = data.totalForTheWeek;
    const previous = data.totalPreviousWeek;

    let trend = "flat";
    let pct = 0;

    if (previous === 0 && current > 0) {
      trend = "up";
      pct = 100;
    } else if (previous > 0) {
      pct = Number(
        (((current - previous) / previous) * 100).toFixed(1)
      );

      if (pct > 0) trend = "up";
      else if (pct < 0) trend = "down";
    }

    const paymentBreakdown =
      data.payMethodUsedBreakdown.map((item) => ({
        method: item._id || "Unknown",
        amount: item.amount,
      }));

    const totalPayment = paymentBreakdown.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    const top = paymentBreakdown[0] || {
      method: "None",
      amount: 0,
    };

    const chartLabels = [];
    const chartSeries = [];

    data.dailyBreakdown.forEach((d) => {
      chartLabels.push(d._id);
      chartSeries.push(d.amount);
    });

    let peakDay = {
      date: "",
      amount: 0,
    };

    data.dailyBreakdown.forEach((d) => {
      if (d.amount > peakDay.amount) {
        peakDay = {
          date: d._id,
          amount: d.amount,
        };
      }
    });

    return NextResponse.json({
      headline:
        current > previous
          ? "You spent more than last week"
          : current < previous
          ? "Great! Spending reduced"
          : "Spending unchanged",

      total: current,

      currency: "INR",

      trend,

      pct_change: Math.abs(pct),

      topPaymentMethodUsed: {
        name: top.method,
        amount: top.amount,
        pct:
          totalPayment === 0
            ? 0
            : Number(
                ((top.amount / totalPayment) * 100).toFixed(1)
              ),
      },

      peakDay,

      chart: {
        type: "sparkline",
        labels: chartLabels,
        series: chartSeries,
      },

      paymentMethodBreakdown: paymentBreakdown,

      recentTransactions: data.recentTransactions.map((t) => ({
        id: t._id,
        title: t.title,
        description: t.description,
        amount: t.rs,
        date: t.createdAt,
        paymentmethod: t.paymentMethod,
      })),

      action: {
        label: "View Expenses",
        url: "/dashboard/expenses",
        tip:
          current > data.weeklyBudget
            ? "Weekly budget exceeded."
            : "You're within your weekly budget.",
      },

      severity:
        current > data.weeklyBudget
          ? "alert"
          : current > data.weeklyBudget * 0.8
          ? "caution"
          : "ok",
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        message: "Dashboard error",
      },
      {
        status: 500,
      }
    );
  }
}
export const POST = authMiddleware(handler);