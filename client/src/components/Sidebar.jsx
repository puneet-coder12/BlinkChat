import { useEffect, useState } from "react";

import { searchUsers } from "../services/userService";
import {
  getConversations,
  createConversation,
} from "../services/conversationService";

import { decryptConversationMessage } from "../hooks/useEncryption";

const Sidebar = ({
  conversations,
  setConversations,
  setSelectedConversation,
  onlineUsers,
}) => {

  const [query, setQuery] = useState("");

  const [users, setUsers] = useState([]);

  const [lastMessages, setLastMessages] =
    useState({});

  const currentUserId =
    localStorage.getItem("userId");

  const handleUserClick = async (
    userId
  ) => {
    try {
      const conversation =
        await createConversation(userId);

      const data =
        await getConversations();

      setConversations(data);

      const selected = data.find(
        (c) =>
          c._id === conversation._id
      );

      setSelectedConversation(
        selected
      );

      setQuery("");
      setUsers([]);
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   const fetchConversations =
  //     async () => {
  //       try {
  //         const data =
  //           await getConversations();

  //         setConversations(data);
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     };

  //   fetchConversations();
  // }, []);

  useEffect(() => {
    const fetchUsers =
      async () => {
        if (!query.trim()) {
          setUsers([]);
          return;
        }

        try {
          const data =
            await searchUsers(query);

          setUsers(data);
        } catch (error) {
          console.log(error);
        }
      };

    fetchUsers();
  }, [query]);

  // Decrypt last message preview
  useEffect(() => {
    const decryptPreviews =
      async () => {
        const previews = {};

        for (const conversation of conversations) {
          // console.log(conversation.lastMessage);
          if (
            !conversation.lastMessage
          )
            continue;

          try {
            previews[
              conversation._id
            ] =
              await decryptConversationMessage(
                conversation.lastMessage
              );
          } catch (error) {
            previews[
              conversation._id
            ] = "[Encrypted]";
          }
        }

        setLastMessages(previews);
      };

    decryptPreviews();
  }, [conversations]);

  return (
    <div className="w-80 border-r p-4">
      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={(e) =>
          setQuery(e.target.value)
        }
        className="border p-2 w-full mb-3"
      />

      <h2 className="font-bold text-xl mb-4">
        Chats
      </h2>

      {users.map((user) => (
        <div
          key={user._id}
          onClick={() =>
            handleUserClick(user._id)
          }
          className="border p-2 mb-2 rounded cursor-pointer"
        >
          {user.username}
        </div>
      ))}

      {conversations.map(
        (conversation) => {
          const otherUser =
            conversation.participants.find(
              (user) =>
                user._id !==
                currentUserId
            );

          const isOnline =
            onlineUsers.includes(
              otherUser?._id
            );

          return (
            <div
              key={conversation._id}
              onClick={() =>
                setSelectedConversation(
                  conversation
                )
              }
              className="border p-3 mb-2 rounded cursor-pointer hover:bg-gray-100 transition"
            >
              <p className="font-semibold">
                {isOnline
                  ? "🟢"
                  : "⚫"}{" "}
                {
                  otherUser?.username
                }
              </p>

              <p className="text-sm text-gray-500 truncate">
                {lastMessages[
                  conversation._id
                ] ||
                  "No messages"}
              </p>
            </div>
          );
        }
      )}
    </div>
  );
};

export default Sidebar;