import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Avatar from "../Shared/Avatar";
import StyledDropdown from "../Shared/StyledDropdown";
import LevelBadge from "../Shared/LevelBadge";
import type { UserRole, DanishLevel } from "../../types/types";

import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";

type ProfileUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar: string;
  avatarBgColor?: string;
  city: string;
  danishLevel: DanishLevel | "";
  nativeLanguage: string;
  learningGoals: string;
  interests: string[];
  availability: string[];
  bio: string;
  createdAt?: string;
};

type AuthContextValue = {
  user: ProfileUser | null;
  updateUser?: (updatedData: Partial<ProfileUser>) => ProfileUser | undefined;
};

type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
};

type Match = {
  id: string;
  requesterId: string;
  receiverId: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
};

type AppContextValue = {
  messages: Record<string, Message[]>;
  getAcceptedMatchesForUser: (userId: string) => Match[];
};

type ProfileFormData = {
  avatar: string;
  name: string;
  email: string;
  role: UserRole;
  city: string;
  danishLevel: DanishLevel | "";
  nativeLanguage: string;
  learningGoals: string;
  interests: string;
  availability: string;
  bio: string;
};

type SelectOption<T extends string = string> = {
  value: T;
  label: string;
};

type DropdownName = "avatar" | "city" | "danishLevel" | "availability";

const roleOptions: UserRole[] = [
  { value: "learner", label: "Lærer dansk" },
  { value: "native", label: "Taler dansk" },
];

const avatarOptions: SelectOption[] = [
  { value: "🙂", label: "🙂 Friendly" },
  { value: "👩", label: "👩 Woman" },
  { value: "👨", label: "👨 Man" },
  { value: "👩‍🦰", label: "👩‍🦰 Red hair" },
  { value: "👨‍🦱", label: "👨‍🦱 Curly hair" },
  { value: "👩‍🦳", label: "👩‍🦳 Older woman" },
  { value: "🧑", label: "🧑 Person" },
];

const cityOptions: SelectOption[] = [
  { value: "Copenhagen", label: "Copenhagen" },
  { value: "Aarhus", label: "Aarhus" },
  { value: "Odense", label: "Odense" },
  { value: "Other", label: "Other" },
];

const danishLevelOptions: SelectOption<DanishLevel>[] = [
  { value: "A1", label: "A1 · Beginner" },
  { value: "A2", label: "A2 · Elementary" },
  { value: "B1", label: "B1 · Intermediate" },
  { value: "B2", label: "B2 · Upper intermediate" },
  { value: "C1", label: "C1 · Advanced" },
  { value: "C2", label: "C2 · Native-like" },
];

const availabilityOptions: SelectOption[] = [
  { value: "weekends", label: "Weekends" },
  { value: "evenings", label: "Evenings" },
  { value: "weekdays", label: "Weekdays" },
  { value: "mornings", label: "Mornings" },
  { value: "flexible", label: "Flexible" },
];

const LEVEL_PROGRESS: Record<DanishLevel, string> = {
  A1: "w-1/6",
  A2: "w-2/6",
  B1: "w-3/6",
  B2: "w-4/6",
  C1: "w-5/6",
  C2: "w-full",
};

const LANGUAGE_NAMES: Record<string, string> = {
  EN: "English",
  DA: "Danish",
  DE: "German",
  ES: "Spanish",
  HI: "Hindi",
  AR: "Arabic",
  RU: "Russian",
  ZH: "Chinese",
  HR: "Croatian",
  PL: "Polish",
  SO: "Somali",
};

const fieldClass =
  "mt-2 w-full rounded-2xl border border-[#ECE6DD] bg-white px-4 py-3.5 text-[15px] font-semibold text-[#2B2A28] outline-none transition placeholder:text-[#A89F94] focus:border-[#E63946] focus:ring-4 focus:ring-[#FDEAEC]";

const labelClass =
  "block text-[12px] font-extrabold tracking-[-0.01em] text-[#6E665C]";

function getFormDataFromUser(user: ProfileUser): ProfileFormData {
  return {
    avatar: user.avatar ?? "",
    name: user.name ?? "",
    email: user.email ?? "",
    role: user.role ?? roleOptions[0],
    city: user.city ?? "",
    danishLevel: user.danishLevel ?? "",
    nativeLanguage: user.nativeLanguage ?? "",
    learningGoals: user.learningGoals ?? "",
    interests: user.interests?.join(", ") ?? "",
    availability: user.availability?.[0] ?? "",
    bio: user.bio ?? "",
  };
}

