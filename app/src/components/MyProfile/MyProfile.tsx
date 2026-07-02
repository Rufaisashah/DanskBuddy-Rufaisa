import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Avatar from "../Shared/Avatar";
import StyledDropdown from "../Shared/StyledDropdown";

import { useAuth } from "../../context/AuthContext";

type UserRole = "learner" | "native" | "both";

type ProfileUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar: string;
  city: string;
  danishLevel: string;
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

type ProfileFormData = {
  avatar: string;
  name: string;
  email: string;
  role: UserRole;
  city: string;
  danishLevel: string;
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

const roleOptions: SelectOption<UserRole>[] = [
  { value: "learner", label: "Learner" },
  { value: "native", label: "Native speaker" },
  { value: "both", label: "Both" },
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

const danishLevelOptions: SelectOption[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "native", label: "Native" },
];

const availabilityOptions: SelectOption[] = [
  { value: "weekends", label: "Weekends" },
  { value: "evenings", label: "Evenings" },
  { value: "weekdays", label: "Weekdays" },
  { value: "mornings", label: "Mornings" },
  { value: "flexible", label: "Flexible" },
];

const fieldClass =
  "mt-2 w-full rounded-2xl border border-[#ECE6DD] bg-white px-4 py-3.5 text-[15px] font-semibold text-[#2B2A28] outline-none transition placeholder:text-[#A89F94] focus:border-[#E63946] focus:ring-4 focus:ring-[#FDEAEC]";

const labelClass =
  "block text-[12px] font-extrabold tracking-[-0.01em] text-[#6E665C]";

const readOnlyValueClass =
  "text-[15px] font-semibold leading-relaxed text-[#2B2A28]";

const readOnlyRowClass = "flex flex-wrap items-baseline gap-x-2 gap-y-1";

function getFormDataFromUser(user: ProfileUser): ProfileFormData {
  return {
    avatar: user.avatar ?? "",
    name: user.name ?? "",
    email: user.email ?? "",
    role: user.role ?? "learner",
    city: user.city ?? "",
    danishLevel: user.danishLevel ?? "",
    nativeLanguage: user.nativeLanguage ?? "",
    learningGoals: user.learningGoals ?? "",
    interests: user.interests?.join(", ") ?? "",
    availability: user.availability?.[0] ?? "",
    bio: user.bio ?? "",
  };
}

function getOptionsWithCurrentValue(options: SelectOption[], value: string) {
  if (!value || options.some((option) => option.value === value)) {
    return options;
  }

  return [{ value, label: value }, ...options];
}

function getRoleLabel(role: UserRole) {
  return roleOptions.find((option) => option.value === role)?.label ?? role;
}

function getOptionLabel(options: SelectOption[], value: string) {
  return getOptionsWithCurrentValue(options, value).find(
    (option) => option.value === value
  )?.label;
}

function getAvailabilityLabel(value: string) {
  return getOptionLabel(availabilityOptions, value) || value;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function MyProfile() {
  const { user, updateUser } = useAuth() as AuthContextValue;

  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [openDropdown, setOpenDropdown] = useState<DropdownName | "">("");

  const [formData, setFormData] = useState<ProfileFormData>({
    avatar: "",
    name: "",
    email: "",
    role: "learner",
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

  if (!user) {
    return null;
  }

  const currentUser = user;

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
      <div className="mx-auto w-full max-w-[520px]">
        <h1 className="text-[28px] font-extrabold leading-tight tracking-[-0.02em] text-[#161616]">
          My Profile
        </h1>

        {message && (
          <p className="mt-5 rounded-2xl border border-[#D7EFE2] bg-success-light px-4 py-3 text-sm font-bold text-success-dark">
            {message}
          </p>
        )}
      </div>

      {!isEditing ? (
        <section className="mx-auto mt-8 w-full max-w-[520px] rounded-[18px] border border-[#EAE3D8] bg-white p-5 shadow-[0_32px_64px_-24px_rgba(33,30,28,0.40),0_8px_20px_-12px_rgba(33,30,28,0.28)] sm:p-8">
          <div className="space-y-5">
            <div className="rounded-full border-4 border-white shadow-[0_12px_24px_-16px_rgba(33,30,28,0.55)]">
              <Avatar
                initials={getInitials(currentUser.name)}
                size="profile"
                color="#9B77E5"
              />
            </div>
            <div className={readOnlyRowClass}>
              <span className={labelClass}>Name:</span>
              <p className={readOnlyValueClass}>{currentUser.name}</p>
            </div>

            <div className={readOnlyRowClass}>
              <span className={labelClass}>Email:</span>
              <p className={readOnlyValueClass}>{currentUser.email}</p>
            </div>

            <div className={readOnlyRowClass}>
              <span className={labelClass}>Role:</span>
              <p className={readOnlyValueClass}>
                {getRoleLabel(currentUser.role)}
              </p>
            </div>

            <div className={readOnlyRowClass}>
              <span className={labelClass}>City:</span>
              <p className={readOnlyValueClass}>{currentUser.city}</p>
            </div>

            <div className={readOnlyRowClass}>
              <span className={labelClass}>Danish level:</span>
              <p className={readOnlyValueClass}>
                {getOptionLabel(danishLevelOptions, currentUser.danishLevel) ||
                  currentUser.danishLevel}
              </p>
            </div>

            <div className={readOnlyRowClass}>
              <span className={labelClass}>Native language:</span>
              <p className={readOnlyValueClass}>{currentUser.nativeLanguage}</p>
            </div>

            <div className={readOnlyRowClass}>
              <span className={labelClass}>Learning goals:</span>
              <p className={readOnlyValueClass}>{currentUser.learningGoals}</p>
            </div>

            <div className={readOnlyRowClass}>
              <span className={labelClass}>Interests:</span>
              <p className={readOnlyValueClass}>
                {currentUser.interests && currentUser.interests.length > 0
                  ? currentUser.interests.join(", ")
                  : "No interests added"}
              </p>
            </div>

            <div className={readOnlyRowClass}>
              <span className={labelClass}>Availability:</span>
              <p className={readOnlyValueClass}>
                {currentUser.availability && currentUser.availability.length > 0
                  ? currentUser.availability
                      .map(getAvailabilityLabel)
                      .join(", ")
                  : "No availability added"}
              </p>
            </div>

            <div className={readOnlyRowClass}>
              <span className={labelClass}>Bio:</span>
              <p className={`${readOnlyValueClass} whitespace-pre-wrap`}>
                {currentUser.bio}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleEdit}
            className="mt-7 w-full cursor-pointer rounded-full bg-[#E63946] px-6 py-3.5 text-[15px] font-extrabold text-white shadow-[0_14px_24px_-12px_rgba(230,57,70,0.75)] transition hover:bg-[#D62F3C] focus:outline-none focus:ring-4 focus:ring-[#FAD2D5] active:translate-y-px"
          >
            Edit profile
          </button>
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
                  const isSelected = formData.role === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => handleRoleChange(option.value)}
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
