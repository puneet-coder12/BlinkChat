import { useEffect, useState } from "react";
import { searchUsers } from "../services/userService";
import { getConversations } from "../services/conversationService";
import { createConversation } from "../services/conversationService";

const Sidebar = ({ setSelectedConversation, onlineUsers }) => {
  const [conversations, setConversations] = useState([]);
  const [query, setQuery] = useState("");

  const [users, setUsers] = useState([]);

  const currentUserId = localStorage.getItem("userId");

  const handleUserClick = async (userId) => {
    try {
      const conversation = await createConversation(userId);

      setSelectedConversation(conversation);

      const data = await getConversations();

      setConversations(data);

      setQuery("");
      setUsers([]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await getConversations();

        setConversations(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!query.trim()) {
        setUsers([]);
        return;
      }

      try {
        const data = await searchUsers(query);

        setUsers(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, [query]);

  return (
    <div className="w-80 border-r p-4">
      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 w-full mb-3"
      />
      <h2 className="font-bold text-xl mb-4">Chats</h2>

      {users.map((user) => (
        <div
          key={user._id}
          onClick={() => handleUserClick(user._id)}
          className="border p-2 mb-2 rounded cursor-pointer"
        >
          {user.username}
        </div>
      ))}

      {conversations.map((conversation) => {
        const otherUser = conversation.participants.find(
          (user) => user._id !== currentUserId,
        );

        const isOnline = onlineUsers.includes(otherUser?._id);

        return (
          <div
            key={conversation._id}
            onClick={() => setSelectedConversation(conversation)}
            className="border p-3 mb-2 rounded cursor-pointer"
          >
            <div>
              <p className="font-semibold">
                {isOnline ? "🟢" : "⚫"} {otherUser?.username}
              </p>

              <p className="text-sm text-gray-500 truncate">
                {conversation.lastMessage?.content || "No messages"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Sidebar;
