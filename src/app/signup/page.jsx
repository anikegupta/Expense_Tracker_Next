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
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-[350px] sm:w-[400px] md:w-[450px] lg:w-[500px] shadow-2xl rounded-2xl p-10 bg-zinc-100 border-t-4 border-blue-900 hover:scale-102">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800 hover:scale-102">
          Sign Up Here
        </h1>
        
        {/* Display API validation errors */}
        {errors.length > 0 && (
          <div className="py-3">
            {errors.map((error, idx) => (
              <div key={idx} className="p-2 border-red-300 mb-2 border rounded">
                <p className="text-red-400">{error.property.toUpperCase()}: {error.errorValue}</p>
              </div>
            ))}
          </div>
        )}
        
        <form noValidate onSubmit={handleSubmit}>
          {/* Username */}
          <div>
            <label className="block text-gray-700 mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 bg-white"
              placeholder="Enter your username"
              required
            />
          </div>

          {/* Email */}
          <div className="mt-2">
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 bg-white"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div className="mt-2 relative">
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10 text-gray-900 bg-white"
              placeholder="Enter your password"
              required
            />

            {/* Eye icon */}
            <span
              className="absolute right-3 top-[38px] cursor-pointer text-gray-600 hover:text-blue-600 select-none"
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
          <div className="mt-2 relative">
            <label className="block text-gray-700 mb-1">Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10 text-gray-900 bg-white"
              placeholder="Confirm your password"
              required
            />

            {/* Eye icon */}
            <span
              className="absolute right-3 top-[38px] cursor-pointer text-gray-600 hover:text-blue-600 select-none"
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
              <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-2 mt-4">
            <button
              type="submit"
              disabled={creating}
              className="bg-blue-700 text-white px-4 rounded py-2 hover:bg-blue-600 transition hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating ? "Creating..." : "Sign Up"}
            </button>
            <button
              type="button"
              disabled={creating}
              className="bg-orange-700 text-white px-4 rounded py-2 hover:bg-orange-600 transition hover:scale-105 cursor-pointer disabled:opacity-50"
              onClick={() => setFormData({ username: "", email: "", password: "", confirmPassword: "" })}
            >
              Reset
            </button>
          </div>

          {/* Login redirect line */}
          <div className="flex justify-center mt-4">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <span
                onClick={() => router.push("/login")}
                className="text-indigo-600 hover:underline cursor-pointer font-medium"
              >
                Login
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}