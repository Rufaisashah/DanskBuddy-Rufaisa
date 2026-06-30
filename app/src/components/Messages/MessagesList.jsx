import { useNavigate, useParams } from "react-router-dom";
import Avatar from "../Shared/Avatar";
import { avatarColor } from "../../utils/avatarColor";

function formatTime(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const diffDays = Math.floor((Date.now() - date.getTime()) / 86400000);
  if (diffDays === 0)
    return date.toLocaleTimeString("da-DK", {
      hour: "2-digit",
      minute: "2-digit",
    });
  if (diffDays === 1) return "I går";
  if (diffDays < 7)
    return date.toLocaleDateString("da-DK", { weekday: "short" });
  return date.toLocaleDateString("da-DK", { day: "numeric", month: "short" });
}

export default function MessagesList({ conversations, currentUserId }) {
  const navigate = useNavigate();
  const { userId } = useParams();

  return (
    <div className="flex flex-col">
      {conversations.map((conv) => {
        const isActive = String(conv.otherUser.id) === String(userId);
        const preview =
          String(conv.lastSenderId) === String(currentUserId)
            ? `Du: ${conv.lastMessage}`
            : conv.lastMessage || "Start en samtale";

        return (
          <div
            key={conv.conversationId}
            onClick={() => navigate(`/messages/${conv.otherUser.id}`)}
            className={`flex items-center gap-3 px-5 py-3.5 cursor-pointer border-b border-surface transition-colors
              ${isActive ? "bg-primary-light" : "hover:bg-surface"}`}
          >
            <Avatar
              initials={conv.otherUser.name
                .split(" ")
                .map((p) => p[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
              online={true}
              size="md"
              color={avatarColor(conv.otherUser.id)}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <p
                  className={`m-0 text-[0.9rem] font-semibold ${isActive ? "text-primary" : "text-foreground"}`}
                >
                  {conv.otherUser.name}
                </p>
                <span className="text-[0.7rem] text-neutral ml-2 shrink-0">
                  {formatTime(conv.lastMessageAt)}
                </span>
              </div>
              <p className="m-0 text-[0.8rem] text-neutral truncate">
                {preview}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
