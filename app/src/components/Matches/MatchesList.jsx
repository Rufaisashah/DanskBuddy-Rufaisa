import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import MatchCard from "./MatchCard";
import EmptyMatchState from "./EmptyMatchState";

export default function MatchesList() {
  const { getMatchesForUser } = useApp();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("requests");
  const [toast, setToast] = useState("");

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(""), 2000);
  }

  const allMatches = getMatchesForUser(user.id);

  const received = allMatches.filter(
    (m) => m.status === "pending" && m.receiverId === user.id
  );
  const sent = allMatches.filter(
    (m) => m.status === "pending" && m.requesterId === user.id
  );
  const requests = [...received, ...sent];

  const connected = allMatches.filter((m) => m.status === "accepted");
  const declined = allMatches.filter((m) => m.status === "declined");

  const tabs = [
    { id: "requests", label: "Requests", count: requests.length },
    { id: "declined", label: "Declined", count: declined.length },
    { id: "connected", label: "Connected", count: connected.length },
  ];

  const activeMatches =
    activeTab === "requests"
      ? requests
      : activeTab === "declined"
        ? declined
        : connected;

  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* --- HEADER SECTION: Always White, Full Width --- */}
      <div className="w-full border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 pt-6 sm:px-10 sm:pt-10 relative">
          
          {toast && (
            <div className="fixed left-1/2 top-6 z-[100] flex -translate-x-1/2 items-center gap-[8px] rounded-full bg-[#2B2A28] px-[20px] py-[10px] text-[13px] font-semibold text-white shadow-[0_12px_24px_-8px_rgba(43,42,40,0.5)]">
              <span className="flex h-[18px] w-[18px] flex-none items-center justify-center rounded-full bg-[#34C77B]">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m5 12 5 5 9-11" />
                </svg>
              </span>
              {toast}
            </div>
          )}

          <h1 className="mb-6 text-3xl font-bold text-gray-900">My Matches</h1>
          
          <div>
            {/* Mobile: pill-style tab switcher */}
            <div className="mb-6 flex rounded-[12px] bg-[#F1ECE3] p-[3px] sm:hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-sm transition-colors ${
                    activeTab === tab.id
                      ? "bg-white font-bold text-gray-900 shadow-sm"
                      : "font-medium text-gray-500"
                  }`}
                >
                  {tab.label}
                  <span className={activeTab === tab.id ? "text-[#E63946]" : "text-gray-400"}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Desktop: underline-style tabs */}
            <div className="hidden gap-2 overflow-x-auto pr-4 sm:flex [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 border-b-[3px] px-5 py-2.5 text-[15px] transition-colors -mb-[1px] ${
                    activeTab === tab.id
                      ? "border-[#E63946] font-bold text-[#E63946]"
                      : "border-transparent font-medium text-gray-500 hover:border-gray-200 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-xs ${
                      activeTab === tab.id
                        ? "bg-[#E63946]/10 text-[#E63946]"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- CONTENT SECTION: White on Mobile, Beige on Desktop, Full Width --- */}
      <div className="w-full flex-1 bg-white sm:bg-[#F4EFE8]">
        <div className="mx-auto max-w-5xl px-6 py-6 sm:px-10 sm:py-10">
          {activeMatches.length === 0 ? (
            <div className="flex justify-center">
              <EmptyMatchState
                type={activeTab}
                onCtaClick={() => navigate("/browse")}
              />
            </div>
          ) : (
            <div className="grid max-w-4xl grid-cols-1 items-start gap-5 sm:grid-cols-2 lg:grid-cols-2">
              {activeMatches.map((m) => (
                <MatchCard key={m.id} match={m} onAction={showToast} />
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}