"use client";

import { useEffect } from "react";
import { getDashboardData } from "@/services/AIService";
import { useAuthContext } from "@/context/AuthContext";
import DayWiseSpendChart from "@/components/user/DayWiseSpendChart";
import StatCard from "@/components/user/StarCard";
import PaymentMethodDoughnut from "@/components/user/PaymentMethodDoughnut";
import RecentTransactionsList from "@/components/user/RecentTransactionsList";
import DashboardSkeleton from "@/components/user/DashboardSkeleton";
import DailySpendBar from "@/components/user/DailySpendBar";
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  CalendarDays,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  formatCurrency,
  formatDate,
  capitalize,
  getSeverityBadge,
} from "@/utils/formatters";

export default function UserHome() {
  const {
    dashboardData,
    setDashboardData,
    loadingDashboardData,
    setLoadingDashboardData,
  } = useAuthContext();

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const data = await getDashboardData();
        setDashboardData(data);
        console.log("Dashboard data loaded:", data);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoadingDashboardData(false);
      }
    }

    if (!dashboardData && !loadingDashboardData) {
      setLoadingDashboardData(true);
      loadDashboardData();
    }
  }, [dashboardData, loadingDashboardData, setDashboardData, setLoadingDashboardData]);

  if (loadingDashboardData || !dashboardData) {
    return <DashboardSkeleton />;
  }

  const data = dashboardData;
  const isUp = data?.trend === "up";
  const currency = data?.currency ?? "INR";

  return (
    <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero header */}
      <div className="mt-2 mb-6 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-blue-500/10 to-emerald-500/10 border border-indigo-100/60 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-black">Dashboard</h1>
            <p className="text-sm text-gray-600">
              Weekly overview and insights
            </p>
          </div>
          <div
            className={`inline-flex items-center px-2 py-1 rounded-md text-xs ${
              isUp
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {isUp ? (
              <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 mr-1" />
            )}
            {isUp ? "Up" : "Down"}
          </div>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={<Wallet className="w-5 h-5" />}
          title="This Week"
          value={formatCurrency(data.total, currency)}
          subtitle={data.headline}
          accent="from-blue-500/15 to-blue-500/5"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          title="Trend"
          value={`${isUp ? "+" : "-"}${Math.abs(data.pct_change ?? 0)}%`}
          subtitle={isUp ? "Up vs last week" : "Down vs last week"}
          trendIcon={
            isUp ? (
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-rose-600" />
            )
          }
          accent={
            isUp
              ? "from-emerald-500/15 to-emerald-500/5"
              : "from-rose-500/15 to-rose-500/5"
          }
        />
        <StatCard
          icon={<CreditCard className="w-5 h-5" />}
          title="Top Payment Method"
          value={`${data.topPaymentMethodUsed?.name ?? "-"} · ${formatCurrency(
            data.topPaymentMethodUsed?.amount ?? 0,
            currency
          )}`}
          subtitle={`${data.topPaymentMethodUsed?.pct ?? 0}% of total`}
          accent="from-violet-500/15 to-violet-500/5"
        />
        <StatCard
          icon={<CalendarDays className="w-5 h-5" />}
          title="Peak Day"
          value={formatDate(data.peakDay?.date)}
          subtitle={`${formatCurrency(
            data.peakDay?.amount ?? 0,
            currency
          )} spent`}
          accent="from-amber-500/15 to-amber-500/5"
        />
      </div>

      {/* Charts: Day-wise spend (Line) + Payment methods (Donut) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-4">
        <motion.div
          className="xl:col-span-2 rounded-2xl border border-gray-200 bg-white/90 backdrop-blur p-5 shadow-sm"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-medium">Day-wise Spend</h3>
              <p className="text-xs text-gray-500">Your daily totals</p>
            </div>
          </div>
          <div className="h-72">
            <DayWiseSpendChart
              recentTransactions={data.recentTransactions ?? []}
              fallbackLabels={data.chart?.labels ?? []}
              fallbackSeries={data.chart?.series ?? []}
              currency={currency}
            />
          </div>
        </motion.div>

        <motion.div
          className="rounded-2xl border border-gray-200 bg-white/90 backdrop-blur p-5 shadow-sm"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
        >
          <h3 className="font-medium mb-3">Payment Methods</h3>
          <div className="h-72">
            <PaymentMethodDoughnut
              breakdown={data.paymentMethodBreakdown ?? []}
            />
          </div>
        </motion.div>
      </div>

      {/* Bar Chart: Daily totals */}
      <motion.div
        className="rounded-2xl border border-gray-200 bg-white/90 backdrop-blur p-5 shadow-sm mt-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.08 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">Daily Totals (Bar)</h3>
          <span className="text-xs text-gray-500">
            {(data.recentTransactions ?? []).length} transactions
          </span>
        </div>
        <div className="h-72">
          <DailySpendBar
            recentTransactions={data.recentTransactions ?? []}
            fallbackLabels={data.chart?.labels ?? []}
            fallbackSeries={data.chart?.series ?? []}
            currency={currency}
          />
        </div>
      </motion.div>

      {/* Recent Transactions + Action */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <motion.div
          className="rounded-2xl border border-gray-200 bg-white/90 backdrop-blur p-5 lg:col-span-2 shadow-sm"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Recent Transactions</h3>
            <span className="text-xs text-gray-500">
              {(data.recentTransactions ?? []).length} items
            </span>
          </div>
          <RecentTransactionsList
            items={data.recentTransactions ?? []}
            currency={currency}
          />
        </motion.div>

        <motion.div
          className="rounded-2xl border border-gray-200 bg-white/90 backdrop-blur p-6 flex flex-col justify-between shadow-sm"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.15 }}
        >
          <div>
            <div
              className={`inline-block text-xs px-2 py-1 rounded-md mb-3 ${getSeverityBadge(
                data.severity
              )}`}
            >
              {capitalize(data.severity ?? "info")}
            </div>
            <h3 className="font-semibold text-lg">
              {data.action?.label ?? "Take Action"}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {data.action?.tip ?? "Review your budget regularly."}
            </p>
          </div>
          <a
            href={data.action?.url ?? "#"}
            className="mt-4 inline-flex items-center justify-center rounded-md bg-gray-900 text-white px-4 py-2 text-sm hover:bg-gray-800 transition-colors"
          >
            Go to {data.action?.label ?? "Action"}
            <ArrowUpRight className="w-4 h-4 ml-2" />
          </a>
        </motion.div>
      </div>
    </div>
  );
}