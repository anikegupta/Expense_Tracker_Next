"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserFromLocalStorage, removeLoginData, getAccessTokenFromLocalStorage } from "../services/LocaStorageSrevice";

const AuthContent = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loadingDashboardData, setLoadingDashboardData] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setAccessToken(getAccessTokenFromLocalStorage());
    setUser(getUserFromLocalStorage());
  }, []);

  function logoutUser() {
    setUser(null);
    setAccessToken(null);
    removeLoginData();
    setDashboardData(null);
    setLoadingDashboardData(false);
    router.push("/login");
  }

  // Utility function to update user (for avatar/profile updates)
  const updateUserContext = (updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
  };

  return (
    <AuthContent.Provider value={{
      user,
      setUser,
      accessToken,
      setAccessToken,
      logoutUser,
      dashboardData,
      setDashboardData,
      loadingDashboardData,
      setLoadingDashboardData,
      updateUserContext
    }}>
      {children}
    </AuthContent.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContent);
