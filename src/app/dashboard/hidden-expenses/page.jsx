

"use client";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import HiddenPinModal from "@/components/user/HiddenPinModal";
import React, { useEffect, useState } from "react";
import { getHiddenExpenses, deleteExpenses, updateExpense } from "../../../services/ExpenseService";
import { toast } from "react-toastify";
import { MdInfo, MdEdit, MdDelete } from "react-icons/md";
import UpdateExpenseModal from "@/components/user/UpdateExpenseModal";
import {
    isHiddenPinSessionValid,
} from "@/utils/hiddenPinSession";


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
  const router = useRouter();
 useEffect(() => {

    if (isHiddenPinSessionValid()) {

        setAuthorized(true);
        setCheckingPin(false);
        loadHiddenExpenses();
        return;

    }

    setAuthorized(false);
    setShowPinModal(true);
    setCheckingPin(false);

}, []);

const [authorized, setAuthorized] = useState(false);

const [showPinModal, setShowPinModal] = useState(false);

const [checkingPin, setCheckingPin] = useState(true);
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
if (checkingPin) {
  return (
    <div className="flex items-center justify-center h-screen">
      <h2 className="text-xl font-semibold">
        Checking Security...
      </h2>
    </div>
  );
}
  return (
    <div className="hidden-expenses-page min-h-screen  p-4">

  <div className="mb-6 rounded-[2rem] border border-white/10 bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 p-6 shadow-2xl">

    <div className="flex flex-col gap-6">

      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">

        <div>

          <h2 className="text-3xl font-bold text-white">
            Hidden Expenses
          </h2>

          <p className="mt-2 text-sm text-slate-300">
            Review your hidden expenses.
          </p>

        </div>

        <div className="w-full lg:flex-1">

          <label className="mb-2 block text-sm text-slate-200">
            Search Hidden Expense
          </label>

          <input
            value={searchKeyword}
            onChange={(e)=>setSearchKeyword(e.target.value)}
            className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-white outline-none"
            placeholder="Search expense..."
          />

        </div>

      </div>

      <div className="grid gap-4 lg:grid-cols-4">

        <div>

          <label className="mb-2 block text-xs text-cyan-300">
            Minimum Price
          </label>

          <input
            type="number"
            value={filters.minPrice}
            onChange={(e)=>
              setFilters({
                ...filters,
                minPrice:e.target.value
              })
            }
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white"
          />

        </div>

        <div>

          <label className="mb-2 block text-xs text-cyan-300">
            Maximum Price
          </label>

          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e)=>
              setFilters({
                ...filters,
                maxPrice:e.target.value
              })
            }
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white"
          />

        </div>

        <div>

          <label className="mb-2 block text-xs text-cyan-300">
            From Date
          </label>

          <input
            type="date"
            value={filters.fromDate}
            onChange={(e)=>
              setFilters({
                ...filters,
                fromDate:e.target.value
              })
            }
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white"
          />

        </div>

        <div>

          <label className="mb-2 block text-xs text-cyan-300">
            To Date
          </label>

          <input
            type="date"
            value={filters.toDate}
            onChange={(e)=>
              setFilters({
                ...filters,
                toDate:e.target.value
              })
            }
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white"
          />

        </div>

      </div>

      <div className="flex gap-3">

        <button
          onClick={applyFilter}
          className="rounded bg-cyan-500 px-5 py-2 font-semibold text-slate-900 hover:bg-cyan-400"
        >
          Apply Filter
        </button>

        <button
          onClick={clearFilter}
          className="rounded bg-red-600 px-5 py-2 font-semibold text-white hover:bg-red-700"
        >
          Clear Filter
        </button>

      </div>

    </div>

  </div>

  {loading && (

    <div className="flex justify-center py-16">

      <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-cyan-500"></div>

    </div>

  )}

  {!loading && expenses.length>0 && (

    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

      {expenses.map((expense)=>(

        <div
          key={expense._id}
          className="rounded-[1.5rem] bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 p-5 text-white shadow-xl"
        >

          <div className="flex justify-between">

            <div>

              <h2 className="text-xl font-bold">
                {expense.title}
              </h2>

              <p className="mt-2 text-sm text-slate-300">
                {expense.description}
              </p>

            </div>

            <span className="font-bold text-emerald-400">
              {formatCurrency(expense.rs)}
            </span>

          </div>

          <div className="mt-5 flex justify-between text-sm text-slate-300">

            <span>
              {expense.paymentMethod}
            </span>

            <span>
              {formatDate(expense.createdAt)}
            </span>

          </div>

          <div className="mt-6 flex flex-wrap gap-2">

            <button
              onClick={()=>handleUnhide(expense._id)}
              className="rounded bg-emerald-500 px-4 py-2 font-semibold text-slate-900 hover:bg-emerald-400"
            >
              Unhide
            </button>

            <button
              onClick={()=>handleEdit(expense)}
              className="rounded bg-cyan-500 px-4 py-2 font-semibold text-slate-900 hover:bg-cyan-400"
            >
              Edit
            </button>

            <button
              onClick={()=>handleDelete(expense._id)}
              className="rounded bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-500"
            >
              Delete
            </button>

          </div>

        </div>

      ))}
           
    </div>
  )}

  {!loading && expenses.length === 0 && (
    <div className="mt-12 rounded-[2rem] border border-dashed border-slate-300 bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 py-16">

      <div className="flex flex-col items-center">

        <MdInfo
          size={50}
          className="text-cyan-300"
        />

        <h2 className="mt-6 text-3xl font-bold text-white">
          No Hidden Expenses
        </h2>

        <p className="mt-2 text-slate-300">
          You don't have any hidden expenses yet.
        </p>

        <button
          onClick={loadHiddenExpenses}
          className="mt-6 rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-slate-900 transition hover:bg-cyan-400"
        >
          Refresh
        </button>

      </div>

    </div>
  )}

  <UpdateExpenseModal
    open={showModal}
    expense={editingExpense}
    onClose={() => {
      setShowModal(false);
      setEditingExpense(null);
    }}
    onSuccess={(updatedExpense) => {

      setExpenses((prev) =>
        prev.map((expense) =>
          expense._id === updatedExpense._id
            ? updatedExpense
            : expense
        )
      );

      setAllExpenses((prev) =>
        prev.map((expense) =>
          expense._id === updatedExpense._id
            ? updatedExpense
            : expense
        )
      );

      setShowModal(false);

      setEditingExpense(null);

      toast.success("Expense updated successfully");

    }}
  />

  <HiddenPinModal
    open={showPinModal}
    onClose={() => {
        router.push("/dashboard");
    }}
    onSuccess={() => {

        setAuthorized(true);

        setShowPinModal(false);

        loadHiddenExpenses();

    }}
/>

</div>
);
}

export default HiddenExpenses;
