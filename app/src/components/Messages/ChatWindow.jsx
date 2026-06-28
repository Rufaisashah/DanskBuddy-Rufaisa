
import { useState,useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import MessageBubble from "./MessageBubble";
import Chip from "../Shared/Chip";
import LevelBadge from "../Shared/LevelBadge";
import Avatar from "../Shared/Avatar";
import "./Messages.css";
import { Phone, Video } from "lucide-react";

export default function ChatWindow() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { users, sendMessage, getConversation, markAsRead,buildConversationId } = useApp();

  const { userId } = useParams();

  const [text, setText] = useState("");
  useEffect(() => {
    if (user && userId) {
      markAsRead(buildConversationId(user.id, userId));
    }
  }, [userId]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  

  const otherUser = users.find((u) => String(u.id) === String(userId));

  if (!otherUser) {
    return <p>User not found</p>;
  }

  const displayLevel =
    otherUser.danishLevel === "beginner"
      ? "A1"
      : otherUser.danishLevel === "intermediate"
        ? "B1"
        : otherUser.danishLevel === "advanced"
          ? "C1"
          : "native";
  const messages = getConversation(user.id, userId);

  const handleSend = () => {
    const message = text.trim();

    if (!message) return;

    sendMessage(user.id, userId, message);

    setText("");
  };





  return (
    <div className="fixed top-16 bottom-0 left-0 right-0 md:left-0 flex flex-col bg-slate-100 overflow-hidden">
      <div className="flex-shrink-0 flex items-center gap-3 px-5 py-4 bg-white border-b border-gray-200">
        <button className="back-button" onClick={() => navigate("/messages")}>
          ←
        </button>

        <Avatar initials={otherUser.name.charAt(0)} online={true} size="lg" />
        <div className="chat-user-info">
          <div className="chat-name-row">
            <h3 className="text-lg font-bold text-gray-900">
              {otherUser.name}
            </h3>
          </div>

          <div className="chat-meta">
            <Chip variant="subtle">Online</Chip>

            <span>·</span>

            <Chip variant="subtle">{otherUser.role}</Chip>

            <span>·</span>

            <LevelBadge level={displayLevel} />
          </div>
        </div>
        <div className="chat-actions">
          <button title="Voice call">
            <Phone size={20} />
          </button>

          <button title="Video call">
            <Video size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 bg-[#f5f3ef]">
        {messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isMine={String(message.senderId) === String(user.id)}
            />
          ))
        )}
      </div>

      <div className="flex-shrink-0 flex items-center gap-2 p-4 bg-white border-t border-gray-200">
        <input
          className="flex-1 px-4 py-3 rounded-full bg-gray-100 border-none focus:outline-none focus:ring-2 focus:ring-red-300"
          value={text}
          placeholder={`Message ${otherUser.name}`}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
        />
        <button
          className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition"
          onClick={handleSend}
          aria-label="send"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
