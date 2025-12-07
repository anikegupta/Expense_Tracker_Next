"use client";

import React, { useEffect, useState } from "react";
import { getExpenses, getSortedExpenses } from "../../../services/ExpenseService";
import { toast } from "react-toastify";
import { MdInfo } from "react-icons/md";
import ExpenseView from "@/components/user/ExpenseView";
import { Button, TextInput, Label, Datepicker } from "flowbite-react";

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
    <div className="min-h-screen p-4">
           {/* search bar */}
      <div className="flex gap-3 flex-wrap mb-4">
        <input
          onChange={(e) => {
            setSearchKeyword(e.target.value);
          }}
          value={searchKeyword}
          type="text"
          id="voice-search"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block flex-1 p-2.5"
          placeholder="Search your expense here"
          required
        />
      </div>

      <div className="filter_container items-center flex justify-between gap-2 py-2 mb-4">
        <div className="flex gap-2 flex-wrap">
          <div className="flex flex-col">
            <span className="text-black-600 px-1 text-xs font-semibold">Select min price</span>
            <TextInput
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
              sizing="sm"
              placeholder="Min Price"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-black-600 px-1 text-xs font-semibold">Select max price</span>
            <TextInput
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
              sizing="sm"
              placeholder="Max Price"
            />
          </div>

          <div className="flex flex-col">
            <span className="text-black-600 px-1 text-xs font-semibold">From Date</span>
            <input
              type="date"
              onChange={(e) => {
                setFilters({
                  ...filters,
                  fromDate: e.target.value,
                });
              }}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
            />
          </div>

          <div className="flex flex-col">
            <span className="text-black-600 px-1 text-xs font-semibold">To Date</span>
            <input
              type="date"
              onChange={(e) => {
                setFilters({
                  ...filters,
                  toDate: e.target.value,
                });
              }}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
            />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={applyFilter} className="cursor-pointer" size="sm" color={"green"}>
            Apply Filter
          </Button>
          <Button onClick={clearFilter} className="cursor-pointer" size="sm" color={"red"}>
            Clear Filter
          </Button>
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
          <h1 className="text-center text-3xl font-semibold">No expenses available</h1>
          <p className="text-gray-500">Try creating some expenses or check your filters</p>
          <Button onClick={loadExpense} className="mt-4 cursor-pointer">
            Refresh Expenses
          </Button>
        </div>
      )}
    </div>
  );
}

export default ViewExpenses;