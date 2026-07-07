// ChatWindow.jsx
import { useEffect, useState } from "react";
import socket from "../socket";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useAuth } from "../context/AuthContext";

import { getMessages } from "../services/messageService";

// Presentational helper only — no functional impact
const getInitials = (name = "") => name.trim().charAt(0).toUpperCase() || "?";

function ChatWindow({ selectedConversation, conversations, setConversations }) {
  const [messages, setMessages] = useState([]);
  const { user } = useAuth();
  const currentUserId = user?._id;

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation) return;

      try {
        socket.emit("join_conversation", selectedConversation._id);

        const data = await getMessages(selectedConversation._id);

        setMessages(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMessages();
  }, [selectedConversation]);

  useEffect(() => {
    const handleReceiveMessage = (message) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === message._id)) {
          return prev;
        }

        return [...prev, message];
      });

      setConversations((prev) =>
        prev.map((conversation) => {
          if (conversation._id !== message.conversationId) {
            return conversation;
          }

          return {
            ...conversation,
            lastMessage: message,
            updatedAt: message.createdAt,
          };
        }),
      );
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [setConversations]);

  if (!selectedConversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-2 bg-slate-50 text-slate-400">
        <svg
          className="w-12 h-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8-1.06 0-2.077-.163-3.02-.465L3 21l1.5-4.5C3.55 15.163 3 13.66 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <p className="text-sm font-medium">Select a chat to start messaging</p>
      </div>
    );
  }

  const otherUser = selectedConversation.participants?.find(
    (p) => p._id !== currentUserId,
  );

  return (
    <div className="flex-1 flex flex-col bg-white h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-200 bg-white">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold shrink-0">
          {getInitials(otherUser?.username)}
        </div>
        <p className="font-semibold text-slate-800 text-sm truncate">
          {otherUser?.username || "Conversation"}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-slate-50 px-4 py-3">
        <MessageList messages={messages} />
      </div>

      {/* Composer */}
      <div className="border-t border-slate-200 bg-white p-3">
        <MessageInput
          selectedConversation={selectedConversation}
          setMessages={setMessages}
          conversations={conversations}
          setConversations={setConversations}
        />
      </div>
    </div>
  );
}

export default ChatWindow;
