export const AVATAR_COLORS = [
  "#E07A5F",
  "#5B8DEF",
  "#9B7EDE",
  "#E8836B",
  "#4FB286",
  "#C97F35",
];

export function colorFor(id) {
  let hash = 0;
  for (const c of String(id)) hash = c.charCodeAt(0) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function initials(name) {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
