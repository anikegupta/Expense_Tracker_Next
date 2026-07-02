import { isTokenExpired } from "../utils/jwtExpiry";

// Next.js-safe localStorage service
// All functions check for window before accessing localStorage

export const saveLoginData = (userData) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("userData", JSON.stringify(userData));
  }
};

export const getLoginData = () => {
  if (typeof window !== "undefined") {
    const userDataStr = localStorage.getItem("userData");
    if (userDataStr) return JSON.parse(userDataStr);
  }
  return null;
};

export const getUserFromLocalStorage = () => {
  return getLoginData()?.user || null;
};

export const getAccessTokenFromLocalStorage = () => {
  return getLoginData()?.accessToken || null;
};

export const removeLoginData = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("userData");
  }
};

export const isAccessTokenValid = () => {
  const token = getAccessTokenFromLocalStorage();
  return !!token && !isTokenExpired(token);
};

export const isUserLogin = () => {
  return !!(
    getUserFromLocalStorage() &&
    getAccessTokenFromLocalStorage() &&
    !isTokenExpired(getAccessTokenFromLocalStorage())
  );
};
