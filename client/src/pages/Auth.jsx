import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  generateRSAKeyPair,
  exportPublicKey,
  exportPrivateKey,
  saveKeys,
} from "../crypto";
import { loginUser, registerUser } from "../services/authServices.js";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../lib/axios";

const Auth = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const [username, setUsername] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (isLogin) {
      await loginUser({
        email,
        password,
      });
    } else {
      const { publicKey, privateKey } =
        await generateRSAKeyPair();

      const exportedPublic =
        await exportPublicKey(publicKey);

      const exportedPrivate =
        await exportPrivateKey(privateKey);

      saveKeys(
        exportedPublic,
        exportedPrivate
      );

      await registerUser({
        username,
        email,
        password,
        publicKey: exportedPublic,
      });
    }

    // Verify authentication using the HttpOnly cookie
    const { data } = await axiosInstance.get("/auth/me");

    setUser(data.user);

    navigate("/chat");
  } catch (error) {
    console.log(error);

    alert(
      error.response?.data?.message ||
      "Authentication Failed"
    );
  }
};

  return (
    <div className="h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="max-w-96 w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white py-8"
      >
        <h1 className="text-gray-900 text-3xl font-medium">
          {isLogin ? "Login" : "Register"}
        </h1>

        <p className="text-gray-500 text-sm mt-2">
          {isLogin
            ? "Please sign in to continue"
            : "Create your account to continue"}
        </p>

        {/* Email */}
        <div className="flex items-center w-full mt-8 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <svg
            width="16"
            height="11"
            viewBox="0 0 16 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
              fill="#6B7280"
            />
          </svg>

          <input
            type="email"
            placeholder="Email"
            className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Username (Register only) */}
        {!isLogin && (
          <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.121 17.804A9 9 0 1118.88 17.8M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>

            <input
              type="text"
              placeholder="Username"
              className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        )}

        {/* Password */}
        <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <svg
            width="13"
            height="17"
            viewBox="0 0 13 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
              fill="#6B7280"
            />
          </svg>

          <input
            type="password"
            placeholder="Password"
            className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Forgot Password */}
        {isLogin && (
          <div className="mt-5 text-left">
            <button
              type="button"
              className="text-sm text-indigo-500 hover:underline"
            >
              Forgot password?
            </button>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="mt-5 w-full h-11 rounded-full text-white bg-indigo-500 hover:bg-indigo-600 transition"
        >
          {isLogin ? "Login" : "Register"}
        </button>

        {/* Toggle Login/Register */}
        <p className="text-gray-500 text-sm mt-5">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-500 hover:underline"
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>
      </form>
    </div>
  );
};

export default Auth;
