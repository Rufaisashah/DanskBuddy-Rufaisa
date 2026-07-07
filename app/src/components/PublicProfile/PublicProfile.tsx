import { Link, useParams, useNavigate } from "react-router-dom";

import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../Shared/Avatar";
import EmptyState from "../Shared/EmptyState";
import type { Match, SendMatchResult, User } from "../../types/types";
import {
  findMatchBetweenUsers,
  getConnectButtonLabel,
} from "../../utils/matchUtils";

type AppContextValue = {
  users: User[];
  matches: Match[];
  sendMatchRequest: (
    requesterId: string,
    receiverId: string
  ) => SendMatchResult;
};

type AuthContextValue = {
  user: User | null;
};

function getRoleLabel(role: User["role"]) {
  if (!role) return "Not added yet";
  return role.value === "native" ? "Native speaker" : "Learner";
}

function getLevelBadgeClass(level: string | undefined) {
  if (level === "native" || !level)
    return "bg-rose-50 text-[#EA4C61] border border-rose-100";
  if (level === "advanced") return "bg-primary-pale text-primary-dark";
  if (level === "intermediate") return "bg-primary-light text-primary";
  return "bg-secondary-light text-secondary-dark";
}

function toList(items?: string[] | string) {
  return Array.isArray(items) ? items : items ? [items] : [];
}

