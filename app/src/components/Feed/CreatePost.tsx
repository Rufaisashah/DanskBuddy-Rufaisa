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
    <div className="top-20 bg-white rounded-2xl shadow-card p-4 lg:p-6">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 lg:w-[52px] lg:h-[52px] rounded-full text-white flex items-center justify-center font-semibold text-sm shrink-0"
          style={{ background: "#9B7EDE" }}
        >
          {initials}
        </div>
        <input
          value={text}
          placeholder="Del noget på dansk…"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          className="flex-1 h-[44px] lg:h-[52px] rounded-full bg-white font-semibold border-none outline-none px-4 lg:px-5 text-sm lg:text-[0.95rem] text-foreground placeholder:text-neutral-light"
        />
        <button
          onClick={submit}
          className="h-[44px] lg:h-[52px] px-4 lg:px-6 rounded-full bg-primary text-white font-semibold text-sm border-none cursor-pointer hover:bg-primary-dark transition-colors whitespace-nowrap"
        >
          Slå op
        </button>
      </div>
    </div>
  );
}
