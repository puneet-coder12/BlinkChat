import { useState } from "react";
import socket from "../socket";
import { sendMessage } from "../services/messageService";
import { encryptForConversation } from "../hooks/useEncryption";
import { useAuth } from "../context/AuthContext";

function MessageInput({ selectedConversation, setMessages }) {
  const { user } = useAuth();
  const [content, setContent] = useState("");

  const handleSend = async () => {
  if (!content.trim() || !selectedConversation) return;

  try {
    const encrypted = await encryptForConversation(
      content,
      selectedConversation,
      user._id
    );

    const message = await sendMessage({
      conversationId: selectedConversation._id,
      ...encrypted,
    });

    // Optimistic update
    setMessages((prev) => [...prev, message]);

    setContent("");
  } catch (error) {
    console.error("Send Message Error:", error);
  }
};

  return (
    <div className="border-t p-4 flex gap-2">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type message..."
        className="border p-2 flex-1"
      />

      <button onClick={handleSend} className="bg-black text-white px-4 rounded">
        Send
      </button>
    </div>
  );
}

export default MessageInput;
