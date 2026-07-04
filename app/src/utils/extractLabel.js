export function extractLabel(value, fallback = "") {
  if (value == null) return fallback;
  if (typeof value === "string" || typeof value === "number") return value;
  if (typeof value === "object") {
    if (typeof value.label === "string") return value.label;
    if (typeof value.value === "string") return value.value;
  }
  return fallback;
}