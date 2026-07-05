import { Link, useParams } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
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

function getLevelLabel(level: string | undefined) {
  if (!level) return "Not added yet";
  const labels: Record<string, string> = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
    native: "Native",
  };
  return labels[level] ?? level;
}

function getLevelBadgeClass(level: string | undefined) {
  if (level === "native") return "bg-rose-100 text-[#EA4C61]";
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
    <section className="rounded-3xl border border-surface bg-white p-6 w-full">
      <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-light">
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
                  <span className="flex items-center justify-center w-4 h-4 rounded-full bg-rose-100 text-[#EA4C61] text-[10px] shrink-0 mt-0.5">
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
                  className="rounded-xl bg-[#FAF6F0] px-3 py-1.5 text-xs font-bold text-neutral-800 border border-neutral-100/50"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <p className="mt-3 text-xs font-semibold text-neutral-light">
          {emptyMessage}
        </p>
      )}
    </section>
  );
}
function PublicProfile() {
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
    <main className="min-h-screen bg-white md:bg-[#FAF6F0] px-4 py-6 font-sans md:px-6 lg:px-8 -m-6 md:-m-8">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="mb-4">
          <Link
            to="/browse"
            className="inline-flex items-center rounded-full bg-white border border-surface px-5 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-50 transition-colors"
          >
            ‹ Back to Browse
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start w-full">
          <div className="flex flex-col gap-6 min-w-0 w-full">
            <section className="overflow-hidden rounded-3xl border border-surface bg-white">
              <div className="h-32 sm:h-44 bg-gradient-to-r from-rose-400 via-orange-400 to-amber-300 relative" />

              <div className="px-6 pb-6 relative">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-14 sm:-mt-16">
                  <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
                    <div className="flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-full border-4 border-white bg-amber-100 text-4xl overflow-hidden shadow-sm shrink-0">
                      {profileUser.avatar ? (
                        <span className="text-3xl">{profileUser.avatar}</span>
                      ) : (
                        <span className="text-xl font-bold text-amber-600">
                          {profileUser.name.charAt(0)}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-900">
                          {profileUser.name}
                        </h1>
                        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#EA4C61] text-white text-[9px] font-bold shrink-0 mt-0.5">
                          ✓
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        <span
                          className={`font-extrabold text-[11px] px-2 py-0.5 rounded-md uppercase ${getLevelBadgeClass(profileUser.danishLevel)}`}
                        >
                          {getRoleLabel(profileUser.role)}
                        </span>
                        <span className="text-emerald-500 font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{" "}
                          Active now
                        </span>
                        {profileUser.city && (
                          <span className="text-neutral-400 font-medium">
                            · {profileUser.city}, Denmark
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-400 font-medium mt-1">
                        • Replies within ~1h
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-full bg-white border border-surface px-5 h-10 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      Message
                    </button>
                    {currentUser ? (
                      <button
                        type="button"
                        onClick={handleConnect}
                        disabled={isConnectDisabled}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-full bg-[#EA4C61] px-5 h-10 text-xs font-bold text-white hover:bg-opacity-95 disabled:bg-surface disabled:text-neutral transition-all"
                      >
                        {isOwnProfile
                          ? "This is your profile"
                          : `+ ${connectButtonLabel}`}
                      </button>
                    ) : (
                      <Link
                        to="/login"
                        className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-full bg-[#EA4C61] px-5 h-10 text-xs font-bold text-white hover:bg-opacity-95 transition-all"
                      >
                        Log in to connect
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-surface bg-white p-6 lg:p-8">
              <h2 className="text-lg font-extrabold text-neutral-900">About</h2>
              <p className="mt-3 text-sm font-medium leading-relaxed text-neutral-700 whitespace-pre-wrap">
                {profileUser.bio || "No bio added yet."}
              </p>
            </section>

            <section className="rounded-3xl border border-surface bg-white p-6 lg:p-8">
              <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-light mb-4">
                Languages
              </h2>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="bg-[#EA4C61] text-white font-extrabold text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wide">
                        DK
                      </span>
                      <span className="text-sm font-extrabold text-neutral-900">
                        {profileUser.role?.value === "native"
                          ? "Danish · teaches"
                          : "Danish · learning"}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[#EA4C61] bg-rose-50 px-2 py-0.5 rounded">
                      {profileUser.danishLevel || "Native"}
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
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

                {profileUser.nativeLanguage &&
                  profileUser.role?.value !== "native" && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="bg-orange-400 text-white font-extrabold text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wide">
                            {profileUser.nativeLanguage}
                          </span>
                          <span className="text-sm font-extrabold text-neutral-900">
                            {profileUser.nativeLanguage === "EN"
                              ? "English"
                              : profileUser.nativeLanguage === "ES"
                                ? "Spanish"
                                : profileUser.nativeLanguage === "HI"
                                  ? "Hindi"
                                  : profileUser.nativeLanguage === "ZH"
                                    ? "Chinese"
                                    : "Native language"}{" "}
                            · speaks
                          </span>
                        </div>
                        <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded">
                          Native
                        </span>
                      </div>

                      <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-400 w-full rounded-full" />
                      </div>
                    </div>
                  )}
              </div>
            </section>
          </div>

          <aside className="flex flex-col gap-6 w-full lg:max-w-[360px]">
            <ProfileListSection
              title="Topics"
              items={profileUser.interests}
              emptyMessage="No topics added yet."
            />

            <ProfileListSection
              title="Learning goals"
              items={profileUser.learningGoals}
              emptyMessage="No learning goals added yet."
            />

            <ProfileListSection
              title="Availability"
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
