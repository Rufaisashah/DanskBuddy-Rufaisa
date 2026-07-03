export type UserRole = {
  value: "learner" | "native";
  label: "Lærer dansk" | "Taler dansk";
};

export type DanishLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type User = {
  id: string;
  email?: string;
  name: string;
  avatar?: string;
  city?: string;
  role?: UserRole;
  danishLevel?: string;
  nativeLanguage?: string;
  learningGoals?: string[];
  interests?: string[];
  availability?: string[];
  bio?: string;
  createdAt?: string;
};

export type MatchStatus = "pending" | "accepted" | "declined";

export type Match = {
  id: string;
  requesterId: string;
  receiverId: string;
  status: MatchStatus;
  createdAt: string;
};

export type SendMatchResult =
  | {
      success: true;
      match: Match;
    }
  | {
      success: false;
      error: string;
    };
