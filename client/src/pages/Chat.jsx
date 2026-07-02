import { useState, useEffect } from "react";
import socket from "../socket";

import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { useAuth } from "../context/AuthContext";
import { getConversations } from "../services/conversationService";

function Chat() {
  const [selectedConversation, setSelectedConversation] = useState(null);
const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState([]);

  const [conversations, setConversations] = useState([]);

useEffect(() => {
  if (!user) return;

  socket.connect();

  socket.emit("user_online");

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

  return (
    <div className="h-screen flex">
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