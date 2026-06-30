import { useState } from "react";
import { translateMessage } from "../../utils/translateMessage";
import { formatMessageTime } from "../../utils/formatMessageTime";

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
        <div>{isTranslated ? translatedText : message?.text}</div>

        {message?.createdAt && (
          <span className="text-xs opacity-60">
            {formatMessageTime(message.createdAt)}
          </span>
        )}
      </div>
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

      {error && (
        <p className="text-red-500 text-xs mt-1 block mt-1">
          Oversættelse mislykkedes
        </p>
      )}
    </div>
  );
}
