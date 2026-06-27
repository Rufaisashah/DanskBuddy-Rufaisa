import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function MatchCard({ match, context }) {
  const { respondToMatch, getUserById } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [toast, setToast] = useState("");
  const [status, setStatus] = useState(match.status);
  const isReceiver = match.receiverId === user.id;
  const otherUserId = isReceiver ? match.requesterId : match.receiverId;
  const otherUser = getUserById(otherUserId);
  if (!otherUser) return null;
  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(""), 2000);
  }
  function handleAccept() {
    respondToMatch(match.id, "accepted");
    setStatus("accepted");
    showToast("✅ Connected!");
  }
  function handleDecline() {
    respondToMatch(match.id, "declined");
    setStatus("declined");
    showToast("❌ Declined");
  }
  function handleMessage() {
    navigate(`/messages/${otherUser.id}`);
  }
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-green-100  text-green-800",
    declined: "bg-red-100    text-red-800",
  };
  return (
    <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 mb-3 shadow-sm relative">
      {/* Toast */}
      {toast && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-4 py-1 rounded-full whitespace-nowrap">
          {toast}
        </div>
      )}

      {/* Avatar */}
      <div className="text-4xl min-w-[56px] text-center">
        {otherUser.avatar}
      </div>

      {/* Info */}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{otherUser.name}</h3>
        <p className="text-sm text-gray-500">
          {otherUser.city} · {otherUser.danishLevel}
        </p>
        <p className="text-sm text-gray-400 mt-1">{otherUser.bio}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-end gap-2">
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[status]}`}
        >
          {status === "accepted" && "Connected "}
          {status === "declined" &&
            (isReceiver ? "You declined" : "Declined by Receiver")}
          {status === "pending" && context === "pending" && "Wants to connect"}
          {status === "pending" && context === "sent" && "Awaiting reply"}
        </span>

        {isReceiver && status === "pending" && context === "pending" && (
          <div className="flex gap-2">
            <button
              onClick={handleAccept}
              className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm px-3 py-1.5 rounded-md"
            >
              Accept
            </button>
            <button
              onClick={handleDecline}
              className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1.5 rounded-md"
            >
              Decline
            </button>
          </div>
        )}

        {match.status === "accepted" && (
          <button
            onClick={handleMessage}
            className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm px-3 py-1.5 rounded-md"
          >
            Send Message
          </button>
        )}
      </div>
    </div>
  );
}
