import { useEffect, useRef } from "react";

function MessageList({ messages }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {messages.map((message) => {
        const isMe = message.senderId._id === localStorage.getItem("userId");

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
              <div>
                <p>{message.content}</p>

                <p className="text-xs mt-1 opacity-70 text-right">
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        );
      })}

      <div ref={messagesEndRef}></div>
    </div>
  );
}

export default MessageList;
