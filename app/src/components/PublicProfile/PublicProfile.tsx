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
  if (!role) {
    return "Not added yet";
  }

  if (role === "native") {
    return "Native speaker";
  }

  return "Learner";
}

function getLevelLabel(level: string | undefined) {
  if (!level) {
    return "Not added yet";
  }

  const labels: Record<string, string> = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
    native: "Native",
  };

  return labels[level] ?? level;
}

function getLevelBadgeClass(level: string | undefined) {
  if (level === "native") {
    return "bg-foreground text-background";
  }

  if (level === "advanced") {
    return "bg-primary-pale text-primary-dark";
  }

  if (level === "intermediate") {
    return "bg-primary-light text-primary";
  }

  return "bg-secondary-light text-secondary-dark";
}

function toList(items?: string[] | string) {
  return Array.isArray(items) ? items : items ? [items] : [];
}

function ProfileDetail({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-card border border-surface bg-white px-4 py-3">
      <dt className="text-xs font-extrabold uppercase tracking-wide text-neutral-light">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold text-foreground">
        {value || "Not added yet"}
      </dd>
    </div>
  );
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

  return (
    <section className="rounded-card border border-surface bg-white p-5 shadow-card">
      <h2 className="text-xs font-extrabold uppercase tracking-wide text-neutral-light">
        {title}
      </h2>

      {listItems.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {listItems.map((item, index) => (
            <li
              key={`${item}-${index}`}
              className="rounded-pill bg-surface px-3 py-2 text-sm font-bold text-neutral"
            >
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm font-semibold text-neutral">
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
    if (!currentUser || !profileUser) {
      return;
    }

    sendMatchRequest(currentUser.id, profileUser.id);
  }

  return (
    <main className="-m-8 min-h-[calc(100vh-8rem)] bg-background px-4 py-8 font-sans sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-5xl">
        <Link
          to="/browse"
          className="inline-flex items-center rounded-pill bg-white px-4 py-2 text-sm font-bold text-neutral shadow-card transition hover:bg-surface-alt"
        >
          Back to Browse
        </Link>

        <section className="mt-5 overflow-hidden rounded-card border border-surface bg-white shadow-card">
          <div className="h-28 bg-gradient-brand sm:h-36" />

          <div className="px-5 pb-6 sm:px-7 sm:pb-7">
            <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
                <div className="flex h-24 w-24 items-center justify-center rounded-pill border-4 border-white bg-secondary text-4xl shadow-elevated sm:h-28 sm:w-28">
                  <span>
                    {profileUser.avatar || profileUser.name.charAt(0)}
                  </span>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                      {profileUser.name}
                    </h1>
                    <span
                      className={`rounded-sm px-3 py-1 text-xs font-extrabold ${getLevelBadgeClass(
                        profileUser.danishLevel
                      )}`}
                    >
                      {getLevelLabel(profileUser.danishLevel)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-neutral">
                    {profileUser.city || "City not added"} ·{" "}
                    {getRoleLabel(profileUser.role)}
                  </p>
                </div>
              </div>

              <div className="sm:pb-1">
                {currentUser ? (
                  <button
                    type="button"
                    onClick={handleConnect}
                    disabled={isConnectDisabled}
                    className="w-full rounded-pill bg-primary px-6 py-3 text-sm font-bold text-white shadow-primary transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-surface disabled:text-neutral disabled:shadow-none sm:w-auto"
                  >
                    {isOwnProfile ? "This is your profile" : connectButtonLabel}
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="inline-flex w-full justify-center rounded-pill bg-primary px-6 py-3 text-sm font-bold text-white shadow-primary transition hover:bg-primary-dark sm:w-auto"
                  >
                    Log in to connect
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-card border border-surface bg-white p-5 shadow-card">
            <h2 className="text-lg font-extrabold text-foreground">About</h2>
            <p className="mt-3 text-sm font-medium leading-6 text-neutral">
              {profileUser.bio || "No bio added yet."}
            </p>
          </section>

          <section className="rounded-card border border-surface bg-white p-5 shadow-card">
            <h2 className="text-lg font-extrabold text-foreground">
              Profile details
            </h2>

            <dl className="mt-4 grid gap-3">
              <ProfileDetail
                label="Role"
                value={getRoleLabel(profileUser.role)}
              />
              <ProfileDetail
                label="Danish level"
                value={getLevelLabel(profileUser.danishLevel)}
              />
              <ProfileDetail
                label="Native language"
                value={profileUser.nativeLanguage}
              />
            </dl>
          </section>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <ProfileListSection
            title="Interests"
            items={profileUser.interests}
            emptyMessage="No interests added yet."
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
        </div>
      </div>
    </main>
  );
}

export default PublicProfile;
