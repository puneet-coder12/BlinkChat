import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

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
      await axiosInstance.post("/auth/logout");
    } catch (error) {}

    setUser(null);

    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("publicKey");
    localStorage.removeItem("privateKey");
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