"use client";
import React, { useState } from "react";
import { createUser } from "../../services/UserService";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState([]);
  const [creating, setCreating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    setCreating(true);
    setErrors([]);
    try {
      const response = await createUser(formData);
      toast.success("User is created Successfully..");
      setFormData({ username: "", email: "", password: "", confirmPassword: "" });
      setCreating(false);
      router.push("/login");
    } catch (error) {
      if (error.status === 400) {
        setErrors(error.response.data);
        toast.error("Validation error");
      } else {
        toast.error("Server error");
      }
      setCreating(false);
    }
  };

  const passwordMismatch = formData.confirmPassword && formData.password !== formData.confirmPassword;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-blue-800 px-4">
      <form noValidate onSubmit={handleSubmit} className="rounded-[2rem] border border-white/10 bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 w-[350px] sm:w-[400px] md:w-[450px] lg:w-[500px] p-8 shadow-2xl backdrop-blur-xl">
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">
              Sign Up Here
            </h1>
            <p className="text-slate-300 text-sm mt-2">Create your account to get started</p>
          </div>

          {/* Display API validation errors */}
          {errors.length > 0 && (
            <div className="space-y-2">
              {errors.map((error, idx) => (
                <div key={idx} className="p-4 rounded-3xl border border-rose-500/30 bg-rose-500/15">
                  <p className="text-rose-200 text-sm">{error.property.toUpperCase()}: {error.errorValue}</p>
                </div>
              ))}
            </div>
          )}

          {/* Username */}
          <div>
            <label className="text-lg font-medium text-slate-200">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/90 px-5 py-4 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
              placeholder="Enter your username"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-lg font-medium text-slate-200">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/90 px-5 py-4 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="text-lg font-medium text-slate-200">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/90 px-5 py-4 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 pr-12"
              placeholder="Enter your password"
              required
            />

            {/* Eye icon */}
            <span
              className="absolute right-4 top-[52px] cursor-pointer text-slate-400 hover:text-cyan-400 select-none transition"
              onMouseDown={() => setShowPassword(true)}
              onMouseUp={() => setShowPassword(false)}
              onMouseLeave={() => setShowPassword(false)}
              onTouchStart={() => setShowPassword(true)}
              onTouchEnd={() => setShowPassword(false)}
            >
              {showPassword ? (
                <MdVisibilityOff size={20} />
              ) : (
                <MdVisibility size={20} />
              )}
            </span>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="text-lg font-medium text-slate-200">Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/90 px-5 py-4 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 pr-12"
              placeholder="Confirm your password"
              required
            />

            {/* Eye icon */}
            <span
              className="absolute right-4 top-[52px] cursor-pointer text-slate-400 hover:text-cyan-400 select-none transition"
              onMouseDown={() => setShowConfirmPassword(true)}
              onMouseUp={() => setShowConfirmPassword(false)}
              onMouseLeave={() => setShowConfirmPassword(false)}
              onTouchStart={() => setShowConfirmPassword(true)}
              onTouchEnd={() => setShowConfirmPassword(false)}
            >
              {showConfirmPassword ? (
                <MdVisibilityOff size={20} />
              ) : (
                <MdVisibility size={20} />
              )}
            </span>
            
            {/* Password mismatch warning */}
            {passwordMismatch && (
              <p className="text-rose-300 text-sm mt-2">Passwords do not match</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-between pt-2">
            <button
              type="button"
              disabled={creating}
              className="flex-1 inline-flex items-center justify-center rounded-full bg-red-600 px-6 py-4 text-md font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
              onClick={() => setFormData({ username: "", email: "", password: "", confirmPassword: "" })}
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={creating}
              className="flex-1 inline-flex items-center justify-center rounded-full bg-cyan-500 px-6 py-4 text-md font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60 hover:cursor-pointer"
            >
              {creating ? "Creating..." : "Sign Up"}
            </button>
          </div>

          {/* Login redirect line */}
          <div className="flex justify-center mt-4">
            <p className="text-slate-300 text-sm">
              Already have an account?{" "}
              <span
                onClick={() => router.push("/login")}
                className="text-cyan-400 hover:text-cyan-300 cursor-pointer font-medium transition"
              >
                Login
              </span>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}