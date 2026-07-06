import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent, KeyboardEvent } from "react";
import Avatar from "../Shared/Avatar";
import StyledDropdown from "../Shared/StyledDropdown";
import LevelBadge from "../Shared/LevelBadge";
import type { UserRole, DanishLevel } from "../../types/types";
import toast from "react-hot-toast";

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

type DropdownName = "city" | "danishLevel" | "availability";

const roleOptions: UserRole[] = [
  { value: "learner", label: "Lærer dansk" },
  { value: "native", label: "Taler dansk" },
];

const cityOptions: SelectOption[] = [
  { value: "København", label: "København" },
  { value: "Aarhus", label: "Aarhus" },
  { value: "Odense", label: "Odense" },
  { value: "Aalborg", label: "Aalborg" },
];

const danishLevelOptions: SelectOption<DanishLevel>[] = [
  { value: "A1", label: "A1 · Begynder" },
  { value: "A2", label: "A2 · Elementær" },
  { value: "B1", label: "B1 · Mellem" },
  { value: "B2", label: "B2 · Øvre mellem" },
  { value: "C1", label: "C1 · Avanceret" },
  { value: "C2", label: "C2 · Modersmål" },
];

const availabilityOptions: SelectOption[] = [
  { value: "Weekender", label: "Weekender" },
  { value: "Aftener", label: "Aftener" },
  { value: "Hverdage", label: "Hverdage" },
  { value: "Morgener", label: "Morgener" },
  { value: "Fleksibel", label: "Fleksibel" },
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
  EN: "Engelsk",
  DA: "Dansk",
  DE: "Tysk",
  ES: "Spansk",
  HI: "Hindi",
  AR: "Arabisk",
  RU: "Russisk",
  ZH: "Kinesisk",
  HR: "Kroatisk",
  PL: "Polsk",
  SO: "Somali",
};

const fieldClass =
  "mt-2 w-full rounded-xl border border-[#ECE6DD] bg-white px-4 py-2.5 text-[15px] font-semibold text-[#2B2A28] outline-none transition placeholder:text-[#A89F94] focus:border-[#E63946] focus:ring-4 focus:ring-[#FDEAEC]";

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
    <div className="px-2 py-4 text-center sm:rounded-[18px] sm:border sm:border-[#EAE3D8] sm:bg-white sm:px-4 sm:py-5">
      <p className="text-[19px] font-extrabold leading-none tracking-[-0.02em] text-[#161616] sm:text-[22px]">
        {value}
      </p>
      <p className="mt-1.5 text-[11px] font-bold text-[#A89F94] sm:mt-2 sm:text-[12px]">
        {label}
      </p>
    </div>
  );
}

function handleFormKeyDown(event: KeyboardEvent<HTMLFormElement>) {
  const target = event.target as HTMLElement;

  if (event.key === "Enter" && target.tagName !== "TEXTAREA") {
    event.preventDefault();
  }
}

