"use client";

import React, { useState } from "react";
import { createExpense } from "@/services/ExpenseService";
import { toast } from "react-toastify";
import { Button, Label, TextInput, Textarea, Select, ToggleSwitch } from "flowbite-react";
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
      className="flex items-center justify-center min-h-screen bg-gray-50 px-4"
    >
      <div className="w-full max-w-md rounded-2xl border-t-4 border-blue-900 backdrop-blur p-8 shadow-lg overflow-hidden bg-white">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-800">Add Expense</h2>
          <p className="text-sm text-gray-500 mt-1">
            Record a new transaction with details and payment method
          </p>
        </div>

        {/* Amount preview (floating top-right) */}
        <div className="hidden sm:flex items-center gap-1 text-emerald-600 bg-emerald-50 ring-1 ring-inset ring-emerald-200 px-3 py-1 rounded-md text-sm absolute top-4 right-4">
          <MdOutlineCurrencyRupee className="h-4 w-4" />
          <span>{previewAmount}</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">Title</Label>
            <TextInput
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter expense title"
              icon={MdTitle}
              required
              shadow
            />
          </div>

          {/* Amount */}
          <div>
            <Label htmlFor="rs">Amount (₹)</Label>
            <TextInput
              id="rs"
              type="number"
              name="rs"
              value={formData.rs}
              onChange={handleChange}
              placeholder="0"
              icon={MdOutlineCurrencyRupee}
              min={0}
              step="1"
              required
              shadow
            />
            <p className="mt-1 text-xs text-gray-500">
              You will spend: <span className="font-semibold">{previewAmount}</span>
            </p>
          </div>

          {/* Payment Method */}
          <div>
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <MdPayment className="h-5 w-5" />
              </div>
              <Select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="pl-9"
                required
              >
                <option value="Cash">💵 Cash</option>
                <option value="Card">💳 Card</option>
                <option value="UPI">📱 UPI</option>
                <option value="Bank Transfer">🏦 Bank Transfer</option>
              </Select>
            </div>
          </div>

          {/* Hidden Toggle */}
          <div>
            <Label>Visibility</Label>
            <div className="mt-1 flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2">
              <span className="text-sm text-gray-600">Mark as Hidden</span>
              <ToggleSwitch
                checked={formData.hidden}
                label=""
                border="none"
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, hidden: val }))
                }
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Add a short note about this expense"
              required
              shadow
            />
          </div>

          {/* Submit */}
          <div className="mt-4">
            <Button type="submit" color="blue" className="w-full shadow-md hover:scale-105">
              Save Expense
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AddExpense;