function getRoleLabel(role?: UserRole) {
  return role?.label ?? "Lærer dansk";
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getMemberSince(createdAt?: string) {
  if (!createdAt) return "2026";

  const year = new Date(createdAt).getFullYear();

  return Number.isNaN(year) ? "2026" : String(year);
}

function normalizeDanishLevel(level: DanishLevel | ""): DanishLevel {
  if (level && level in LEVEL_PROGRESS) {
    return level;
  }

  return "A1";
}

function getLanguageCode(language: string) {
  return (language || "EN").slice(0, 2).toUpperCase();
}

function getLanguageName(language: string) {
  const code = getLanguageCode(language);
  return LANGUAGE_NAMES[code] ?? language ?? "English";
}

function toDayKey(isoDate: string) {
  return new Date(isoDate).toDateString();
}

function getActiveDays(
  messages: Record<string, Message[]>,
  userId: string
): Set<string> {
  const days = new Set<string>();

  for (const conversation of Object.values(messages ?? {})) {
    for (const message of conversation) {
      if (message.senderId === userId) {
        days.add(toDayKey(message.createdAt));
      }
    }
  }

  return days;
}

function getDayStreak(activeDays: Set<string>) {
  const day = new Date();

  if (!activeDays.has(day.toDateString())) {
    day.setDate(day.getDate() - 1);
  }

  let streak = 0;

  while (activeDays.has(day.toDateString())) {
    streak += 1;
    day.setDate(day.getDate() - 1);
  }

  return streak;
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[18px] border border-[#EAE3D8] bg-white px-4 py-5 text-center shadow-[0_14px_28px_-24px_rgba(33,30,28,0.35)]">
      <p className="text-[22px] font-extrabold leading-none tracking-[-0.02em] text-[#161616]">
        {value}
      </p>
      <p className="mt-2 text-[12px] font-bold text-[#A89F94]">{label}</p>
    </div>
  );
}

function MyProfile() {
  const { user, updateUser } = useAuth() as AuthContextValue;
  const { messages, getAcceptedMatchesForUser } = useApp() as AppContextValue;

  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [openDropdown, setOpenDropdown] = useState<DropdownName | "">("");

  const [formData, setFormData] = useState<ProfileFormData>({
    avatar: "",
    name: "",
    email: "",
    role: roleOptions[0],
    city: "",
    danishLevel: "",
    nativeLanguage: "",
    learningGoals: "",
    interests: "",
    availability: "",
    bio: "",
  });

  useEffect(() => {
    if (!user) return;

    setFormData(getFormDataFromUser(user));
  }, [user]);

  const stats = useMemo(() => {
    if (!user) {
      return { partners: 0, sessions: 0, streak: 0 };
    }

    const activeDays = getActiveDays(messages, user.id);

    return {
      partners: getAcceptedMatchesForUser(user.id).length,
      sessions: activeDays.size,
      streak: getDayStreak(activeDays),
    };
  }, [user, messages, getAcceptedMatchesForUser]);

  if (!user) {
    return null;
  }

  const currentUser = user;
  const isNative = currentUser.role?.value === "native";
  const danishLevel = isNative
    ? currentUser.danishLevel || "C2"
    : normalizeDanishLevel(currentUser.danishLevel);

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleRoleChange(role: UserRole) {
    setFormData((prev) => ({
      ...prev,
      role,
    }));
  }

  function handleDropdownChange(name: DropdownName, value: string) {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setOpenDropdown("");
  }

  function handleEdit() {
    setFormData(getFormDataFromUser(currentUser));
    setMessage("");
    setIsEditing(true);
  }

  function handleCancel() {
    setIsEditing(false);
    setMessage("");
    setOpenDropdown("");
    setFormData(getFormDataFromUser(currentUser));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!updateUser) {
      setMessage("Profile editing is not available yet.");
      return;
    }

    const updatedProfile: Partial<ProfileUser> = {
      avatar: formData.avatar,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      city: formData.city,
      danishLevel: formData.danishLevel,
      nativeLanguage: formData.nativeLanguage,
      learningGoals: formData.learningGoals,
      interests: formData.interests
        .split(",")
        .map((interests) => interests.trim())
        .filter(Boolean),
      availability: formData.availability ? [formData.availability] : [],
      bio: formData.bio,
    };

    updateUser(updatedProfile);

    setIsEditing(false);
    setOpenDropdown("");
    setMessage("Profile updated successfully.");
  }

  return (
    <main className="-m-8 min-h-[calc(100vh-8rem)] bg-background px-4 py-8 font-sans text-[#2B2A28] sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-[760px]">
        {message && (
          <p className="mt-5 rounded-2xl border border-[#D7EFE2] bg-success-light px-4 py-3 text-sm font-bold text-success-dark">
            {message}
          </p>
        )}
      </div>

      {!isEditing ? (
        <section className="mx-auto mt-8 w-full max-w-[760px] space-y-4 sm:space-y-5">
          <article className="overflow-hidden rounded-[20px] border border-[#EAE3D8] bg-white shadow-[0px_8px_18px_-18px_rgba(43,42,40,0.5)]">
            <div className="h-[122px] bg-gradient-to-r from-[#E63946] via-[#F0525D] to-[#FF9665] sm:h-[104px]" />

            <div className="relative px-5 pb-6 pt-0 sm:px-6">
              <div className="-mt-11 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex flex-col items-start">
                  <div className="rounded-full border-4 border-white shadow-[0_12px_24px_-16px_rgba(33,30,28,0.55)]">
                    <Avatar
                      initials={getInitials(currentUser.name)}
                      size="profile"
                      color={currentUser.avatarBgColor}
                    />
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center gap-2">
                      <h2 className="text-[23px] font-extrabold leading-none tracking-[-0.03em] text-[#161616]">
                        {currentUser.name}
                      </h2>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2 text-[13px] font-bold text-[#7c756b]">
                      <span className="rounded-full bg-[#FDEAEC] px-3 py-1 text-[#E63946]">
                        {getRoleLabel(currentUser.role)}
                      </span>

                      <span>📍</span>

                      <span>{currentUser.city || "Copenhagen"}, Denmark</span>

                      <span className="hidden text-[#A89F94] sm:inline">·</span>

                      <span>
                        Member since {getMemberSince(currentUser.createdAt)}
                      </span>
                    </div>

                    <p className="mt-4 max-w-[620px] text-[14px] font-semibold leading-relaxed text-[#3a352f]">
                      {currentUser.bio || currentUser.learningGoals}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleEdit}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#EAE3D8] bg-white px-5 py-3 text-[13px] font-bold text-[#2b2a28] transition hover:bg-[#FBF7F1] focus:outline-none focus:ring-4 focus:ring-[#FDEAEC] active:translate-y-px sm:mt-14"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                  Edit profile
                </button>
              </div>
            </div>
          </article>

          <div className="grid grid-cols-3 gap-4">
            <StatCard value={String(stats.partners)} label="Partners" />
            <StatCard value={String(stats.sessions)} label="Sessions" />
            <StatCard value={`${stats.streak} 🔥`} label="Day streak" />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <article className="rounded-[18px] border border-[#EAE3D8] bg-white p-5 shadow-[0_14px_28px_-24px_rgba(33,30,28,0.35)] sm:p-6">
              <h3 className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#A89F94]">
                Languages
              </h3>

              <div className="mt-5 space-y-4">
                {!isNative && (
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E63946] text-[12px] font-extrabold text-white">
                      DK
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-[15px] font-bold text-[#161616]">
                          Danish
                        </p>
                        <LevelBadge level={danishLevel} />
                      </div>

                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#EAE3D8]">
                        <div
                          className={`h-full rounded-full bg-[#E63946] ${LEVEL_PROGRESS[danishLevel]}`}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FF9665] text-[12px] font-extrabold text-white">
                    {getLanguageCode(currentUser.nativeLanguage)}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-[15px] font-bold text-[#161616]">
                        {getLanguageName(currentUser.nativeLanguage)}
                      </p>

                      <LevelBadge level="C2" />
                    </div>

                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#EAE3D8]">
                      <div className="h-full w-full rounded-full bg-[#E63946]" />
                    </div>
                  </div>
                </div>
              </div>
            </article>

            <article className="rounded-[18px] border border-[#EAE3D8] bg-white p-5 shadow-[0_14px_28px_-24px_rgba(33,30,28,0.35)] sm:p-6">
              <h3 className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#A89F94]">
                Interests
              </h3>

              <div className="mt-5 flex flex-wrap gap-2.5">
                {(currentUser.interests && currentUser.interests.length > 0
                  ? currentUser.interests
                  : ["Hygge"]
                ).map((interest) => (
                  <span
                    key={interest}
                    className="rounded-full bg-[#F3EEE7] px-4 py-2 text-[14px] font-semibold capitalize text-[#6E665C]"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </article>
          </div>
        </section>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 w-full max-w-[520px] rounded-[18px] border border-[#EAE3D8] bg-white p-5 shadow-[0_32px_64px_-24px_rgba(33,30,28,0.40),0_8px_20px_-12px_rgba(33,30,28,0.28)] sm:p-8"
        >
          <div className="space-y-4">
            <fieldset>
              <legend className="text-[16px] font-extrabold tracking-[-0.01em] text-[#A89F94]">
                I am
              </legend>
              <div className="mt-2 flex rounded-full bg-[#F6F0E8] p-1">
                {roleOptions.map((option) => {
                  const isSelected = formData.role.value === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => handleRoleChange(option)}
                      className={`min-w-0 flex-1 cursor-pointer whitespace-nowrap rounded-full px-2 py-3 text-center text-[11px] font-extrabold transition focus:outline-none focus:ring-4 focus:ring-[#FDEAEC] min-[380px]:text-[12px] sm:px-4 sm:text-[13px] ${
                        isSelected
                          ? "bg-[#E63946] text-white shadow-[0_10px_18px_-12px_rgba(230,57,70,0.75)]"
                          : "text-[#6E665C] hover:bg-[#EFE8DD] active:bg-[#E6DCCF]"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <label htmlFor="name" className={labelClass}>
              Name
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className={fieldClass}
              />
            </label>

            <label htmlFor="email" className={labelClass}>
              Email
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={fieldClass}
              />
            </label>

            <label className={labelClass}>
              Avatar
              <div className="mt-2">
                <StyledDropdown
                  name="avatar"
                  value={formData.avatar}
                  options={avatarOptions}
                  isOpen={openDropdown === "avatar"}
                  onToggle={() =>
                    setOpenDropdown(openDropdown === "avatar" ? "" : "avatar")
                  }
                  onSelect={handleDropdownChange}
                  onClose={() => setOpenDropdown("")}
                />
              </div>
            </label>

            <label className={labelClass}>
              City
              <div className="mt-2">
                <StyledDropdown
                  name="city"
                  value={formData.city}
                  options={cityOptions}
                  isOpen={openDropdown === "city"}
                  onToggle={() =>
                    setOpenDropdown(openDropdown === "city" ? "" : "city")
                  }
                  onSelect={handleDropdownChange}
                  onClose={() => setOpenDropdown("")}
                />
              </div>
            </label>

            <label className={labelClass}>
              Danish level
              <div className="mt-2">
                <StyledDropdown
                  name="danishLevel"
                  value={formData.danishLevel}
                  options={danishLevelOptions}
                  isOpen={openDropdown === "danishLevel"}
                  onToggle={() =>
                    setOpenDropdown(
                      openDropdown === "danishLevel" ? "" : "danishLevel"
                    )
                  }
                  onSelect={handleDropdownChange}
                  onClose={() => setOpenDropdown("")}
                />
              </div>
            </label>

            <label className={labelClass}>
              Availability
              <div className="mt-2">
                <StyledDropdown
                  name="availability"
                  value={formData.availability}
                  options={availabilityOptions}
                  isOpen={openDropdown === "availability"}
                  onToggle={() =>
                    setOpenDropdown(
                      openDropdown === "availability" ? "" : "availability"
                    )
                  }
                  onSelect={handleDropdownChange}
                  onClose={() => setOpenDropdown("")}
                />
              </div>
            </label>

            <label htmlFor="nativeLanguage" className={labelClass}>
              Native language
              <input
                id="nativeLanguage"
                name="nativeLanguage"
                type="text"
                value={formData.nativeLanguage}
                onChange={handleChange}
                className={fieldClass}
              />
            </label>

            <label htmlFor="learningGoals" className={labelClass}>
              Learning goals
              <input
                id="learningGoals"
                name="learningGoals"
                type="text"
                value={formData.learningGoals}
                onChange={handleChange}
                className={fieldClass}
              />
            </label>

            <label htmlFor="interests" className={labelClass}>
              Interests
              <input
                id="interests"
                name="interests"
                type="text"
                value={formData.interests}
                onChange={handleChange}
                placeholder="culture, food, travel"
                className={fieldClass}
              />
            </label>

            <label htmlFor="bio" className={labelClass}>
              Bio
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className={`${fieldClass} min-h-28 resize-y`}
              />
            </label>
          </div>

          <button
            type="submit"
            className="mt-6 w-full cursor-pointer rounded-full bg-[#E63946] px-6 py-3.5 text-[15px] font-extrabold text-white shadow-[0_14px_24px_-12px_rgba(230,57,70,0.75)] transition hover:bg-[#D62F3C] focus:outline-none focus:ring-4 focus:ring-[#FAD2D5] active:translate-y-px"
          >
            Save profile
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="mt-3 w-full cursor-pointer rounded-full bg-[#ECE6DD] px-6 py-3.5 text-[15px] font-extrabold text-[#6E665C] transition hover:bg-[#F6F0E8] focus:outline-none focus:ring-4 focus:ring-[#FDEAEC] active:translate-y-px"
          >
            Cancel
          </button>
        </form>
      )}
    </main>
  );
}

export default MyProfile;
