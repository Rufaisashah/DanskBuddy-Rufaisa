import { useState } from "react";
import { translateMessage } from "../../utils/translateMessage";

export default function MessageBubble({ message, isMine }) {
  const [isTranslated, setIsTranslated] = useState(false);
  const [translatedText, setTranslatedText] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleTranslate() {
    if (translatedText) {
      setIsTranslated(true);
      return;
    }
    setIsLoading(true);
    try {
      const translated = await translateMessage(message.text);
      setTranslatedText(translated);
      setIsTranslated(true);
    } catch (err) {
      console.error("Translation failed:", err);
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

      <button
        onClick={isTranslated ? handleShowOriginal : handleTranslate}
        className="text-[#E63946] text-xs mt-1 font-medium hover:underline"
      >
        {isLoading
          ? "Oversætter..."
          : isTranslated
            ? "Vis original"
            : "Vis oversættelse"}
      </button>
    </div>
  );
}
