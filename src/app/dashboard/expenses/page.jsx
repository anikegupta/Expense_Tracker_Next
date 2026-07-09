"use client";

import React, { useEffect, useState } from "react";
import { getExpenses, getSortedExpenses } from "../../../services/ExpenseService";
import { toast } from "react-toastify";
import { MdInfo } from "react-icons/md";
import ExpenseView from "@/components/user/ExpenseView";
import { TextInput, Label, Datepicker } from "flowbite-react";

function ViewExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [allExpenses, setAllExpenses] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    fromDate: "",
    toDate: "",
  });

  useEffect(() => {
    if (searchKeyword.trim() === "") {
      setExpenses([...allExpenses]);
      return;
    }

    if (searchKeyword.trim() !== "" && searchKeyword.trim().length > 2) {
      const searchedElements = allExpenses.filter((exp) =>
        exp.title.toLowerCase().includes(searchKeyword.toLowerCase())
      );

      if (searchedElements.length <= 0) {
        return;
      }

      setExpenses(searchedElements);
      return;
    }
  }, [searchKeyword, allExpenses]);

  async function loadExpense(minPrice = "", maxPrice = "", fromDate = "", toDate = "") {
    try {
      setLoading(true);
      console.log("Loading expenses with filters:", { minPrice, maxPrice, fromDate, toDate });
      
      let expenseData;
      
      if (!fromDate && !toDate) {
        expenseData = await getExpenses(minPrice, maxPrice);
        console.log("Expenses data received:", expenseData);
      } else if (!minPrice && !maxPrice) {
        expenseData = await getSortedExpenses(fromDate, toDate);
        console.log("Sorted expenses data received:", expenseData);
      } else {
        // If both price and date filters are provided
        expenseData = await getExpenses(minPrice, maxPrice, fromDate, toDate);
        console.log("Filtered expenses data received:", expenseData);
      }

      // Handle different response formats
      if (Array.isArray(expenseData)) {
        setExpenses(expenseData);
        setAllExpenses(expenseData);
      } else if (expenseData && Array.isArray(expenseData.items)) {
        setExpenses(expenseData.items);
        setAllExpenses(expenseData.items);
      } else if (expenseData && expenseData.expenses) {
        setExpenses(expenseData.expenses);
        setAllExpenses(expenseData.expenses);
      } else {
        console.warn("Unexpected expense data format:", expenseData);
        setExpenses([]);
        setAllExpenses([]);
      }
      
    } catch (error) {
      console.error("Error loading expenses:", error);
      toast.error(error.response?.data?.message || "Error in loading expenses");
      setExpenses([]);
      setAllExpenses([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadExpense();
  }, []);

  const applyFilter = async () => {
    await loadExpense(filters.minPrice, filters.maxPrice, filters.fromDate, filters.toDate);
  };

  const clearFilter = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
      fromDate: "",
      toDate: "",
    });

    setSearchKeyword("");
    loadExpense();
  };

  const removeExpense = (expenseId) => {
    const updatedExpenses = expenses.filter((exp) => exp._id !== expenseId);
    const newAllExpense = allExpenses.filter((exp) => exp._id !== expenseId);
    setExpenses([...updatedExpenses]);
    setAllExpenses([...newAllExpense]);
  };

  const handleExpenseUpdated = (updated) => {
    setExpenses((prev) => prev.map((e) => (e._id === updated._id ? { ...e, ...updated } : e)));
    setAllExpenses((prev) => prev.map((e) => (e._id === updated._id ? { ...e, ...updated } : e)));
  };

  return (
    <div className="min-h-screen bg-gray-150 p-4">
      <div className="mb-6 rounded-[2rem] border border-white/10 bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white">View Expense</h2>
              <p className="mt-2 text-sm text-slate-300">
                Review your transactions, refine them with filters, and keep your budget in check.
              </p>
            </div>
            <div className="view-expense-search flex-1 max-w-xl">
              <label className="mb-2 block text-sm font-medium text-slate-200">Search expenses</label>
              <input
                onChange={(e) => {
                  setSearchKeyword(e.target.value);
                }}
                value={searchKeyword}
                type="text"
                id="voice-search"
                className="w-full rounded-3xl border border-white/10 bg-slate-900/90 px-5 py-3 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
                placeholder="Search your expense here"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[repeat(4,minmax(0,1fr))]">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">Select min price</span>
              <input
                onChange={(e) => {
                  setFilters({
                    ...filters,
                    minPrice: e.target.value,
                  });
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    applyFilter();
                  }
                }}
                value={filters.minPrice}
                id="minPrice"
                type="number"
                placeholder="Min Price"
                className="rounded-2xl border border-transparent bg-slate-900/90 px-4 py-2.5 text-sm text-white placeholder:text-slate-400 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">Select max price</span>
              <input
                onChange={(e) => {
                  setFilters({
                    ...filters,
                    maxPrice: e.target.value,
                  });
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    applyFilter();
                  }
                }}
                value={filters.maxPrice}
                id="maxPrice"
                type="number"
                placeholder="Max Price"
                className="rounded-2xl border border-transparent bg-slate-900/90 px-4 py-2.5 text-sm text-white placeholder:text-slate-400 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">From Date</span>
              <input
                type="date"
                onChange={(e) => {
                  setFilters({
                    ...filters,
                    fromDate: e.target.value,
                  });
                }}
                className="rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">To Date</span>
              <input
                type="date"
                onChange={(e) => {
                  setFilters({
                    ...filters,
                    toDate: e.target.value,
                  });
                }}
                className="rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={applyFilter}
              className="cursor-pointer rounded bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-cyan-400"
            >
              Apply Filter
            </button>
            <button
              type="button"
              onClick={clearFilter}
              className="cursor-pointer rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
            >
              Clear Filter
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {!loading && expenses.length > 0 && (
        <div>
          <div className="flex flex-col md:flex-row flex-wrap justify-center gap-3">
            {expenses.map((expense, index) => (
              <div key={expense._id || index} className="w-full md:w-1/2 lg:w-1/3">
                <ExpenseView
                  removeExpense={removeExpense}
                  onUpdateExpense={handleExpenseUpdated}
                  expense={expense}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {!loading && expenses.length <= 0 && (
        <div className="flex flex-col justify-center mt-10 items-center gap-2">
          <MdInfo className="text-red-400" size={38} />
          <h1 className="text-center text-3xl font-semibold text-gray-500">No expenses available</h1>
          <p className="text-gray-600">Try creating some expenses or check your filters</p>
          <button
            type="button"
            onClick={loadExpense}
            className="mt-4 cursor-pointer rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            Refresh Expenses
          </button>
        </div>
      )}
    </div>
  );
}

export default ViewExpenses;
