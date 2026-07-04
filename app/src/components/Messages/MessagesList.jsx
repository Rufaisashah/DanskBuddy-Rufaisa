import { useNavigate, useParams } from "react-router-dom";
import Avatar from "../Shared/Avatar";
import { avatarColor } from "../../utils/avatarColor";
import { formatMessageTime } from "../../utils/formatMessageTime";
import { getInitials } from "../../utils/getInitials";
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
            className={`
  flex items-center gap-3 px-4 py-3 cursor-pointer transition-all
  ${isActive ? "bg-[#FDEAEC] rounded-2xl mx-3 my-2" : "rounded-2xl mx-3 my-2"}
`}
          >
            <Avatar
              initials={getInitials(conv.otherUser.name)}
              image={conv.otherUser.avatar}
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
                  {formatMessageTime(conv.lastMessageAt)}
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
