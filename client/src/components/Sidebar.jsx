// Sidebar.jsx
import { useEffect, useState } from "react";

import { searchUsers } from "../services/userService";
import {
  getConversations,
  createConversation,
} from "../services/conversationService";
import { useAuth } from "../context/AuthContext";
import { decryptConversationMessage } from "../hooks/useEncryption";

// Presentational helpers only — no functional impact
const getInitials = (name = "") => name.trim().charAt(0).toUpperCase() || "?";

const AVATAR_COLORS = [
  "from-indigo-500 to-purple-500",
  "from-emerald-500 to-teal-500",
  "from-rose-500 to-pink-500",
  "from-amber-500 to-orange-500",
  "from-sky-500 to-blue-500",
];

const getAvatarColor = (id = "") => {
  const sum = id
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
};

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

const { user } = useAuth();

const currentUserId = user?._id;

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
  if (!user) return;

  const decryptPreviews = async () => {
    const previews = {};

    for (const conversation of conversations) {
      if (!conversation.lastMessage) continue;

      try {
        previews[conversation._id] =
          await decryptConversationMessage(
            conversation.lastMessage,
            user._id
          );
      } catch {
        previews[conversation._id] = "[Encrypted]";
      }
    }

    setLastMessages(previews);
  };

  decryptPreviews();
}, [conversations, user]);

  return (
    <div className="w-80 h-full flex flex-col bg-slate-900 border-r border-slate-800">
      {/* Header */}
      <div className="px-4 pt-5 pb-3">
        <h2 className="text-lg font-bold text-white tracking-tight mb-3">
          Messages
        </h2>

        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search users..."
            value={query}
            onChange={(e) =>
              setQuery(e.target.value)
            }
            className="w-full bg-slate-800 text-slate-100 placeholder-slate-500 text-sm rounded-full pl-9 pr-3 py-2.5 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>

        {/* Search results */}
        {users.length > 0 && (
          <div className="mt-2 bg-slate-800 rounded-lg border border-slate-700 overflow-hidden shadow-lg">
            {users.map((foundUser) => (
              <div
                key={foundUser._id}
                onClick={() =>
                  handleUserClick(foundUser._id)
                }
                className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-slate-700 transition"
              >
                <div
                  className={`w-8 h-8 shrink-0 rounded-full bg-gradient-to-br ${getAvatarColor(
                    foundUser._id
                  )} flex items-center justify-center text-white text-xs font-semibold`}
                >
                  {getInitials(foundUser.username)}
                </div>
                <span className="text-sm text-slate-100 truncate">
                  {foundUser.username}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto px-2 pb-3">
        <p className="px-2 pt-1 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Conversations
        </p>

        {conversations.length === 0 && (
          <p className="px-2 py-6 text-center text-sm text-slate-500 italic">
            No conversations yet — search for someone to start chatting.
          </p>
        )}

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
                className="flex items-center gap-3 px-2 py-2.5 mb-1 rounded-lg cursor-pointer hover:bg-slate-800 transition"
              >
                <div className="relative shrink-0">
                  <div
                    className={`w-11 h-11 rounded-full bg-gradient-to-br ${getAvatarColor(
                      otherUser?._id || ""
                    )} flex items-center justify-center text-white font-semibold`}
                  >
                    {getInitials(otherUser?.username)}
                  </div>
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${
                      isOnline ? "bg-emerald-400" : "bg-slate-600"
                    }`}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-100 truncate text-sm">
                    {otherUser?.username}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {lastMessages[
                      conversation._id
                    ] ||
                      "No messages"}
                  </p>
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default Sidebar;