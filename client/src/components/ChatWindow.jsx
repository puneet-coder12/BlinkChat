import { useEffect, useState } from "react";
import socket from "../socket";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

import { getMessages } from "../services/messageService";

function ChatWindow({ selectedConversation }) {
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
  socket.on(
    "receive_message",
    (message) => {
      setMessages((prev) => [
        ...prev,
        message,
      ]);
    }
  );

  return () => {
    socket.off("receive_message");
  };
}, []);

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
      />
    </div>
  );
}

export default ChatWindow;
