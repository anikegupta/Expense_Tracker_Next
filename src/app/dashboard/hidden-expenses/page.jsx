
"use client";

import React, { useEffect, useState } from "react";
import { getHiddenExpenses } from "../../../services/ExpenseService";
import { toast } from "react-toastify";
import { MdInfo } from "react-icons/md";
import ExpenseView from "@/components/user/ExpenseView";
import { TextInput } from "flowbite-react";

function HiddenExpenses() {
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

    if (searchKeyword.trim().length > 2) {
      const searchedElements = allExpenses.filter((exp) =>
        exp.title.toLowerCase().includes(searchKeyword.toLowerCase())
      );

      setExpenses(searchedElements);
    }
  }, [searchKeyword, allExpenses]);

  async function loadHiddenExpenses(minPrice = "", maxPrice = "", fromDate = "", toDate = "") {
    try {
      setLoading(true);
      const expenseData = await getHiddenExpenses(minPrice, maxPrice, fromDate, toDate);

      if (Array.isArray(expenseData)) {
        setExpenses(expenseData);
        setAllExpenses(expenseData);
      } else if (expenseData && Array.isArray(expenseData.items)) {
        setExpenses(expenseData.items);
        setAllExpenses(expenseData.items);
      } else {
        setExpenses([]);
        setAllExpenses([]);
      }
    } catch (error) {
      console.error("Error loading hidden expenses:", error);
      toast.error(error.response?.data?.message || "Error loading hidden expenses");
      setExpenses([]);
      setAllExpenses([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHiddenExpenses();
  }, []);

  const applyFilter = async () => {
    await loadHiddenExpenses(filters.minPrice, filters.maxPrice, filters.fromDate, filters.toDate);
  };

  const clearFilter = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
      fromDate: "",
      toDate: "",
    });
    setSearchKeyword("");
    loadHiddenExpenses();
  };

  const removeExpense = (expenseId) => {
    setExpenses((prev) => prev.filter((exp) => exp._id !== expenseId));
    setAllExpenses((prev) => prev.filter((exp) => exp._id !== expenseId));
  };

  const handleExpenseUpdated = (updated) => {
    setExpenses((prev) => prev.map((e) => (e._id === updated._id ? { ...e, ...updated } : e)));
    setAllExpenses((prev) => prev.map((e) => (e._id === updated._id ? { ...e, ...updated } : e)));
  };

  return (
    <div className="min-h-screen bg-gray-150 p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Hidden Expenses</h1>
        <p className="mt-2 text-sm text-gray-600 max-w-2xl">
          These expenses are hidden from your main dashboard. Search, filter, update, or unhide them from this page.
        </p>
      </div>

      <div className="flex gap-3 flex-wrap mb-4">
        <input
          onChange={(e) => setSearchKeyword(e.target.value)}
          value={searchKeyword}
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block flex-1 p-2.5"
          placeholder="Search your hidden expenses"
        />
      </div>

      <div className="filter_container items-center flex justify-between gap-2 py-2 mb-4 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          <div className="flex flex-col">
            <span className="text-gray-500 px-1 text-xs font-semibold">Min price</span>
            <TextInput
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              onKeyDown={(e) => { if (e.key === "Enter") applyFilter(); }}
              value={filters.minPrice}
              id="minPrice"
              sizing="sm"
              placeholder="Min Price"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 px-1 text-xs font-semibold">Max price</span>
            <TextInput
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              onKeyDown={(e) => { if (e.key === "Enter") applyFilter(); }}
              value={filters.maxPrice}
              id="maxPrice"
              sizing="sm"
              placeholder="Max Price"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 px-1 text-xs font-semibold">From date</span>
            <input
              type="date"
              onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
              value={filters.fromDate}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 px-1 text-xs font-semibold">To date</span>
            <input
              type="date"
              onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
              value={filters.toDate}
            />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={applyFilter}
            className="cursor-pointer rounded bg-green-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-green-700"
          >
            Apply Filter
          </button>
          <button
            type="button"
            onClick={clearFilter}
            className="cursor-pointer rounded bg-red-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-700"
          >
            Clear Filter
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {!loading && expenses.length > 0 && (
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
      )}

      {!loading && expenses.length <= 0 && (
        <div className="flex flex-col justify-center mt-10 items-center gap-2">
          <MdInfo className="text-red-400" size={38} />
          <h1 className="text-center text-3xl font-semibold text-gray-500">No hidden expenses found</h1>
          <p className="text-gray-600">Try adjusting your filters or mark some expenses as hidden.</p>
          <button
            type="button"
            onClick={loadHiddenExpenses}
            className="mt-4 cursor-pointer rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      )}
    </div>
  );
}

export default HiddenExpenses;