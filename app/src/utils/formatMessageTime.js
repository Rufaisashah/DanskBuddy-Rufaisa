export function formatMessageTime(dateStr) {
  if (!dateStr) return "";

  const date = new Date(dateStr);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const isYesterday = date.toDateString() === yesterday.toDateString();

  const time = date.toLocaleTimeString("da-DK", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isToday) return time;
  if (isYesterday) return `I går ${time}`;

  return date.toLocaleDateString("da-DK", {
    day: "2-digit",
    month: "short",
  });
}
