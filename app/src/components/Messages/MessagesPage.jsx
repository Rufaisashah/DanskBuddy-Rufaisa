import { Navigate, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import MessagesList from "./MessagesList";
import { Search } from "lucide-react";
import "./Messages.css";

export default function MessagesPage() {
  const { user } = useAuth();
  const { users, messages } = useApp();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const chatOpen = location.pathname !== "/messages";

  if (!user) return <Navigate to="/login" />;

  // Build conversation list from messages
  const conversations = Object.entries(messages || {})
    .reduce((result, [conversationId, msgs]) => {
      const [id1, id2] = conversationId.split("::");
      const isMine =
        String(id1) === String(user.id) || String(id2) === String(user.id);
      if (!isMine) return result;

      const otherUserId = String(id1) === String(user.id) ? id2 : id1;
      const otherUser = users.find((u) => String(u.id) === String(otherUserId));
      if (!otherUser) return result;

      const lastMsg = msgs[msgs.length - 1];
      result.push({
        conversationId,
        otherUser,
        lastMessage: lastMsg?.text ?? "",
        lastMessageAt: lastMsg?.createdAt ?? "",
        lastSenderId: lastMsg?.senderId ?? "",
      });
      return result;
    }, [])
    .sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));

  // Auto-open the first conversation on desktop
  useEffect(() => {
    function checkAndRedirect() {
      if (!chatOpen && conversations.length > 0 && window.innerWidth >= 768) {
        navigate(`/messages/${conversations[0].otherUser.id}`, {
          replace: true,
        });
      }
    }

    checkAndRedirect();

    window.addEventListener("resize", checkAndRedirect);
    return () => window.removeEventListener("resize", checkAndRedirect);
  }, [chatOpen, conversations.length]);

  const filteredConversations = conversations.filter((c) =>
    c.otherUser.name.toLowerCase().includes(search.toLowerCase())
  );

  // If user has zero conversations at all, show one single empty state
  if (conversations.length === 0) {
    return (
      <div className="flex flex-1 min-h-0 flex-col items-center justify-center bg-background gap-3 text-center px-8">
        <p className="text-5xl">💬</p>
        <h3 className="m-0 text-lg font-bold text-foreground">
          Ingen samtaler endnu
        </h3>
        <p className="m-0 text-sm text-neutral">
          Find en sprogpartner og start din første samtale
        </p>
        <button
          onClick={() => navigate("/browse")}
          className="mt-1 px-6 py-2.5 rounded-full bg-primary text-white text-sm font-semibold border-none cursor-pointer hover:bg-primary-dark transition"
        >
          Find sprogpartner
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden bg-background">
      {/* ── Left panel — conversation list ── */}
      <div
        className={`${chatOpen ? "hidden md:flex" : "flex"} flex-col w-full md:w-[320px] border-r border-surface bg-white shrink-0`}
      >
        <div className="px-6 pt-6 pb-4 border-b border-surface">
          <h2 className="text-2xl font-bold text-foreground mb-4">Beskeder</h2>
          <div className="flex items-center gap-2 h-11 bg-[#F4EFE8] border border-[#ece6dd] rounded-full px-4">
            <Search size={16} className="text-neutral shrink-0" />
            <input
              placeholder="Søg samtaler..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border-none outline-none bg-transparent text-sm text-foreground placeholder:text-neutral-light"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 p-8 text-center">
              <p className="text-4xl">💬</p>
              <p className="text-sm text-neutral">Ingen samtaler endnu</p>
              <button
                onClick={() => navigate("/browse")}
                className="px-5 py-2 rounded-full bg-primary text-white text-sm font-semibold border-none cursor-pointer hover:bg-primary-dark transition"
              >
                Find sprogpartner
              </button>
            </div>
          ) : (
            <MessagesList
              conversations={filteredConversations}
              currentUserId={user.id}
            />
          )}
        </div>
      </div>

      {/* ── Right panel — chat window ── */}
      <div
        className={`${chatOpen ? "flex" : "hidden md:flex"} flex-1 min-h-0 flex-col`}
      >
        {chatOpen ? (
          <Outlet />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-8">
            <p className="text-5xl">💬</p>
            <h3 className="m-0 text-lg font-bold text-foreground">
              Vælg en samtale
            </h3>
            <p className="m-0 text-sm text-neutral">
              eller find en ny sprogpartner
            </p>
            <button
              onClick={() => navigate("/browse")}
              className="mt-1 px-6 py-2.5 rounded-full bg-primary text-white text-sm font-semibold border-none cursor-pointer hover:bg-primary-dark transition"
            >
              Find sprogpartner
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
