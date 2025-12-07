"use client";

import React, { useEffect } from "react";
import SideMenu from "../../components/SideMenu";
import { useRouter } from "next/navigation";
import { getAccessTokenFromLocalStorage } from "../../services/LocaStorageSrevice";
import Swal from "sweetalert2";

function DashboardLayout({ children }) {
  const router = useRouter();

  function checkAuthentication() {
    const token = getAccessTokenFromLocalStorage();
    if (!token) { 
      Swal.fire({
        icon: "warning",
        title: "Unauthorized",
        text: "You must be logged in to access the dashboard.",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      }).then(() => {
        router.push("/login");
      });
    }
  }

  useEffect(() => {
    checkAuthentication();
  }, [router]);

  return (  
    <div className="">
      {/* Sidebar */}
      <SideMenu />

      {/* Main content */}
      <main className="mt-16 md:p-10 ">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;