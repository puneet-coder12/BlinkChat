import { useState } from "react";
import socket from "../socket";
import { sendMessage } from "../services/messageService";
import { encryptForConversation } from "../hooks/useEncryption";

function MessageInput({
  selectedConversation,
  setMessages,
}) {
  const [content, setContent] =
    useState("");

  const handleSend = async () => {
    // console.log("Selected Conversation:", selectedConversation);
    if (
      !content.trim() ||
      !selectedConversation
    )
      return;

    try {
      // Encrypt using our hook
      const encrypted =
        await encryptForConversation(
          content,
          selectedConversation
        );

      // Save to backend
      const message =
        await sendMessage({
          conversationId:
            selectedConversation._id,

          ...encrypted,
        });

      // Realtime
      socket.emit(
        "send_message",
        message
      );

      // Add locally
      setMessages((prev) => [
        ...prev,
        message,
      ]);

      setContent("");
    } catch (error) {
      console.error(
        "Send Message Error:",
        error
      );
    }
  };

  return (
    <div className="border-t p-4 flex gap-2">
      <input
        type="text"
        value={content}
        onChange={(e) =>
          setContent(e.target.value)
        }
        placeholder="Type message..."
        className="border p-2 flex-1"
      />

      <button
        onClick={handleSend}
        className="bg-black text-white px-4 rounded"
      >
        Send
      </button>
    </div>
  );
}

export default MessageInput;