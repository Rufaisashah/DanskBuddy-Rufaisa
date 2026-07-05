import type { Match } from "../types/types";

export function findMatchBetweenUsers(
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

export function getConnectButtonLabel(match: Match | undefined) {
  if (!match) {
    return "Connect";
  }

  if (match.status === "pending") {
    return "Pending";
  }

  if (match.status === "accepted") {
    return "Connect";
  }

  return "Connect";
}
