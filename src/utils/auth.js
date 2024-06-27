// src/utils/auth.js
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "token";

export const setAuthToken = (token) => {
  if (token) {
    Cookies.set(TOKEN_KEY, token);
  } else {
    Cookies.remove(TOKEN_KEY);
  }
};

export const getToken = () => {
  return Cookies.get(TOKEN_KEY);
};

export const getUserFromToken = () => {
  const token = getToken();
  if (token) {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  }
  return null;
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const logout = async () => {
  Cookies.remove(TOKEN_KEY);
};
