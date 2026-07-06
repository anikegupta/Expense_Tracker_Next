
"use client";

import React, { useEffect, useState } from "react";
import { getHiddenExpenses, deleteExpenses, updateExpense } from "../../../services/ExpenseService";
import { toast } from "react-toastify";
import { MdInfo, MdEdit, MdDelete } from "react-icons/md";
import { AiOutlineEye } from "react-icons/ai";
import Swal from "sweetalert2";
import UpdateExpenseModal from "@/components/user/UpdateExpenseModal";
import { TextInput } from "flowbite-react";

const formatCurrency = (value) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const formatDate = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString();
};

function HiddenExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [allExpenses, setAllExpenses] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showModal, setShowModal] = useState(false);
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

  const handleUnhide = async (expenseId) => {
    try {
      await updateExpense(expenseId, { hidden: false });
      toast.success("Expense unhidden");
      removeExpense(expenseId);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error unhiding expense");
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowModal(true);
  };

  const handleDelete = async (expenseId) => {
    const result = await Swal.fire({
      title: "Delete expense?",
      text: "This will move it to the recycle bin.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
    });

    if (result.isConfirmed) {
      try {
        const data = await deleteExpenses(expenseId);
        toast.success(data.message || "Expense deleted");
        removeExpense(expenseId);
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Error deleting expense");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-150 p-4">
      <div className="mb-6 rounded-[2rem] border border-white/10 bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white">Hidden Expenses</h2>
              <p className="mt-2 text-sm text-slate-300 max-w-2xl">
                Review your hidden transactions. Unhide, edit, or delete them as needed.
              </p>
            </div>
            <div className="flex-1 max-w-xl">
              <label className="mb-2 block text-sm font-medium text-slate-200">Search hidden expenses</label>
              <input
                onChange={(e) => setSearchKeyword(e.target.value)}
                value={searchKeyword}
                type="text"
                className="w-full rounded-3xl border border-transparent bg-slate-900/90 px-5 py-3 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
                placeholder="Search your hidden expenses"
              />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[repeat(4,minmax(0,1fr))]">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">Select min price</span>
              <input
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                onKeyDown={(e) => { if (e.key === "Enter") applyFilter(); }}
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
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                onKeyDown={(e) => { if (e.key === "Enter") applyFilter(); }}
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
                onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                className="rounded-2xl border border-transparent bg-slate-900/90 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
                value={filters.fromDate}
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">To Date</span>
              <input
                type="date"
                onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                className="rounded-2xl border border-transparent bg-slate-900/90 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
                value={filters.toDate}
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
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {expenses.map((expense) => (
            <div key={expense._id} className="rounded-[1.5rem] border border-white/10 bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 p-5 text-white shadow-2xl transition duration-200 hover:-translate-y-1 hover:shadow-3xl">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-xl font-semibold text-white truncate">{expense.title}</h3>
                  <p className="mt-2 text-sm text-slate-300 line-clamp-3">{expense.description || "No description"}</p>
                </div>
                <div className="rounded-3xl bg-white/10 px-3 py-2 text-sm font-semibold text-cyan-300">
                  {formatCurrency(expense.rs)}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
                <span className="rounded-full bg-white/10 px-3 py-1">{expense.paymentMethod || "Unknown"}</span>
                <span>{formatDate(expense.createdAt)}</span>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  onClick={() => handleUnhide(expense._id)}
                  className="inline-flex items-center gap-2 rounded bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                >
                  <AiOutlineEye className="h-4 w-4" />
                  Unhide
                </button>

                {/* <button
                  onClick={() => handleEdit(expense)}
                  className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-400"
                >
                  <MdEdit className="h-4 w-4" />
                  Edit
                </button> */}

                <button
                  onClick={() => handleDelete(expense._id)}
                  className="inline-flex items-center gap-2 rounded bg-red-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-400"
                >
                  <MdDelete className="h-3 w-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && expenses.length <= 0 && (
        <div className="flex flex-col justify-center mt-10 items-center gap-2 rounded-lg border border-dashed border-gray-300  bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 py-12">
          <MdInfo className="text-red-400" size={38} />
          <h1 className="text-center text-3xl font-semibold text-white">No hidden expenses found</h1>
          <p className="text-white">Try adjusting your filters or mark some expenses as hidden.</p>
          <button
            type="button"
            onClick={loadHiddenExpenses}
            className="mt-4 cursor-pointer rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      )}

      {showModal && editingExpense && (
        <UpdateExpenseModal
          open={showModal}
          expense={editingExpense}
          onClose={() => {
            setShowModal(false);
            setEditingExpense(null);
          }}
          onSuccess={() => {
            setShowModal(false);
            setEditingExpense(null);
            loadHiddenExpenses();
          }}
        />
      )}
    </div>
  );
}

export default HiddenExpenses;
