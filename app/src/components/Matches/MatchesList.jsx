import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import MatchCard from "./MatchCard";

export default function MatchesList() {
  const { getMatchesForUser } = useApp();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("pending");
  const allMatches = getMatchesForUser(user.id);
  const pending = allMatches.filter(
    (m) => m.status === "pending" && m.receiverId === user.id
  );
  const sent = allMatches.filter(
    (m) => m.status === "pending" && m.requesterId === user.id
  );
  const connected = allMatches.filter((m) => m.status === "accepted");
  const declined = allMatches.filter(
    (m) => m.status === "declined" && m.requesterId === user.id
  );

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Matches</h1>
      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
            activeTab === "pending"
              ? "border-indigo-500 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Pending ({pending.length})
        </button>
        <button
          onClick={() => setActiveTab("sent")}
          className={`px-5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
            activeTab === "sent"
              ? "border-indigo-500 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Sent ({sent.length})
        </button>
        <button
          onClick={() => setActiveTab("declined")}
          className={`px-5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${activeTab === "declined" ? "border-red-500 text-red-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          Declined ({declined.length})
        </button>

        <button
          onClick={() => setActiveTab("connected")}
          className={`px-5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
            activeTab === "connected"
              ? "border-indigo-500 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Connected ({connected.length})
        </button>
      </div>

      {/* Pending tab */}
      {activeTab === "pending" && (
        <div>
          {pending.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg">🕐 No pending requests right now.</p>
              <p className="text-sm mt-1">
                When someone sends you a request, it will show here.
              </p>
            </div>
          ) : (
            pending.map((m) => (
              <MatchCard key={m.id} match={m} context="pending" />
            ))
          )}
        </div>
      )}
      {activeTab === "sent" && (
        <div>
          {sent.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg">📤 No sent requests yet.</p>
              <p className="text-sm mt-1">
                Browse people and click Connect to send a request.
              </p>
            </div>
          ) : (
            sent.map((m) => <MatchCard key={m.id} match={m} context="sent" />)
          )}
        </div>
      )}

      {activeTab === "connected" && (
        <div>
          {connected.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg">💬 No connections yet.</p>
              <p className="text-sm mt-1">
                Accept a request or browse people to connect.
              </p>
            </div>
          ) : (
            connected.map((m) => (
              <MatchCard key={m.id} match={m} context="connected" />
            ))
          )}
        </div>
      )}
      {/* ── Declined tab ── */}
      {activeTab === "declined" && (
        <div>
          {declined.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-2xl mb-2">✅</p>
              <p className="text-lg font-medium">No declined requests</p>
              <p className="text-sm mt-1">
                If someone declines your connect request, it will show here.
              </p>
            </div>
          ) : (
            declined.map((m) => (
              <MatchCard key={m.id} match={m} context="declined-by-them" />
            ))
          )}
        </div>
      )}
    </div>
  );
}
