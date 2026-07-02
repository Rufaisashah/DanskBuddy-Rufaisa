import { useState, useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import MessageBubble from "./MessageBubble";
import Avatar from "../Shared/Avatar";
import { ChevronLeft, Phone, Video } from "lucide-react";
import "./Messages.css";
import { avatarColor } from "../../utils/avatarColor";
import { Mic, Send } from "lucide-react";
import { getInitials } from "../../utils/getInitials";
export default function ChatWindow() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    users,
    sendMessage,
    getConversation,
    markMessagesAsRead,
    buildConversationId,
  } = useApp();

  const { userId } = useParams();
  const [text, setText] = useState("");
  useEffect(() => {
    if (user && userId) {
      markMessagesAsRead(buildConversationId(user.id, userId));
    }
  }, [userId, markMessagesAsRead, buildConversationId]);

  if (!user) return <Navigate to="/login" />;

  const otherUser = users.find((u) => String(u.id) === String(userId));
  if (!otherUser) return <p>User not found</p>;

  const messages = getConversation(user.id, String(userId)) || [];
  const levelLabel = otherUser.danishLevel || "A1";

  const handleSend = () => {
    const message = text.trim();
    if (!message) return;
    sendMessage(user.id, userId, message);
    setText("");
  };

  return (
    <div className="chat-window">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center gap-3 px-5 py-4 bg-white border-b border-surface">
        <button
          type="button"
          className="back-button md:hidden"
          onClick={() => navigate("/messages")}
          aria-label="Go back"
        >
          <ChevronLeft size={24} color="black" />
        </button>

        <Avatar
          initials={getInitials(otherUser.name)}
          online={true}
          size="lg"
          color={avatarColor(otherUser.id)}
        />

        <div className="flex-1">
          <h3
            className="text-[1rem] font-bold text-foreground cursor-pointer hover:text-primary transition-colors m-0"
            onClick={() => navigate(`/profile/${otherUser.id}`)}
          >
            {otherUser.name}
          </h3>
          <div className="flex items-center gap-1 text-[0.78rem] mt-0.5">
            <span className="text-success">Online</span>
            {otherUser.role?.label && (
              <>
                <span className="text-success">·</span>
                <span className="text-success">{otherUser.role.value}</span>
              </>
            )}
            <span className="text-success">·</span>
            <span className="text-success">{levelLabel}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <button
            aria-label="Voice call"
            className="p-2 rounded-full hover:bg-background transition border-none bg-transparent cursor-pointer"
          >
            <Phone size={20} className="text-primary" />
          </button>
          <button
            aria-label="Video call"
            className="p-2 rounded-full hover:bg-background transition border-none bg-transparent cursor-pointer"
          >
            <Video size={20} className="text-primary" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-2 bg-[#F4EFE8]">
        {messages.length === 0 ? (
          <p className="text-center text-neutral text-sm mt-8">
            Ingen beskeder endnu
          </p>
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

      {/* Input */}
      <div className="flex-shrink-0 flex items-center gap-2 px-5 py-3 bg-white border-t border-surface">
        <button className="w-9 h-9 rounded-full border border-surface flex items-center justify-center text-neutral text-lg bg-background cursor-pointer hover:bg-background transition shrink-0">
          +
        </button>
        <input
          className="flex-1 px-5 py-3 rounded-full bg-background border-none outline-none text-sm text-foreground placeholder:text-neutral-light"
          value={text}
          placeholder="Skriv på dansk..."
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <button className="text-neutral hover:text-foreground transition bg-transparent border-none cursor-pointer">
          <Mic size={20} />
        </button>
        <button
          onClick={handleSend}
          className="ml-1 w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-md"
        >
          <Send size={18} className="text-white -rotate-12" />
        </button>
      </div>
    </div>
  );
}
