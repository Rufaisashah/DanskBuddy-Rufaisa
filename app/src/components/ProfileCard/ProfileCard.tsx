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

  const visibleInterests = user.interests.slice(0, MAX_VISIBLE_INTERESTS);
  const hiddenInterestCount = user.interests.length - visibleInterests.length;

  const name = showViewProfileLink ? (
    <Link
      to={`/profile/${user.id}`}
      className="truncate text-[15.5px] font-extrabold tracking-[-0.01em] text-[#161616] no-underline transition hover:text-[#E63946]"
    >
      {user.name}
    </Link>
  ) : (
    <h2 className="truncate text-[15.5px] font-extrabold tracking-[-0.01em] text-[#161616]">
      {user.name}
    </h2>
  );

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-[#EAE3D8] bg-white p-5 shadow-[0_14px_28px_-24px_rgba(33,30,28,0.35)]">
      <div className="flex items-start gap-3">
        <div className="relative flex-none">
          <div
            className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full text-lg font-bold text-white"
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

        <div className="min-w-0 flex-1">
          {name}

          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] font-semibold text-[#7C756B]">
            <span className="truncate">{user.city}</span>
          </div>
        </div>

        <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#E63946]">
          {level && <LevelBadge level={level} />}
        </span>
      </div>

      {shortBio && (
        <p className="m-0 text-[14px] text-sm leading-relaxed text-[#3A352F]">
          {shortBio}
        </p>
      )}

      {visibleInterests.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {visibleInterests.map((interest) => (
            <span
              key={interest}
              className="rounded-lg bg-[#F3EEE7] px-2.5 py-1 text-[12px] font-semibold lowercase text-[#6E665C]"
            >
              {interest}
            </span>
          ))}

          {hiddenInterestCount > 0 && (
            <span className="rounded-lg bg-[#F3EEE7] px-2.5 py-1 text-[12px] font-semibold text-[#A89F94]">
              +{hiddenInterestCount}
            </span>
          )}
        </div>
      )}

      <div className="mt-auto flex items-center gap-2 pt-1">
        <div className="min-w-0 flex-1">{actions}</div>
      </div>
    </article>
  );
}

export default ProfileCard;
