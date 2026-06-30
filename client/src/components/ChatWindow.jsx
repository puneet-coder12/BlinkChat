import { useEffect, useState } from "react";
import socket from "../socket";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

import { getMessages } from "../services/messageService";

function ChatWindow({
  selectedConversation,
  conversations,
  setConversations,
}) {
  const [messages, setMessages] = useState([]);

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
    setMessages((prev) => [...prev, message]);

    setConversations((prev) =>
      prev.map((conversation) => {
        if (
          conversation._id !==
          message.conversationId
        ) {
          return conversation;
        }

        return {
          ...conversation,
          lastMessage: message,
          updatedAt: message.createdAt,
        };
      })
    );
  };

  socket.on(
    "receive_message",
    handleReceiveMessage
  );

  return () => {
    socket.off(
      "receive_message",
      handleReceiveMessage
    );
  };
}, [setConversations]);

  if (!selectedConversation) {
    return (
      <div className="flex-1 flex items-center justify-center">
        Select a chat
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <MessageList messages={messages} />

      <MessageInput
  selectedConversation={selectedConversation}
  setMessages={setMessages}
  conversations={conversations}
  setConversations={setConversations}
/>
    </div>
  );
}

export default ChatWindow;
