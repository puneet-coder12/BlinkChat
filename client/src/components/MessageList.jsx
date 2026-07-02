import { useEffect, useRef, useState } from "react";

import { decryptConversationMessage } from "../hooks/useEncryption";
import { useAuth } from "../context/AuthContext";
function MessageList({ messages }) {
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  const [decryptedMessages, setDecryptedMessages] = useState({});

  useEffect(() => {
    const decryptAllMessages = async () => {
      const decrypted = {};

      for (const message of messages) {
        try {
          const text = await decryptConversationMessage(message, user._id);

          decrypted[message._id] = text;
        } catch (error) {
          console.error("Failed to decrypt message:", error);

          decrypted[message._id] = "[Unable to decrypt]";
        }
      }

      setDecryptedMessages(decrypted);
    };

    decryptAllMessages();
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {messages.map((message) => {
        const senderId =
          typeof message.senderId === "string"
            ? message.senderId
            : message.senderId._id;

        const isMe = senderId === user?._id;

        return (
          <div
            key={message._id}
            className={`flex mb-2 ${isMe ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-xs ${
                isMe ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              <p>{decryptedMessages[message._id] || "Decrypting..."}</p>

              <p className="text-xs mt-1 opacity-70 text-right">
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        );
      })}

      <div ref={messagesEndRef}></div>
    </div>
  );
}

export default MessageList;
