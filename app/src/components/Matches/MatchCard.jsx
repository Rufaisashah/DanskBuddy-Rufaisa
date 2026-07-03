import { useState } from "react";
import ReconnectDialog from "./ReconnectDialog";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { colorFor, initials } from "../../utils/matchCardHelpers";
import { XIcon, ArrowRightIcon, ArrowLeftIcon } from "./icons";

export default function MatchCard({ match, onAction }) {
  const { respondToMatch, getUserById } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState(match.status);
  const [showReconnectModal, setShowReconnectModal] = useState(false);

  const isReceiver = match.receiverId === user.id;
  const otherUserId = isReceiver ? match.requesterId : match.receiverId;
  const otherUser = getUserById(otherUserId);

  if (!otherUser) return null;

  function handleAccept(e) {
    e.stopPropagation();
    respondToMatch(match.id, "accepted");
    setStatus("accepted");
    onAction(`You're now connected with ${otherUser.name}`);
  }

  function handleDecline(e) {
    e.stopPropagation();
    respondToMatch(match.id, "declined");
    setStatus("declined");
    onAction(`You declined ${otherUser.name}'s request`);
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
          <div
            className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold"
            style={{ backgroundColor: colorFor(otherUser.id) }}
          >
            {initials(otherUser.name)}
          </div>
          <div>
            <h3 className="flex items-center gap-2 font-semibold text-gray-900">
              {otherUser.name}
              {status === "accepted" && (
                <span
                  className="rounded-md px-2 py-0.5 text-[11px] font-extrabold"
                  style={{ background: "#FAD2D5", color: "#B0202C" }}
                >
                  {otherUser.danishLevel}
                </span>
              )}
            </h3>
            <p className="text-xs text-gray-400">
              {otherUser.city} · {otherUser.danishLevel}
            </p>
          </div>
        </div>

        {status === "pending" && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
              isReceiver
                ? "bg-[#E63946]/10 text-[#E63946]"
                : "bg-[#F1ECE3] text-[#8A8175]"
            }`}
          >
            {isReceiver ? <ArrowRightIcon /> : <ArrowLeftIcon />}
            {isReceiver ? "Received" : "Sent"}
          </span>
        )}
      </div>

      <p className="text-sm text-gray-500 mb-3 flex-1">{otherUser.bio}</p>

      {status === "declined" && (
        <div className="mt-auto flex flex-col items-start gap-[9px] pt-[13px]">
          <span
            className="inline-flex items-center gap-[6px] rounded-[10px] border px-[12px] py-[7px] text-[12.5px] font-extrabold"
            style={
              isReceiver
                ? {
                    background: "#F1ECE3",
                    borderColor: "#E4DCCF",
                    color: "#8A8175",
                  }
                : {
                    background: "#FBF1DE",
                    borderColor: "#F0DEB4",
                    color: "#C97F35",
                  }
            }
          >
            <XIcon color={isReceiver ? "#8A8175" : "#C97F35"} />
            {isReceiver ? "You declined" : `${otherUser.name} declined`}
          </span>

          {isReceiver && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowReconnectModal(true);
              }}
              className="rounded-[10px] border-[1.5px] border-[#F4C9CD] bg-[#FDEAEC] px-[13px] py-[7px] text-[13px] font-extrabold text-[#D62F3C]"
            >
              Send request again
            </button>
          )}
        </div>
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
        <div className="mt-auto flex items-center gap-2 pt-3">
          <span className="text-[12.5px] font-semibold text-[#2E9C6A]">
            Active now
          </span>

          <button
            onClick={handleMessage}
            className="ml-auto flex items-center gap-1.5 rounded-lg bg-[#E63946] px-4 py-2 text-sm font-bold text-white"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 5H4a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v3l4-3h9a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1Z" />
            </svg>
            Message
          </button>
        </div>
      )}
      {showReconnectModal && (
        <ReconnectDialog
          name={otherUser.name}
          onCancel={(e) => {
            e?.stopPropagation?.();
            setShowReconnectModal(false);
          }}
          onConfirm={(e) => {
            e?.stopPropagation?.();
            respondToMatch(match.id, "pending", {
              requesterId: user.id,
              receiverId: otherUser.id,
            });
            setStatus("declined_resent");
            setShowReconnectModal(false);
            onAction(`Request sent again to ${otherUser.name}`);
          }}
        />
      )}
    </div>
  );
}
