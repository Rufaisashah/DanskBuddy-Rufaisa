import { useState } from "react";
import { translateMessage } from "../../utils/translateMessage";

function formatMessageTime(date) {
  const messageDate = new Date(date);
  const now = new Date();
  const isToday = messageDate.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = messageDate.toDateString() === yesterday.toDateString();

  const time = messageDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isToday) return time;
  if (isYesterday) return `I går ${time}`;
  return messageDate.toLocaleDateString([], { day: "2-digit", month: "short" });
}

export default function MessageBubble({ message, isMine }) {
  const [isTranslated, setIsTranslated] = useState(false);
  const [translatedText, setTranslatedText] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleTranslate() {
    if (translatedText) {
      setIsTranslated(true);
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const translated = await translateMessage(message.text);
      setTranslatedText(translated);
      setIsTranslated(true);
    } catch (err) {
      console.error("Translation failed:", err);
      setError("Oversættelse mislykkedes");
    } finally {
      setIsLoading(false);
    }
  }

  function handleShowOriginal() {
    setIsTranslated(false);
  }

  return (
    <div
      className={
        isMine ? "flex flex-col items-end" : "flex flex-col items-start"
      }
    >
      <div
        className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm ${
          isMine
            ? "bg-[#E63946] text-white"
            : "bg-white text-gray-800 shadow-sm"
        }`}
      >
        {isTranslated ? translatedText : message?.text}
      </div>

      <div className="flex items-center gap-2 mt-1">
        {message?.createdAt && (
          <span className="text-xs opacity-60">
            {formatMessageTime(message.createdAt)}
          </span>
        )}
        <button
          onClick={isTranslated ? handleShowOriginal : handleTranslate}
          disabled={isLoading}
          className="text-[#E63946] text-xs font-medium hover:underline"
        >
          {isLoading
            ? "Oversætter..."
            : isTranslated
              ? "Vis original"
              : "Vis oversættelse"}
        </button>
      </div>

      {error && (
        <p className="text-red-500 text-xs mt-1">Oversættelse mislykkedes</p>
      )}
    </div>
  );
}
