"use client";
import { setHiddenPinSession } from "@/utils/hiddenPinSession";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  hiddenPinStatus,
  createOrVerifyHiddenPin,
} from "@/services/ExpenseService";

const SESSION_TIME = 15 * 60 * 1000;

export default function HiddenPinModal({
  open,
  onSuccess,
  onClose,
}) {
  const [loading, setLoading] = useState(false);
  const [creatingPin, setCreatingPin] = useState(false);
  const [pin, setPin] = useState("");

  useEffect(() => {
    if (!open) return;

    async function checkPin() {
      try {
        const exists = await hiddenPinStatus();
        setCreatingPin(!exists);
      } catch (err) {
        console.log(err);
        toast.error("Unable to check PIN status");
      }
    }

    checkPin();
  }, [open]);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();

    if (!/^\d{4}$/.test(pin)) {
      toast.error("PIN must contain exactly 4 digits");
      return;
    }

    try {
      setLoading(true);

      const result = await createOrVerifyHiddenPin(pin);
     setHiddenPinSession();

      toast.success(result.message);

      onSuccess?.();

      setPin("");

    } catch (err) {
      toast.error(err.message || "Incorrect PIN");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">

        <h2 className="text-2xl font-bold text-center">

          {creatingPin
            ? "Create Hidden PIN"
            : "Enter Hidden PIN"}

        </h2>

        <p className="mt-2 text-center text-sm text-gray-500">

          {creatingPin
            ? "Create a secure 4 digit PIN"
            : "Enter your 4 digit PIN"}

        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5"
        >

          <input
            autoFocus
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={pin}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");

              if (value.length <= 4) {
                setPin(value);
              }
            }}
            className="w-full rounded-xl border px-4 py-3 text-center text-3xl tracking-[15px] outline-none focus:border-cyan-500"
            placeholder="••••"
          />

          <button
            disabled={loading}
            className="w-full rounded-xl bg-cyan-600 py-3 text-white font-semibold hover:bg-cyan-700 disabled:opacity-60"
          >

            {loading
              ? "Please wait..."
              : creatingPin
              ? "Create PIN"
              : "Unlock"}

          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border py-3"
          >
            Cancel
          </button>

        </form>

      </div>

    </div>
  );
}