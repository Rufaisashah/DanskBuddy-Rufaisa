export function getInitials(name) {
  if (!name || typeof name !== "string") {
    return "?";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
