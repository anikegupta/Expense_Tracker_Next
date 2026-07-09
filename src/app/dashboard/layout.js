"use client";

import React, { useEffect } from "react";
import SideMenu from "../../components/SideMenu";
import { useRouter } from "next/navigation";
import {
  getAccessTokenFromLocalStorage,
  removeLoginData,
} from "../../services/LocaStorageSrevice";
import { isTokenExpired } from "../../utils/jwtExpiry";
import Swal from "sweetalert2";

function DashboardLayout({ children }) {
  const router = useRouter();

  function checkAuthentication() {
    const token = getAccessTokenFromLocalStorage();

    if (!token || isTokenExpired(token)) {
      removeLoginData();
      Swal.fire({
        icon: "warning",
        title: token ? "Session Expired" : "Unauthorized",
        text: token
          ? "Login session expired. Please login again."
          : "You must be logged in to access the dashboard.",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Login",
      }).then(() => {
        router.push("/login");
      });
    }
  }

  useEffect(() => {
    checkAuthentication();
  }, [router]);

  return (  
    <div className="bg-gradient-to-b from-blue-950 via-blue-900 to-blue-800 min-h-screen">
      {/* Sidebar */}
      <SideMenu />

      {/* Main content */}
      <main className="dashboard-main mt-16 md:p-10">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;
