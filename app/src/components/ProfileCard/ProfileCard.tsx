import { Link } from "react-router-dom";
import type { ReactNode } from "react";

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

function ProfileCard({
  user,
  actions,
  showViewProfileLink = true,
}: ProfileCardProps) {
  const shortBio =
    user.bio.length > 120 ? `${user.bio.slice(0, 120)}...` : user.bio;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl">
          {user.avatar}
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
