"use client";

import React, { useState } from "react";
import { loginUser } from "@/services/AuthService";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { saveLoginData } from "@/services/LocaStorageSrevice";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

export default function Login() {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser, setAccessToken } = useAuthContext();
  const router = useRouter();

  const submitData = async (event) => {
    event.preventDefault();
    if (loginData.email.trim() === "") {
      toast.error("Email required!!");
      return;
    }
    if (loginData.password.trim() === "") {
      toast.error("Password required!!");
      return;
    }

    setLoading(true);
    try {
      const responseData = await loginUser(loginData);
      saveLoginData(responseData);
      setUser(responseData.user);
      setAccessToken(responseData.accessToken);
      toast.success("Login success");
      router.push("/dashboard");
    } catch (error) {
      console.log(error);
      if (error.status === 403) toast.error(error.response.data.message);
      else toast.error("Error in login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-blue-800 px-4">
      <form noValidate onSubmit={submitData} className="rounded-[2rem] border border-white/10 bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 w-[350px] sm:w-[400px] md:w-[450px] lg:w-[500px] p-8 shadow-2xl backdrop-blur-xl">
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">
              Login Here
            </h1>
            <p className="text-slate-300 text-sm mt-2">Enter your credentials to continue</p>
          </div>

          {/* Email */}
          <div>
            <label className="text-lg font-medium text-slate-200">Email</label>
            <input
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
              type="email"
              name="email"
              className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/90 px-5 py-4 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="text-lg font-medium text-slate-200">Password</label>
            <input
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
              type={showPassword ? "text" : "password"}
              name="password"
              className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/90 px-5 py-4 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 pr-12"
              placeholder="Enter your password"
              required
            />

            {/* Eye icon */}
            <span
              className="absolute right-6 top-[58px] cursor-pointer text-slate-400 hover:text-cyan-400 select-none transition"
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

          {/* Buttons */}
          <div className="flex gap-6 justify-between pt-2">
            <button
              type="button"
              disabled={loading}
              className="flex-1 inline-flex items-center justify-center rounded bg-red-600 px-4 py-4 text-md font-semibold text-white transition hover:bg-red-700 hover:cursor-pointer disabled:opacity-60"
              onClick={() => setLoginData({ email: "", password: "" })}
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 inline-flex items-center justify-center rounded bg-cyan-500 px-4 py-4 text-md font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60 hover:cursor-pointer"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>

          {/* Signup redirect line */}
          <div className="flex justify-center mt-4">
            <p className="text-slate-300 text-sm">
              Don't have an account?{" "}
              <span
                onClick={() => router.push("/signup")}
                className="text-cyan-400 hover:text-cyan-300 cursor-pointer font-medium transition"
              >
                Sign up
              </span>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}