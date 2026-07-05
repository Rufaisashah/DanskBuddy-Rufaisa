import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";

interface User {
  id: string | number;
  name: string;
}

export default function CreatePost() {
  const { createPost } = useApp() as {
    createPost: (id: string, name: string, content: string) => void;
  };
  const { user } = useAuth() as { user: User | null };
  const [text, setText] = useState("");

  function submit() {
    if (!user) return;
    const value = text.trim();
    if (!value) return;
    createPost(String(user.id), user.name, value);
    setText("");
  }

  const initials =
    user?.name
      ?.split(" ")
      .map((p: string) => p.charAt(0))
      .join("")
      .toUpperCase() ?? "?";

  return (
    <div className="bg-white rounded-2xl border border-neutral-300/80 md:border-none shadow-card md:shadow-none p-4 lg:p-6 w-full">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 lg:w-[52px] lg:h-[52px] rounded-full text-white flex items-center justify-center font-semibold text-sm shrink-0"
          style={{ background: "#9B7EDE" }}
        >
          {initials}
        </div>

        <div className="flex-1 flex items-center relative h-[44px] lg:h-[52px] border border-neutral-300/80 md:border-none rounded-full px-4 lg:px-5 bg-white">
          <input
            value={text}
            placeholder="Del noget på dansk…"
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            className="w-full h-full bg-transparent font-semibold border-none outline-none text-sm lg:text-[0.95rem] text-foreground placeholder:text-neutral-400"
          />

          <button
            type="button"
            className="md:hidden absolute right-3 text-rose-400 p-1"
            aria-label="Tilføj billede"
          >
            <svg
              xmlns="http://w3.org"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </button>
        </div>

        <button
          onClick={submit}
          className="hidden md:block h-[44px] lg:h-[52px] px-4 lg:px-6 rounded-full bg-primary text-white font-semibold text-sm border-none cursor-pointer hover:bg-primary-dark transition-colors whitespace-nowrap"
        >
          Slå op
        </button>
      </div>
    </div>
  );
}
