import { useState, useMemo } from "react";
import type { ChangeEvent } from "react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import ProfileCard from "../ProfileCard/ProfileCard";
import type { ProfileCardUser } from "../ProfileCard/ProfileCard";
import EmptyState from "../Shared/EmptyState";
import StyledDropdown, { type SelectOption } from "../Shared/StyledDropdown";
import type { User } from "../../types/types";

type SendMatchResult =
  | {
      success: true;
      match: Match;
    }
  | {
      success: false;
      error: string;
    };

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

type FilterName = "city" | "role" | "danishLevel" | "availability";

type MatchStatus = "pending" | "accepted" | "declined";

type Match = {
  id: string;
  requesterId: string;
  receiverId: string;
  status: MatchStatus;
  createdAt: string;
};

const allOption: SelectOption = {
  value: "all",
  label: "All",
};

const roleOptions: SelectOption[] = [
  allOption,
  { value: "learner", label: "Learner" },
  { value: "native", label: "Native speaker" },
  { value: "both", label: "Both" },
];

const danishLevelOptions: SelectOption[] = [
  allOption,
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "native", label: "Native" },
];

const availabilityOptions: SelectOption[] = [
  allOption,
  { value: "mornings", label: "Mornings" },
  { value: "evenings", label: "Evenings" },
  { value: "weekends", label: "Weekends" },
  { value: "flexible", label: "Flexible" },
];

const labelClass =
  "block text-[12px] font-extrabold tracking-[-0.01em] text-[#6E665C]";

const inputClass =
  "mt-2 w-full rounded-2xl border border-[#ECE6DD] bg-white px-4 py-3.5 text-[15px] font-semibold text-[#2B2A28] outline-none transition placeholder:text-[#A89F94] focus:border-[#E63946] focus:ring-4 focus:ring-[#FDEAEC]";

function getCityOptions(users: User[]): SelectOption[] {
  const cities = users
    .map((user) => user.city)
    .filter((city): city is string => Boolean(city));

  const uniqueCities = Array.from(new Set(cities)).sort();

  return [
    allOption,
    ...uniqueCities.map((city) => ({
      value: city,
      label: city,
    })),
  ];
}

function isCurrentUser(profileUser: User, currentUser: User | null) {
  if (!currentUser) {
    return false;
  }

  return String(profileUser.id) === String(currentUser.id);
}

function matchesSearch(user: User, searchTerm: string) {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  if (!normalizedSearch) {
    return true;
  }

  const name = user.name.toLowerCase();
  const topics = user.topics ?? [];

  const topicMatches = topics.some((topic) =>
    topic.toLowerCase().includes(normalizedSearch)
  );

  return name.includes(normalizedSearch) || topicMatches;
}

function matchesFilter(userValue: string | undefined, selectedValue: string) {
  if (selectedValue === "all") {
    return true;
  }

  return userValue === selectedValue;
}

function matchesArrayFilter(
  userValues: string[] | undefined,
  selectedValue: string
) {
  if (selectedValue === "all") {
    return true;
  }

  if (!userValues) {
    return false;
  }

  return userValues.includes(selectedValue);
}

function toProfileCardUser(user: User): ProfileCardUser {
  return {
    id: user.id,
    name: user.name,
    avatar: user.avatar ?? "",
    city: user.city ?? "Unknown city",
    role: user.role?.value ?? "learner",
    danishLevel: user.danishLevel ?? "Not selected",
    interests: user.topics ?? [],
    bio: user.bio ?? "No bio yet.",
  };
}

function findMatchBetweenUsers(
  matches: Match[],
  currentUserId: string,
  profileUserId: string
) {
  return matches.find(
    (match) =>
      (match.requesterId === currentUserId &&
        match.receiverId === profileUserId) ||
      (match.requesterId === profileUserId &&
        match.receiverId === currentUserId)
  );
}

function getConnectButtonState(match: Match | undefined) {
  if (!match) {
    return {
      label: "Connect",
      disabled: false,
    };
  }

  if (match.status === "pending") {
    return {
      label: "Pending",
      disabled: true,
    };
  }

  if (match.status === "accepted") {
    return {
      label: "Connected",
      disabled: true,
    };
  }

  return {
    label: "Connect",
    disabled: false,
  };
}

