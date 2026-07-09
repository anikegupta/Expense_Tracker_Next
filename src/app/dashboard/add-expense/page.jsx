"use client";

import React, { useState } from "react";
import { createExpense } from "@/services/ExpenseService";
import { toast } from "react-toastify";
import { Button, Label, TextInput, Textarea, Select } from "flowbite-react";
import { MdOutlineCurrencyRupee, MdTitle, MdPayment } from "react-icons/md";
import { motion } from "framer-motion";

const AddExpense = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    rs: 0,
    paymentMethod: "Cash",
    hidden: false,
  });

  const previewAmount = new Intl.NumberFormat("en-IN", {
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(formData.rs || 0));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, rs: Number(formData.rs) };
      await createExpense(payload);
      toast.success("Expense created successfully!");
      setFormData({
        title: "",
        description: "",
        rs: 0,
        paymentMethod: "Cash",
        hidden: false,
      });
    } catch (error) {
      console.log(error);
      toast.error("Error in creating expense");
    }
  };

  return (
    <motion.div
      initial={{ y: 6, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="add-expense-page flex items-center justify-center min-h-screen bg-gray-150 px-4"
    >
      <form onSubmit={handleSubmit} className="add-expense-card rounded-[2rem] border border-white/10 bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 w-full max-w-md p-8 shadow-2xl backdrop-blur-xl">
        <div className="add-expense-grid space-y-6">
          {/* Header */}
          <div className="add-expense-header text-center">
            <h2 className="text-3xl font-bold text-white">Add Expense</h2>
            <p className="text-slate-300 text-sm mt-2">
              Record a new transaction with details and payment method
            </p>
          </div>

          {/* Amount preview */}
          <div className="add-expense-preview flex items-center gap-1 text-emerald-400 bg-emerald-500/15 ring-1 ring-inset ring-emerald-500/30 px-4 py-3 rounded-3xl text-sm">
            <MdOutlineCurrencyRupee className="h-5 w-5" />
            <span>You will spend: <span className="font-semibold">{previewAmount}</span></span>
          </div>

          {/* Title */}
          <div className="add-expense-field">
            <label className="text-lg font-medium text-slate-200">Title</label>
            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter expense title"
              required
              className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/90 px-5 py-4 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
            />
          </div>

          {/* Amount */}
          <div className="add-expense-field">
            <label className="text-lg font-medium text-slate-200">Amount (₹)</label>
            <input
              id="rs"
              type="number"
              name="rs"
              value={formData.rs}
              onChange={handleChange}
              step="1"
              required
              placeholder="Enter amount"
              className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-900/90 px-5 py-4 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
            />
          </div>

          {/* Payment Method */}
          <div className="add-expense-field">
            <label className="text-lg font-medium text-slate-200">Payment Method</label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              required
              className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/90 px-6 py-4 text-white font-md outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
            >
              <option value="Cash">💵 Cash</option>
              <option value="Card">💳 Card</option>
              <option value="UPI">📱 UPI</option>
              <option value="Bank Transfer">🏦 Bank Transfer</option>
            </select>
          </div>

          {/* Visibility */}
          <div className="add-expense-field add-expense-visibility">
            <label className="text-lg font-medium text-slate-200 block mb-3">Visibility</label>
            <div className="rounded-3xl border border-white/10 bg-slate-900/90 px-5 py-4 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30">
              <span className="text-slate-300 text-sm">Mark as Hidden</span>
              <div className="mt-3 flex items-center gap-6">
                <label className="inline-flex items-center gap-3 text-slate-300 cursor-pointer">
                  <input
                    type="radio"
                    name="hidden"
                    value="true"
                    checked={formData.hidden === true}
                    onChange={() => setFormData((prev) => ({ ...prev, hidden: true }))}
                    className="h-4 w-4 text-cyan-400 border-slate-600 focus:ring-cyan-400"
                  />
                  Hidden
                </label>
                <label className="inline-flex items-center gap-3 text-slate-300 cursor-pointer">
                  <input
                    type="radio"
                    name="hidden"
                    value="false"
                    checked={formData.hidden === false}
                    onChange={() => setFormData((prev) => ({ ...prev, hidden: false }))}
                    className="h-4 w-4 text-cyan-400 border-slate-600 focus:ring-cyan-400"
                  />
                  Visible
                </label>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="add-expense-field add-expense-description">
            <label className="text-lg font-medium text-slate-200">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Add a short note about this expense"
              required
              className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/90 px-5 py-4 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="add-expense-submit inline-flex items-center justify-center rounded bg-cyan-500 px-6 py-4 text-md font-semibold text-slate-950 transition hover:bg-cyan-400 cursor-pointer"
          >
            Save Expense
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddExpense;
