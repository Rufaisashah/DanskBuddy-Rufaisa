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
        className={`px-4 pt-2.5 pb-2 max-w-[70%] text-sm ${
          isMine
            ? "bg-[#E63946] text-white rounded-t-2xl rounded-bl-2xl rounded-br-sm"
            : "bg-white text-gray-800 shadow-sm rounded-t-2xl rounded-br-2xl rounded-bl-sm"
        }`}
      >
        <div className="pr-2">
          {isTranslated ? translatedText : message?.text}
        </div>

        {message?.createdAt && (
          <div
            className={`text-[11px] text-right mt-1 ${
              isMine ? "text-white/70" : "text-gray-400"
            }`}
          >
            {formatMessageTime(message.createdAt)}
          </div>
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
