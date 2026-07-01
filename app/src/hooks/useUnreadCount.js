import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";

export function useUnreadCount() {
  const { user } = useAuth();
  const { messages, messageReadTimestamps } = useApp();

  if (!user) return 0;

  

  return Object.keys(messages).filter((convId) => {
    const [id1, id2] = convId.split("::");
    const isMine = String(id1) === String(user.id) || String(id2) === String(user.id);
    if (!isMine) return false;
    const convMessages = messages[convId];
    const lastMessage = convMessages[convMessages.length - 1];
    if (!lastMessage) return false;
    if (String(lastMessage.senderId) === String(user.id)) return false;
    const lastRead = messageReadTimestamps?.[convId] || 0;

    return new Date(lastMessage.createdAt).getTime() > lastRead;
  }).length;
  
}
