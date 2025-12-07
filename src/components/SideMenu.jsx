"use client";

import React, { useState } from "react";
import {
  FaHome,
  FaPlusCircle,
  FaListUl,
  FaRobot,
  FaUser,
} from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { BiLogOut, BiMenu } from "react-icons/bi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthContext } from "../context/AuthContext";

function SideMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const location = usePathname();
  const { user, logoutUser } = useAuthContext();

  const menuItems = [
    { name: "Home", icon: <FaHome />, path: "/dashboard" },
    { name: "Add Expense", icon: <FaPlusCircle />, path: "/dashboard/add-expense" },
    { name: "View Expense", icon: <FaListUl />, path: "/dashboard/expenses" },
    { name: "Assistant", icon: <FaRobot />, path: "/dashboard/assistant" },
    { name: "Recycle Bin", icon: <MdDelete />, path: "/dashboard/recycle-bin" },
  ];

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-[68px] left-1 p-2 text-white bg-blue-900 rounded-md hover:bg-blue-800 transition-all z-50 cursor-pointer"
      >
        <BiMenu size={20} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-gradient-to-b from-blue-950 via-blue-900 to-blue-800 text-white shadow-lg flex flex-col transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Title */}
        <div className="p-6 text-2xl font-bold border-b border-gray-700 flex justify-between items-center">
          <span>Dashboard</span>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-300 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
          {menuItems.map((item, index) => {
            const isActive = location === item.path;
            return (
              <Link
                key={index}
                href={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-4 px-4 py-3 rounded-md transition duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}

          {/* ✅ User Info Link with Matching Font Style */}
          {user && (
            <>
              {(() => {
                const isActive = location === "/dashboard/user-profile";
                return (
                  <Link
                    href="/dashboard/user-profile"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-4 px-4 py-3 rounded-md transition duration-200 ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    {/* Fixed: Check if avatar exists and render appropriately */}
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="User Avatar"
                        className="w-6 h-6 rounded-full object-cover border border-gray-500"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-600 border border-gray-500 flex items-center justify-center">
                        <FaUser className="text-xs text-gray-300" />
                      </div>
                    )}
                    <span className="text-sm font-medium leading-none tracking-wide">
                      {user.username || user.name || "Profile"}
                    </span>
                  </Link>
                );
              })()}

              {/* Logout */}
              <button
                onClick={logoutUser}
                className="flex items-center space-x-4 px-4 py-3 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white w-full text-left"
              >
                <span className="text-lg">
                  <BiLogOut />
                </span>
                <span className="text-sm font-medium leading-none tracking-wide">
                  Logout
                </span>
              </button>
            </>
          )}
        </nav>
      </div>
    </>
  );
}

export default SideMenu;