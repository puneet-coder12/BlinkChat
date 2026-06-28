import "./App.css";
import { useEffect, useState } from "react";
import socket from "./socket";
import { Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth.jsx";
import Chat from "./pages/Chat.jsx";

function App() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    return () => {
      socket.off("connect");
    };
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </>
  );
}

export default App;
