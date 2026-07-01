import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function MatchCard({ match, onAction }) {

  const { respondToMatch, getUserById } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState(match.status);

  const isReceiver = match.receiverId === user.id;
  const otherUserId = isReceiver ? match.requesterId : match.receiverId;
  const otherUser = getUserById(otherUserId);

  if (!otherUser) return null;

  function handleAccept(e) {
    e.stopPropagation();
    respondToMatch(match.id, "accepted");
    setStatus("accepted");
    onAction("✅ Connected!");
  }

  function handleDecline(e) {
    e.stopPropagation();
    respondToMatch(match.id, "declined");
    setStatus("declined");
    onAction("❌ Declined");
  }

  function handleMessage(e) {
    e.stopPropagation();
    navigate(`/messages/${otherUser.id}`);
  }

  function handleCardClick() {
    navigate(`/profile/${otherUser.id}`);
  }

  return (
    <div
      onClick={handleCardClick}
      className="relative bg-white border border-gray-200 rounded-md p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow flex flex-col h-full"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#E63946] text-white flex items-center justify-center font-bold">
            {otherUser.avatar || otherUser.name?.[0]}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{otherUser.name}</h3>
            <p className="text-xs text-gray-400">
              {otherUser.city} · {otherUser.danishLevel}
            </p>
          </div>
        </div>

        {status === "pending" && (
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              isReceiver
                ? "bg-[#E63946]/10 text-[#E63946]"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {isReceiver ? "Received" : "Sent"}
          </span>
        )}
      </div>

      <p className="text-sm text-gray-500 mb-3 flex-1">{otherUser.bio}</p>

      {status === "declined" && (
        <p className="text-xs text-gray-400 mb-2">
          {isReceiver
            ? "You declined this request"
            : `${otherUser.name} declined your request`}
        </p>
      )}

      {status === "pending" && isReceiver && (
        <div className="flex gap-2">
          <button
            onClick={handleAccept}
            className="flex-1 bg-[#E63946] hover:bg-[#d62d3a] text-white text-sm font-medium px-3 py-2 rounded-full"
          >
            ✓ Accept
          </button>
          <button
            onClick={handleDecline}
            className="flex-1 border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium px-3 py-2 rounded-full"
          >
            Decline
          </button>
        </div>
      )}

      {status === "pending" && !isReceiver && (
        <div className="flex gap-2 items-center">
          <span className="bg-amber-50 text-amber-700 text-sm font-medium px-3 py-1.5 rounded-full">
            ⏱ Waiting for reply
          </span>
          <button
            onClick={handleDecline}
            className="border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium px-3 py-1.5 rounded-full"
          >
            Withdraw
          </button>
        </div>
      )}

      {status === "accepted" && (
        <button
          onClick={handleMessage}
          className="self-start bg-[#E63946] hover:bg-[#d62d3a] text-white text-sm font-medium px-4 py-2 rounded-full mt-auto"
        >
          Send Message
        </button>
      )}
    </div>
  );
}