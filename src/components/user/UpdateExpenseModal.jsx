"use client";

import React, { useEffect, useMemo, useState } from "react";
import { MdOutlineCurrencyRupee, MdPayment, MdTitle } from "react-icons/md";
import { toast } from "react-toastify";
import { updateExpense } from "../../services/ExpenseService";

const paymentOptions = [
  { value: "Cash", label: "Cash" },
  { value: "Card", label: "Card" },
  { value: "UPI", label: "UPI" },
  { value: "Bank Transfer", label: "Bank Transfer" },
];

export default function UpdateExpenseModal({ open, onClose, expense, onSuccess }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    rs: 0,
    paymentMethod: "Cash",
    hidden: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (expense) {
      setForm({
        title: expense.title || "",
        description: expense.description || "",
        rs: Number(expense.rs || 0),
        paymentMethod: expense.paymentMethod || "Cash",
        hidden: Boolean(expense.hidden),
      });
    }
  }, [expense]);

  const previewAmount = useMemo(() => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(form.rs || 0));
  }, [form.rs]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setForm((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (!expense?._id) {
      toast.error("Invalid expense");
      return;
    }
    try {
      setSaving(true);
      const payload = { ...form, rs: Number(form.rs) };
      const updated = await updateExpense(expense._id, payload);
      toast.success("Expense updated successfully");
      onSuccess?.(updated);
      onClose?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update expense");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 text-white grid place-items-center">₹</div>
            <div>
              <div className="text-lg font-semibold text-slate-900">Update Expense</div>
              <div className="text-sm text-slate-500">Make changes and save</div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">Close</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Title</label>
              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                placeholder="Expense title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Amount (₹)</label>
              <input
                id="rs"
                name="rs"
                type="number"
                min={0}
                step="1"
                value={form.rs}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                placeholder="0"
                required
              />
              <p className="mt-1 text-xs text-slate-500">Preview: <span className="font-semibold">{previewAmount}</span></p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Payment Method</label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                required
              >
                {paymentOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <div className="w-full">
                <label className="block text-sm font-medium text-slate-700">Visibility</label>
                <div className="mt-1 flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2">
                  <span className="text-sm text-slate-600">Mark as Hidden</span>
                  <input id="hidden" name="hidden" type="checkbox" checked={Boolean(form.hidden)} onChange={handleChange} className="h-4 w-4" />
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Description</label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                placeholder="Add a note about this expense"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button type="button" onClick={onClose} className="rounded-full bg-gray-200 px-4 py-2 text-sm font-medium text-slate-700">Cancel</button>
            <button type="submit" disabled={saving} className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">{saving ? 'Saving...' : 'Save changes'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}