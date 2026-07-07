import { createContext, useContext, useEffect, useState } from "react";

import { logoutUser } from "../services/authServices";
import socket from "../socket";
import axiosInstance from "../lib/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axiosInstance.get("/auth/me");

        setUser(data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
  try {
    await logoutUser();
  } catch (error) {
    console.log(error);
  }

  socket.disconnect();

  localStorage.removeItem("userId");
  localStorage.removeItem("username");

  setUser(null);
};

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
