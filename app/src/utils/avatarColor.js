// Assigns a consistent color to each user based on their ID.
// Same user always gets the same color across the whole app.

const COLORS = [
  "#F59E0B",
  "#38BDF8",
  "#9B7EDE",
  "#34C77B",
  "#F4A261",
  "#E63946",
];

export function avatarColor(id) {
  if (id === undefined || id === null || id === "") {
    return COLORS[0];
  }

  let hash = 0;
  const str = String(id);
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}
