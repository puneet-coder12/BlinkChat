import { useState, useEffect } from "react";
import socket from "../socket";

import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { useAuth } from "../context/AuthContext";
import { getConversations } from "../services/conversationService";
import { useNavigate } from "react-router-dom";

function Chat() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const navigate = useNavigate();

  const { user, logout } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState([]);

  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    if (!user) return;

    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    socket.on("online_users", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("online_users");
    };
  }, []);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await getConversations();
        setConversations(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchConversations();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="h-screen flex relative">
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 z-50 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow"
      >
        Logout
      </button>

      <Sidebar
        conversations={conversations}
        setConversations={setConversations}
        onlineUsers={onlineUsers}
        setSelectedConversation={setSelectedConversation}
      />

      <ChatWindow
        selectedConversation={selectedConversation}
        conversations={conversations}
        setConversations={setConversations}
      />
    </div>
  );
}

export default Chat;
