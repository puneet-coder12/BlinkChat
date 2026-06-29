import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  generateRSAKeyPair,
  exportPublicKey,
  exportPrivateKey,
  saveKeys,
} from "../crypto";
import { loginUser, registerUser } from "../services/authServices.js";

const Auth = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const [username, setUsername] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let data;
      if (isLogin) {
        data = await loginUser({
          email,
          password,
        });
      } else {
        const { publicKey, privateKey } = await generateRSAKeyPair();

        const exportedPublic = await exportPublicKey(publicKey);

        const exportedPrivate = await exportPrivateKey(privateKey);

        saveKeys(exportedPublic, exportedPrivate);

        data = await registerUser({
          username,
          email,
          password,
          publicKey: exportedPublic,
        });
      }

      localStorage.setItem("token", data.token);

      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("username", data.user.username);

      navigate("/chat");
    } catch (error) {
      console.log(error);
      alert("Login Failed");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-80">
        <h1 className="text-2xl font-bold">{isLogin ? "Login" : "Register"}</h1>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className="border px-3 py-1"
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className="border px-3 py-1"
          >
            Register
          </button>
        </div>

        <input
          type="email"
          placeholder="Email"
          className="border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {!isLogin && (
          <input
            type="text"
            placeholder="Username"
            className="border p-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        )}

        <input
          type="password"
          placeholder="Password"
          className="border p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="bg-black text-white p-2">
          {isLogin ? "Login" : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Auth;