function BrowsePage() {
  const { users, matches, sendMatchRequest } = useApp() as AppContextValue;
  const { user: currentUser } = useAuth() as AuthContextValue;

  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [danishLevelFilter, setDanishLevelFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [openDropdown, setOpenDropdown] = useState<FilterName | "">("");

  const availableUsers = useMemo(() => {
    return users.filter(
      (profileUser) => !isCurrentUser(profileUser, currentUser)
    );
  }, [users, currentUser]);

  const cityOptions = useMemo(() => {
    return getCityOptions(availableUsers);
  }, [availableUsers]);

  const filteredUsers = useMemo(() => {
    return availableUsers.filter((profileUser) => {
      const searchMatches = matchesSearch(profileUser, searchTerm);
      const cityMatches = matchesFilter(profileUser.city, cityFilter);
      const roleMatches = matchesFilter(profileUser.role?.value, roleFilter);
      const danishLevelMatches = matchesFilter(
        profileUser.danishLevel,
        danishLevelFilter
      );
      const availabilityMatches = matchesArrayFilter(
        profileUser.availability,
        availabilityFilter
      );

      return (
        searchMatches &&
        cityMatches &&
        roleMatches &&
        danishLevelMatches &&
        availabilityMatches
      );
    });
  }, [
    availableUsers,
    searchTerm,
    cityFilter,
    roleFilter,
    danishLevelFilter,
    availabilityFilter,
  ]);

  function handleConnect(profileUserId: string) {
    if (!currentUser) {
      return;
    }

    sendMatchRequest(currentUser.id, profileUserId);
  }

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.target.value);
  }

  function handleDropdownChange(name: FilterName, value: string) {
    switch (name) {
      case "city":
        setCityFilter(value);
        break;
      case "role":
        setRoleFilter(value);
        break;
      case "danishLevel":
        setDanishLevelFilter(value);
        break;
      case "availability":
        setAvailabilityFilter(value);
        break;
      default:
        break;
    }
    setOpenDropdown("");
  }

  function handleResetFilters() {
    setSearchTerm("");
    setCityFilter("all");
    setRoleFilter("all");
    setDanishLevelFilter("all");
    setAvailabilityFilter("all");
    setOpenDropdown("");
  }

  return (
    <main className="-m-8 min-h-[calc(100vh-8rem)] bg-background px-4 py-8 font-sans sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-6">
          <h1 className="text-[28px] font-extrabold leading-tight tracking-[-0.02em] text-[#161616]">
            Browse language partners
          </h1>
        </header>

        <section
          aria-label="Search and filter"
          className="rounded-[18px] border border-[#EAE3D8] bg-white p-5 shadow-card sm:p-6"
        >
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <label
              htmlFor="search"
              className={`${labelClass} col-span-2 lg:col-span-4`}
            >
              Search by name or topic
              <input
                type="search"
                id="search"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Example: Maja, food"
                className={inputClass}
              />
            </label>

            <label className={labelClass}>
              City
              <StyledDropdown
                name="city"
                value={cityFilter}
                options={cityOptions}
                isOpen={openDropdown === "city"}
                onToggle={() =>
                  setOpenDropdown(openDropdown === "city" ? "" : "city")
                }
                onSelect={handleDropdownChange}
                onClose={() => setOpenDropdown("")}
              />
            </label>

            <label className={labelClass}>
              Role
              <StyledDropdown
                name="role"
                value={roleFilter}
                options={roleOptions}
                isOpen={openDropdown === "role"}
                onToggle={() =>
                  setOpenDropdown(openDropdown === "role" ? "" : "role")
                }
                onSelect={handleDropdownChange}
                onClose={() => setOpenDropdown("")}
              />
            </label>

            <label className={labelClass}>
              Danish level
              <StyledDropdown
                name="danishLevel"
                value={danishLevelFilter}
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
            </label>

            <label className={labelClass}>
              Availability
              <StyledDropdown
                name="availability"
                value={availabilityFilter}
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
            </label>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={handleResetFilters}
              className="cursor-pointer rounded-full bg-[#ECE6DD] px-5 py-2.5 text-sm font-extrabold text-[#6E665C] transition hover:bg-[#F6F0E8] focus:outline-none focus:ring-4 focus:ring-[#FDEAEC] active:translate-y-px"
            >
              Reset filters
            </button>
          </div>
        </section>

        <p className="mt-4 text-sm font-semibold text-[#7C756B]">
          Showing {filteredUsers.length} of {availableUsers.length} users
        </p>

        {filteredUsers.length > 0 ? (
          <section
            aria-label="Language partners"
            className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredUsers.map((profileUser) => {
              const existingMatch = currentUser
                ? findMatchBetweenUsers(matches, currentUser.id, profileUser.id)
                : undefined;

              const buttonState = getConnectButtonState(existingMatch);

              return (
                <ProfileCard
                  key={profileUser.id}
                  user={toProfileCardUser(profileUser)}
                  showViewProfileLink
                  actions={
                    <button
                      type="button"
                      onClick={() => handleConnect(profileUser.id)}
                      disabled={buttonState.disabled}
                      className="rounded-pill bg-primary px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {buttonState.label}
                    </button>
                  }
                />
              );
            })}
          </section>
        ) : (
          <EmptyState
            title="No users found"
            message="Try changing your search or filters."
          />
        )}
      </div>
    </main>
  );
}

export default BrowsePage;
