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
    <div className="hover:bg-neutral-100 hover:cursor-pointer relative mx-auto bg-white rounded-2xl shadow-lg p-5 flex flex-col items-center gap-2 hover:shadow-xl transition border-t-4 hover:scale-105 border-blue-900">
      {/* Top Money Bag Image */}
      <img
        src="https://img.icons8.com/color/96/money-bag.png"
        alt="money bag"
        className="w-16 h-16 rounded-xl object-cover"
      />

      {/* Expense Content */}
      <div className="flex-1 w-full">
        {/* Title and Amount */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">{expense.title}</h2>
          <span className="text-xl font-bold text-green-600">₹{expense.rs}</span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 mt-1">{expense.description}</p>

        {/* Payment Method and Date */}
        <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
          <span className="px-2 py-1 bg-gray-100 rounded-full text-gray-600 flex items-center gap-1 capitalize">
            {getPaymentIcon(expense.paymentMethod)}
            {expense.paymentMethod}
          </span>
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 absolute right-3 top-3">
        <MdDelete
          onClick={handleDelete}
          className="cursor-pointer p-2 w-7 h-7 bg-gray-300 rounded-full hover:bg-red-400 hover:text-white transition"
          size={20}
        />
        <BsPencilSquare
          onClick={() => setOpenEdit(true)}
          className="cursor-pointer p-2 w-7 h-7 bg-gray-300 rounded-full hover:bg-blue-400 hover:text-white transition"
          size={20}
        />
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