"use client";

import React, { useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { MdDelete, MdPhoneIphone, MdAccountBalance } from "react-icons/md";
import { FaMoneyBillWave, FaCreditCard, FaWallet } from "react-icons/fa";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { deleteExpenses } from "@/services/ExpenseService";
import UpdateExpenseModal from "./UpdateExpenseModal";

function getPaymentIcon(method) {
  switch ((method || "").toLowerCase()) {
    case "cash":
      return <FaMoneyBillWave className="w-4 h-4 text-green-600" />;
    case "upi":
      return <MdPhoneIphone className="w-4 h-4 text-black" />;
    case "bank transfer":
      return <MdAccountBalance className="w-4 h-4 text-purple-600" />;
    case "card":
      return <FaCreditCard className="w-4 h-4 text-blue-600" />;
    default:
      return <FaWallet className="w-4 h-4 text-gray-600" />;
  }
}

function ExpenseView({ onUpdateExpense, removeExpense, expense }) {
  const formattedDate = new Date(expense.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  async function handleDelete() {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#0e41e8ff",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const data = await deleteExpenses(expense._id);
        removeExpense(expense._id);
        toast.success(data.message);
      } catch (error) {
        toast.error("Error in deleting expense");
        console.log(error);
      }
    }
  }

  const [openEdit, setOpenEdit] = useState(false);

  return (
    <div className="hover:cursor-pointer relative mx-auto rounded-[1.5rem] border border-white/10 bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 p-5 text-white shadow-2xl transition duration-200 hover:-translate-y-1 hover:shadow-3xl">
      {/* Top Money Bag Image */}
      <div className="flex items-center justify-between">
        <img
          src="https://img.icons8.com/color/96/money-bag.png"
          alt="money bag"
          className="h-14 w-14 rounded-2xl object-cover"
        />
        <div className="flex gap-2">
          <MdDelete
            onClick={handleDelete}
            className="cursor-pointer rounded-full bg-white/10 p-2 h-8 w-8 text-slate-100 transition hover:bg-red-500 hover:text-white"
            size={20}
          />
          <BsPencilSquare
            onClick={() => setOpenEdit(true)}
            className="cursor-pointer rounded-full bg-white/10 p-2 h-8 w-8 text-slate-100 transition hover:bg-cyan-400 hover:text-slate-950"
            size={20}
          />
        </div>
      </div>

      {/* Expense Content */}
      <div className="mt-4 flex-1 w-full">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">{expense.title}</h2>
          <span className="text-lg font-bold text-emerald-400">₹{expense.rs}</span>
        </div>

        <p className="mt-2 text-sm text-slate-300">{expense.description}</p>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
          <span className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 capitalize text-slate-100">
            {getPaymentIcon(expense.paymentMethod)}
            {expense.paymentMethod}
          </span>
          <span>{formattedDate}</span>
        </div>
      </div>
      <UpdateExpenseModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        expense={expense}
        onSuccess={(updated) => {
          onUpdateExpense?.(updated);
          setOpenEdit(false);
        }}
      />
    </div>
  );
}

export default ExpenseView;