function MyProfile() {
  const { user, updateUser } = useAuth() as AuthContextValue;
  const { messages, getAcceptedMatchesForUser } = useApp() as AppContextValue;

  const [isEditing, setIsEditing] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownName | "">("");
  const [topicInput, setTopicInput] = useState("");

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

  function handleAvatarUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const MAX_SIZE = 256;
        const scale = Math.min(1, MAX_SIZE / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas
          .getContext("2d")
          ?.drawImage(img, 0, 0, canvas.width, canvas.height);

        setFormData((prev) => ({
          ...prev,
          avatar: canvas.toDataURL("image/jpeg", 0.85),
        }));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  function addTopic() {
    const topic = topicInput.trim();
    if (!topic) return;

    const topics = formData.interests
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (!topics.includes(topic)) {
      setFormData((prev) => ({
        ...prev,
        interests: [...topics, topic].join(", "),
      }));
    }
    setTopicInput("");
  }

  function removeTopic(topic: string) {
    const topics = formData.interests
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t && t !== topic);
    setFormData((prev) => ({ ...prev, interests: topics.join(", ") }));
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
    setIsEditing(true);
  }

  function handleCancel() {
    setIsEditing(false);
    setOpenDropdown("");
    setFormData(getFormDataFromUser(currentUser));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!updateUser) {
      toast.error("Profilredigering er ikke tilgængelig endnu.");
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
    toast.success("Profilen er opdateret.");
  }

  return (
    <main className="-m-8 min-h-[calc(100vh-8rem)]  px-4 py-8 font-sans text-[#2B2A28] sm:px-6 bg-white sm:bg-surface-alt lg:px-10">
      {!isEditing ? (
        <section className="mx-auto w-full space-y-4 sm:space-y-5">
          <article className="-mx-4 -mt-8 overflow-hidden sm:border-y border-[#EAE3D8] bg-white sm:shadow-[0px_8px_18px_-18px_rgba(43,42,40,0.5)] sm:mx-0 sm:mt-0 sm:rounded-[20px] sm:border">
            <div className="h-[122px] bg-gradient-to-r from-[#E63946] via-[#F0525D] to-[#FF9665] sm:h-[104px]" />

            <div className="relative px-5 pb-6 pt-0 px-6">
              <div className="-mt-11 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex flex-col items-start">
                  <div className="rounded-full border-4 border-white shadow-[0_12px_24px_-16px_rgba(33,30,28,0.55)]">
                    <Avatar
                      initials={getInitials(currentUser.name)}
                      image={currentUser.avatar}
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

                      <span>{currentUser.city || "København"}, Danmark</span>

                      <span className="hidden text-[#A89F94] sm:inline">·</span>

                      <span className="hidden sm:inline">
                        Medlem siden {getMemberSince(currentUser.createdAt)}
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
                  className="inline-flex whitespace-nowrap shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#EAE3D8] bg-white px-5 py-3 text-[13px] font-bold text-[#2b2a28] transition hover:bg-[#FBF7F1] focus:outline-none focus:ring-4 focus:ring-[#FDEAEC] active:translate-y-px sm:mt-14"
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
                  Rediger profil
                </button>
              </div>
            </div>
          </article>

          <div className="grid grid-cols-3 divide-x divide-[#EAE3D8] overflow-hidden rounded-[14px] border border-[#EAE3D8] bg-white sm:gap-4 sm:divide-x-0 sm:overflow-visible sm:rounded-none sm:border-0 sm:bg-transparent">
            <StatCard value={String(stats.partners)} label="Partnere" />
            <StatCard value={String(stats.sessions)} label="Sessioner" />
            <StatCard value={`${stats.streak} 🔥`} label="Streak" />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <article className="rounded-[18px] border-0 bg-transparent p-0 sm:border sm:border-[#EAE3D8] sm:bg-white p-6">
              <h3 className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#A89F94]">
                Sprog
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
                          Dansk
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

            <article className="rounded-[18px] border-0 bg-transparent p-0 sm:border sm:border-[#EAE3D8] sm:bg-white p-6">
              <h3 className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#A89F94]">
                Interesser
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
          onKeyDown={handleFormKeyDown}
          className="mx-auto w-full"
        >
          <header className="-mx-4 -mt-8 mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#EAE3D8] bg-white px-4 py-4 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCancel}
                aria-label="Tilbage"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-[#EAE3D8] text-[#2b2a28] transition bg-[#fbf6ef] hover:bg-white focus:outline-none focus:ring-4 focus:ring-[#FDEAEC]"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              <h1 className="text-3xl font-bold leading-tight tracking-[-0.02em] text-[#161616]">
                Rediger profil
              </h1>
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <button
                type="button"
                onClick={handleCancel}
                className="cursor-pointer rounded-xl border border-[#EAE3D8] bg-white px-5 py-2.5 text-sm font-extrabold text-[#6E665C] transition hover:bg-[#FBF7F1] focus:outline-none focus:ring-4 focus:ring-[#FDEAEC] active:translate-y-px"
              >
                Annuller
              </button>

              <button
                type="submit"
                className="cursor-pointer rounded-xl bg-[#E63946] px-5 py-2.5 text-sm font-extrabold text-white shadow-[0_14px_24px_-12px_rgba(230,57,70,0.75)] transition hover:bg-[#D62F3C] focus:outline-none focus:ring-4 focus:ring-[#FAD2D5] active:translate-y-px"
              >
                Gem profil
              </button>
            </div>
          </header>
          <div className="space-y-4 sm:space-y-5">
            <section className="overflow-hidden rounded-[20px] border border-[#EAE3D8] bg-white shadow-[0px_8px_18px_-18px_rgba(43,42,40,0.5)] p-5 sm:p-6">
              <h3 className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#A89F94]">
                Identitet
              </h3>

              <div className="mt-4 space-y-4">
                <div className={labelClass}>
                  Avatar
                  <div className="mt-2 flex items-center gap-4">
                    <Avatar
                      initials={getInitials(formData.name || "?")}
                      image={formData.avatar}
                      size="profile"
                      color={user.avatarBgColor}
                    />

                    <label className="cursor-pointer rounded-full border border-[#EAE3D8] bg-white px-4 py-2.5 text-[13px] font-bold text-[#2b2a28] transition hover:bg-[#FBF7F1]">
                      Upload billede
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>
                    {formData.avatar.startsWith("data:") && (
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, avatar: "" }))
                        }
                        className="cursor-pointer text-[13px] font-bold text-[#A89F94] transition hover:text-[#E63946]"
                      >
                        Fjern billede
                      </button>
                    )}
                  </div>
                </div>

                <fieldset>
                  <legend className={labelClass}>Jeg er</legend>
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
                              ? "bg-white text-[#2b2a28] shadow-[0px_1px_3px_rgba(43,42,40,0.16)]"
                              : "text-[#6E665C] hover:bg-[#EFE8DD] active:bg-[#E6DCCF]"
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label htmlFor="name" className={labelClass}>
                    Navn
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
                </div>

                <label className={labelClass}>
                  By
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
              </div>
            </section>

            <section className="mt-8 overflow-hidden rounded-[20px] border border-[#EAE3D8] bg-white shadow-[0px_8px_18px_-18px_rgba(43,42,40,0.5)] p-5 sm:p-6">
              <h3 className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#A89F94]">
                Sprog & tilgængelighed
              </h3>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <label htmlFor="nativeLanguage" className={labelClass}>
                  Modersmål
                  <input
                    id="nativeLanguage"
                    name="nativeLanguage"
                    type="text"
                    value={formData.nativeLanguage}
                    onChange={handleChange}
                    className={fieldClass}
                  />
                </label>

                <label className={labelClass}>
                  Dansk niveau
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
                  Tilgængelighed
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
              </div>
            </section>

            <section className="mt-8 overflow-hidden rounded-[20px] border border-[#EAE3D8] bg-white shadow-[0px_8px_18px_-18px_rgba(43,42,40,0.5)] p-5 sm:p-6">
              <h3 className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#A89F94]">
                Om dig
              </h3>

              <div className="mt-4 space-y-4">
                <label htmlFor="learningGoals" className={labelClass}>
                  Læringsmål
                  <input
                    id="learningGoals"
                    name="learningGoals"
                    type="text"
                    value={formData.learningGoals}
                    onChange={handleChange}
                    className={fieldClass}
                  />
                </label>

                <div className={labelClass}>
                  Emner du kan lide
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {formData.interests
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean)
                      .map((topic) => (
                        <span
                          key={topic}
                          className="flex items-center gap-1.5 rounded-full bg-[#F3EEE7] px-3 py-1.5 text-[13px] font-semibold capitalize text-[#6E665C]"
                        >
                          {topic}
                          <button
                            type="button"
                            onClick={() => removeTopic(topic)}
                            aria-label={`Fjern ${topic}`}
                            className="cursor-pointer text-[#A89F94] hover:text-[#E63946]"
                          >
                            ×
                          </button>
                        </span>
                      ))}

                    <input
                      type="text"
                      value={topicInput}
                      onChange={(e) => setTopicInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === ",") {
                          e.preventDefault();
                          addTopic();
                        }
                      }}
                      onBlur={addTopic}
                      placeholder="+ Tilføj emne"
                      className="min-w-[110px] flex-1 rounded-full border border-dashed border-[#D9D0C3] bg-transparent px-3 py-2 text-[13px] font-semibold outline-none placeholder:text-[#A89F94] focus:border-[#E63946]"
                    />
                  </div>
                </div>

                <label htmlFor="bio" className={labelClass}>
                  Bio
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    maxLength={280}
                    className={`${fieldClass} min-h-28 resize-y`}
                  />
                  <span className="mt-1 block text-right text-[12px] font-semibold text-[#A89F94]">
                    {formData.bio.length} / 280
                  </span>
                </label>
              </div>
            </section>
          </div>
          <div className="fixed inset-x-0 bottom-0 z-100 flex gap-3 border-t border-[#EAE3D8] bg-white px-4 py-3 sm:hidden">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 cursor-pointer rounded-[13px] border border-[#EAE3D8] bg-white px-5 py-3 text-sm font-extrabold text-[#6E665C] transition hover:bg-[#FBF7F1] focus:outline-none focus:ring-4 focus:ring-[#FDEAEC] active:translate-y-px"
            >
              Annuller
            </button>

            <button
              type="submit"
              className="flex-1 cursor-pointer rounded-[13px] bg-[#E63946] px-5 py-3 text-sm font-extrabold text-white shadow-[0_14px_24px_-12px_rgba(230,57,70,0.75)] transition hover:bg-[#D62F3C] focus:outline-none focus:ring-4 focus:ring-[#FAD2D5] active:translate-y-px"
            >
              Gem profil
            </button>
          </div>
        </form>
      )}
    </main>
  );
}

export default MyProfile;
