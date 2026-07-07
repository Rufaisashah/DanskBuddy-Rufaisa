import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { avatarColor } from "../../utils/avatarColor";
import { getInitials } from "../../utils/getInitials";
import LevelBadge from "../Shared/LevelBadge";
import type { Level } from "../Shared/LevelBadge";

type UserRole = "learner" | "native";

export type ProfileCardUser = {
  id: string;
  name: string;
  avatar: string;
  city: string;
  role: UserRole;
  danishLevel: string;
  nativeLanguage: string;
  interests: string[];
  bio: string;
};

type ProfileCardProps = {
  user: ProfileCardUser;
  actions?: ReactNode;
  showViewProfileLink?: boolean;
};

const MAX_VISIBLE_INTERESTS = 3;

const VALID_LEVELS: Level[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

function getLanguageCode(language: string) {
  return (language || "EN").slice(0, 2).toUpperCase();
}

function getLevel(user: ProfileCardUser): Level | null {
  return VALID_LEVELS.includes(user.danishLevel as Level)
    ? (user.danishLevel as Level)
    : null;
}

function ProfileCard({
  user,
  actions,
  showViewProfileLink = true,
}: ProfileCardProps) {
  const shortBio =
    user.bio.length > 120 ? `${user.bio.slice(0, 120)}...` : user.bio;

  const isNative = user.role === "native";
  const level = getLevel(user);

  const nativeCode = getLanguageCode(user.nativeLanguage);
  const languageFrom = isNative ? "DK" : nativeCode;
  const languageTo = isNative
    ? nativeCode === "DA"
      ? "EN"
      : nativeCode
    : "DK";

  const visibleInterests = user.interests.slice(0, MAX_VISIBLE_INTERESTS);
  const hiddenInterestCount = user.interests.length - visibleInterests.length;

  const name = showViewProfileLink ? (
    <Link
      to={`/profile/${user.id}`}
      className="truncate text-[17px] font-extrabold tracking-[-0.01em] text-[#161616] no-underline transition hover:text-[#E63946]"
    >
      {user.name}
    </Link>
  ) : (
    <h2 className="truncate text-[17px] font-extrabold tracking-[-0.01em] text-[#161616]">
      {user.name}
    </h2>
  );

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-[#EAE3D8] bg-white p-5 shadow-[0_14px_28px_-24px_rgba(33,30,28,0.35)]">
      <div className="flex flex-col gap-3">
        <div className="relative flex-none">
          <div
            className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full text-white text-lg font-bold text-white"
            style={{ backgroundColor: avatarColor(user.id) }}
          >
            {user.avatar.startsWith("data:image") ? (
              <img
                src={user.avatar}
                alt="Brugeravatar"
                className="h-full w-full object-cover"
              />
            ) : (
              user.avatar || getInitials(user.name)
            )}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-slate-900">
              {user.name}
            </h2>

            <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
              {user.role}
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-600">{user.city}</p>

          <p className="mt-2 text-sm text-slate-700">
            <strong>Danskniveau:</strong> {user.danishLevel}
          </p>

          <p className="mt-3 text-sm text-slate-700">{shortBio}</p>

          {user.interests.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {user.interests.map((interests) => (
                <span
                  key={interests}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                >
                  {interests}
                </span>
              ))}
            </div>
          )}

          {(showViewProfileLink || actions) && (
            <div className="mt-5 flex flex-wrap gap-3">
              {showViewProfileLink && (
                <Link
                  to={`/profile/${user.id}`}
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                >
                  Se profil
                </Link>
              )}

              {actions}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default ProfileCard;
