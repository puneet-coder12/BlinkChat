import { useState, useEffect } from "react";
import socket from "../socket";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

function Chat() {
  const [selectedConversation, setSelectedConversation] = useState(null);

  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    socket.emit("user_online", localStorage.getItem("userId"));
  }, []);

  useEffect(() => {
    socket.on("online_users", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("online_users");
    };
  }, []);

  return (
    <div className="h-screen flex">
      <Sidebar
        onlineUsers={onlineUsers}
        setSelectedConversation={setSelectedConversation}
      />

      <ChatWindow selectedConversation={selectedConversation} />
    </div>
  );
}

export default Chat;
