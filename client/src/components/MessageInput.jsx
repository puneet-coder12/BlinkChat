import { useState } from "react";
import socket from "../socket";
import { sendMessage } from "../services/messageService";
import { generateAESKey, generateIV, encryptMessage } from "../utils/aes";

import { encryptAESKey } from "../utils/crypto";

function MessageInput({ selectedConversation, setMessages }) {
  const [content, setContent] = useState("");
  console.log(selectedConversation);

  const handleSend = async () => {
    if (!content.trim()) return;
    //     console.log("Current User:", localStorage.getItem("userId"));
    // console.log("Participants:", selectedConversation.participants);
    const receiver = selectedConversation.participants.find(
      (user) => user._id !== localStorage.getItem("userId"),
    );
    const aesKey = generateAESKey();

    const iv = generateIV();
    const encryptedContent = encryptMessage(content, aesKey, iv);

    const sender = selectedConversation.participants.find(
      (user) => user._id === localStorage.getItem("userId"),
    );

    const senderEncryptedKey = encryptAESKey(aesKey, sender.publicKey);
    const receiverEncryptedKey = encryptAESKey(aesKey, receiver.publicKey);
    // console.log("Sender:", sender);
    // console.log("Receiver:", receiver);
    try {
      const message = await sendMessage({
        conversationId: selectedConversation._id,
        encryptedContent,
        encryptedKeys: {
          sender: senderEncryptedKey,
          receiver: receiverEncryptedKey,
        },
        iv,
      });

      socket.emit("send_message", message);

      setMessages((prev) => [...prev, message]);

      setContent("");
    } catch (error) {
      console.log(error);
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

      <button onClick={handleSend} className="bg-black text-white px-4">
        Send
      </button>
    </div>
  );
}

export default MessageInput;