function ProfileListSection({
  title,
  items,
  emptyMessage,
}: {
  title: string;
  items?: string[] | string;
  emptyMessage: string;
}) {
  const listItems = toList(items);
  const isGoals = title.toLowerCase().includes("goals");

  return (
    <section className="rounded-3xl border border-[#ECE7E2] bg-white p-6 w-full shadow-sm">
      <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-400">
        {title}
      </h2>

      {listItems.length > 0 ? (
        <div className="mt-4">
          {isGoals ? (
            <ul className="flex flex-col gap-3">
              {listItems.map((item, index) => (
                <li
                  key={`${item}-${index}`}
                  className="flex items-start gap-2.5 text-xs font-bold text-neutral-800 leading-snug"
                >
                  <span className="flex items-center justify-center w-4 h-4 rounded-full bg-rose-50 text-[#EA4C61] text-[10px] shrink-0 mt-0.5 border border-rose-100">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {listItems.map((item, index) => (
                <li
                  key={`${item}-${index}`}
                  className="rounded-xl bg-[#FAF6F0] px-3 py-1.5 text-xs font-bold text-neutral-700 border border-[#ECE7E2]/40"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <p className="mt-3 text-xs font-semibold text-neutral-400">
          {emptyMessage}
        </p>
      )}
    </section>
  );
}
function PublicProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { users, matches, sendMatchRequest } = useApp() as AppContextValue;
  const { user: currentUser } = useAuth() as AuthContextValue;
  const profileUser = users.find((user) => user.id === id);

  if (!profileUser) {
    return (
      <main>
        <EmptyState
          title="User not found"
          message="This profile does not exist or may have been removed."
        />
      </main>
    );
  }

  const isOwnProfile = currentUser?.id === profileUser.id;

  const existingMatch = currentUser
    ? findMatchBetweenUsers(matches, currentUser.id, profileUser.id)
    : undefined;

  const connectButtonLabel = getConnectButtonLabel(existingMatch);

  const isConnectDisabled =
    isOwnProfile ||
    existingMatch?.status === "pending" ||
    existingMatch?.status === "accepted";

  function handleConnect() {
    if (!currentUser || !profileUser) return;
    sendMatchRequest(currentUser.id, profileUser.id);
  }

  return (
    <main className="min-h-screen bg-white md:bg-[#FAF6F0] px-4 py-6 font-sans md:px-6 lg:px-8 -m-6 md:-m-8 antialiased">
      <div className="mx-auto w-full max-w-[1140px]">
        <div className="mb-5">
          <Link
            to="/browse"
            className="inline-flex items-center rounded-2xl bg-white border border-[#ECE7E2] px-5 py-2.5 text-xs font-extrabold text-neutral-600 shadow-sm hover:bg-neutral-50 transition-colors"
          >
            ‹ Back to Browse
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start w-full">
          <div className="flex flex-col gap-6 min-w-0 w-full">
            <section className="overflow-hidden rounded-[32px] border border-[#ECE7E2] bg-white shadow-sm">
              <div className="h-40 md:h-44 bg-gradient-to-r from-[#EA4C61] via-[#F05B63] to-[#F7A15A]" />

              <div className="px-6 pb-6 relative">
                {/* Layout container aligning content items vertically on smaller viewports */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 -mt-14 sm:-mt-16">
                  {/* VERTICAL CONTAINER: Pushes the profile text blocks below the circular avatar frame */}
                  <div className="flex flex-col items-center text-center sm:items-start sm:text-left gap-3 w-full sm:w-auto">
                    <div className="relative z-10 p-1 bg-white rounded-full -mt-2">
                      <Avatar
                        initials={
                          profileUser.avatar && profileUser.avatar.length <= 4
                            ? profileUser.avatar
                            : profileUser.name.charAt(0).toUpperCase()
                        }
                        size="profile"
                      />
                    </div>

                    {/* METADATA BLOCK POSITIONED DIRECTLY UNDER THE AVATAR */}
                    <div className="flex flex-col items-center sm:items-start mt-1">
                      {/* Full Name & Checked Verification Dot */}
                      <div className="flex items-center gap-1.5">
                        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900">
                          {profileUser.name}
                        </h1>
                        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold shrink-0 shadow-sm">
                          ✓
                        </span>
                      </div>

                      {/* User Metrics Row */}
                      <div className="flex items-center justify-center sm:justify-start flex-wrap gap-2 text-xs font-bold mt-1.5">
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-md uppercase font-extrabold ${getLevelBadgeClass(profileUser.danishLevel)}`}
                        >
                          {getRoleLabel(profileUser.role)}
                        </span>
                        <span className="text-emerald-500 flex items-center gap-1">
                          Aktiv nu
                        </span>
                        {profileUser.city && (
                          <span className="text-neutral-400 font-medium">
                            · {profileUser.city}, Denmark
                          </span>
                        )}
                      </div>

                      {/* Average response interval tracker text */}
                      <p className="text-[11px] text-neutral-400 font-semibold mt-1">
                        • Svarer inden for ~1 time
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto pt-2 sm:pt-20">
                    {existingMatch?.status === "accepted" ? (
                      <Link
                        to={`/messages/${profileUser.id}`}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-2xl bg-white border border-[#ECE7E2] px-6 h-12 text-xs font-extrabold text-neutral-700 shadow-sm hover:bg-neutral-50 transition-colors"
                      >
                        Beskeder
                      </Link>
                    ) : (
                      <button
                        type="button"
                        disabled
                        title="You need to connect before sending a message"
                        className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-2xl bg-neutral-50 border border-[#ECE7E2]/60 px-6 h-12 text-xs font-extrabold text-neutral-400 cursor-not-allowed shadow-none"
                      >
                        Beskeder
                      </button>
                    )}

                    {currentUser ? (
                      <button
                        type="button"
                        onClick={handleConnect}
                        disabled={isConnectDisabled}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-2xl bg-[#EA4C61] px-6 h-12 text-xs font-extrabold text-white shadow-sm hover:bg-opacity-95 disabled:bg-surface disabled:text-neutral transition-all"
                      >
                        {isOwnProfile
                          ? "This is your profile"
                          : `+ ${connectButtonLabel}`}
                      </button>
                    ) : (
                      <Link
                        to="/login"
                        className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-2xl bg-[#EA4C61] px-6 h-12 text-xs font-extrabold text-white shadow-sm hover:bg-opacity-95 transition-all"
                      >
                        Log in to connect
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* About Section Container */}
            <section className="rounded-3xl border border-[#ECE7E2] bg-white p-6 shadow-sm">
              <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-400">
                Om
              </h2>
              <p className="mt-3 text-sm font-semibold text-neutral-700 leading-relaxed whitespace-pre-wrap">
                {profileUser.bio || "No bio added yet."}
              </p>
            </section>

            {/* Languages Container Card */}
            <section className="rounded-3xl border border-[#ECE7E2] bg-white p-6 shadow-sm">
              <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-400 mb-4">
                Sprog
              </h2>

              <div className="flex flex-col gap-4">
                {/* Danish Metric Row */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-md bg-[#EA4C61] text-white font-black text-[10px] flex items-center justify-center shadow-sm">
                        DK
                      </span>
                      <div>
                        <p className="text-xs font-bold text-neutral-800">
                          Danish
                        </p>
                        <p className="text-[10px] text-neutral-400 font-medium">
                          {profileUser.role?.value === "native"
                            ? "teaches"
                            : "learning"}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-rose-50 text-[#EA4C61] uppercase">
                      {profileUser.danishLevel || "Native"}
                    </span>
                  </div>

                  {/* Progress bar container */}
                  <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-[#EA4C61] rounded-full transition-all duration-300"
                      style={{
                        width:
                          profileUser.role?.value === "native" ||
                          profileUser.danishLevel === "C2"
                            ? "100%"
                            : profileUser.danishLevel === "C1"
                              ? "85%"
                              : profileUser.danishLevel === "B2"
                                ? "70%"
                                : profileUser.danishLevel === "B1"
                                  ? "55%"
                                  : profileUser.danishLevel === "A2"
                                    ? "35%"
                                    : "15%",
                      }}
                    />
                  </div>
                </div>

                {/* Native language or english fallback progress metric row */}
                <div className="flex flex-col gap-2 mt-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-md bg-amber-500 text-white font-black text-[10px] flex items-center justify-center shadow-sm">
                        EN
                      </span>
                      <div>
                        <p className="text-xs font-bold text-neutral-800">
                          English
                        </p>
                        <p className="text-[10px] text-neutral-400 font-medium">
                          {profileUser.role?.value === "native"
                            ? "learning"
                            : "native"}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-50 text-amber-600 uppercase">
                      {profileUser.role?.value === "native" ? "B2" : "Native"}
                    </span>
                  </div>

                  {/* Second Progress indicator alignment block */}
                  <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-300"
                      style={{
                        width:
                          profileUser.role?.value === "native" ? "70%" : "100%",
                      }}
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="flex flex-col gap-6 w-full lg:max-w-[360px]">
            <ProfileListSection
              title="Interesser"
              items={profileUser.interests}
              emptyMessage="No topics added yet."
            />

            <ProfileListSection
              title="Læringsmål "
              items={profileUser.learningGoals}
              emptyMessage="No learning goals added yet."
            />

            <ProfileListSection
              title="Tilgængelighed"
              items={profileUser.availability}
              emptyMessage="No availability added yet."
            />
          </aside>
        </div>
      </div>
    </main>
  );
}

export default PublicProfile;
