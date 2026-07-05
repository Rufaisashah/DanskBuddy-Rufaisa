import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../Shared/Avatar";
import LevelBadge from "../Shared/LevelBadge";
import { MessageCircle, Trash2 } from "lucide-react";
import type { Post } from "./Post";
import { translateMessage } from "../../utils/translateMessage";

interface Props {
  post: Post;
}
const AVATAR_COLORS = [
  "#9B7EDE",
  "#F59E0B",
  "#38BDF8",
  "#34C77B",
  "#F4A261",
  "#E63946",
];

function avatarColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++)
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function timeAgo(date: string) {
  const diffDays = Math.floor(
    (Date.now() - new Date(date).getTime()) / 86400000
  );
  if (diffDays === 0) return "i dag";
  if (diffDays === 1) return "for 1 dag siden";
  if (diffDays < 30) return `for ${diffDays}t siden`;
  const m = Math.floor(diffDays / 30);
  return m === 1 ? "for 1 måned siden" : `for ${m} måneder siden`;
}
export default function PostCard({ post }: Props) {
  const { toggleLike, addComment, users, deletePost } = useApp() as any;
  const { user } = useAuth() as any;
  const author = users.find((u: any) => String(u.id) === String(post.authorId));
  const [text, setText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [showLikes, setShowLikes] = useState(false);

  // Translation States
  const [isTranslated, setIsTranslated] = useState(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const liked = user && post.likes.includes(user.id);
  const likedUsers = post.likes
    .map((id) => users.find((u: any) => String(u.id) === String(id)))
    .filter(Boolean);

  // Global Click-Away Error Listener
  useEffect(() => {
    if (!error) return;

    const handleGlobalClick = () => {
      setError(null);
    };

    const timeoutId = setTimeout(() => {
      window.addEventListener("click", handleGlobalClick);
    }, 10);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("click", handleGlobalClick);
    };
  }, [error]);

  async function handleTranslate() {
    if (translatedText) {
      setIsTranslated(true);
      setError(null);
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const translated = await translateMessage(post.content);
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
    setError(null);
  }

  function handleComment() {
    const value = text.trim();
    if (!value || !user) return;
    addComment(post.id, {
      id: String(Date.now()),
      authorId: user.id,
      authorName: user.name,
      text: value,
      createdAt: new Date().toISOString(),
    });
    setText("");
  }

  const authorInitials = post.authorName
    .split(" ")
    .map((p) => p.charAt(0))
    .join("")
    .toUpperCase();
  return (
    <article
      id={`post-${post.id}`}
      className="bg-white rounded-3xl border border-surface p-5 w-full transition-shadow duration-300"
    >
      {/* Author row */}
      <div className="flex items-center gap-3 mb-3">
        <Avatar initials={authorInitials} size="lg" />
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <h4 className="m-0 text-[0.95rem] font-bold text-foreground">
              {post.authorName}
            </h4>
            <LevelBadge level={author?.danishLevel ?? "native"} />
          </div>
          <span className="text-[0.8rem] text-neutral-400 font-medium">
            {timeAgo(post.createdAt)}
          </span>
        </div>
        {user && String(user.id) === String(post.authorId) && (
          <button
            onClick={() => deletePost(post.id, user.id)}
            className="ml-auto bg-transparent border-none cursor-pointer text-neutral-300 hover:text-red-500 transition-colors p-1"
            aria-label="Delete post"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Content */}
      <p className="text-[0.95rem] text-foreground leading-relaxed font-medium mb-5 mt-2">
        {isTranslated ? translatedText : post.content}
      </p>

      {/* Actions */}
      <div className="flex items-center justify-between py-1 text-neutral-400">
        <div className="flex items-center gap-6">
          {/* Like */}
          <div className="relative">
            <button
              onClick={() => user && toggleLike(post.id, user.id)}
              onMouseEnter={() => setShowLikes(true)}
              onMouseLeave={() => setShowLikes(false)}
              className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer text-sm font-semibold p-0 text-neutral-400 hover:text-neutral-600 transition-colors"
              style={{
                color: liked ? "#EA4C61" : undefined,
              }}
            >
              <svg
                xmlns="http://w3.org"
                fill={liked ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
              <span>{post.likes.length}</span>
            </button>

            {/* Likes tooltip */}
            {showLikes && likedUsers.length > 0 && (
              <div
                onMouseEnter={() => setShowLikes(true)}
                onMouseLeave={() => setShowLikes(false)}
                className="absolute bottom-9 left-0 bg-white rounded-xl shadow-elevated flex flex-col gap-2 p-3 min-w-[160px] z-20"
              >
                {likedUsers.map((u: any) => (
                  <div key={u.id} className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[0.7rem] font-semibold shrink-0"
                      style={{ background: avatarColor(String(u.id)) }}
                    >
                      {u.name
                        .split(" ")
                        .map((p: string) => p)
                        .join("")
                        .toUpperCase()}
                    </div>
                    <span className="text-[0.85rem] font-medium text-foreground">
                      {u.name.split(" ")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Comments toggle */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer text-sm font-semibold p-0 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <MessageCircle size={19} strokeWidth={2} />
            <span>{post.comments?.length ?? 0}</span>
          </button>
        </div>

        {/* Translate block with click event isolation container */}
        <div onClick={(e) => e.stopPropagation()}>
          <button
            onClick={isTranslated ? handleShowOriginal : handleTranslate}
            disabled={isLoading}
            className="flex items-center gap-1 bg-transparent text-[#EA4C61] hover:text-rose-600 font-bold border-none cursor-pointer text-sm p-0 transition-colors disabled:opacity-50"
          >
            <span className="text-[11px] font-medium opacity-80">文A</span>{" "}
            {isLoading
              ? "Oversætter..."
              : isTranslated
                ? "Vis original"
                : "Oversæt"}
          </button>
        </div>
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-2 block text-right">{error}</p>
      )}

      {/* Comments section */}
      {showComments && (
        <div className="border-t border-neutral-100 pt-4 mt-3">
          {/* Comment input */}
          <div className="flex gap-2.5 mb-4">
            <input
              value={text}
              placeholder="Skriv en kommentar…"
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleComment();
              }}
              className="flex-1 h-[42px] rounded-full bg-neutral-50 border border-neutral-100 outline-none px-4 text-[0.9rem] text-foreground placeholder:text-neutral-400"
            />
            <button
              onClick={handleComment}
              className="h-[42px] px-5 rounded-full bg-[#EA4C61] text-white text-sm font-semibold border-none cursor-pointer hover:bg-opacity-90 transition-all"
            >
              Send
            </button>
          </div>

          {/* Comment list */}
          <div className="flex flex-col gap-3">
            {post.comments?.length === 0 && (
              <p className="text-[0.85rem] text-neutral-400">
                Ingen kommentarer endnu
              </p>
            )}
            {post.comments?.map((comment: any) => (
              <div key={comment.id} className="flex items-start gap-2.5">
                <div
                  className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-white text-[0.7rem] font-semibold shrink-0"
                  style={{ background: avatarColor(String(comment.authorId)) }}
                >
                  {comment.authorName
                    .split(" ")
                    .map((p: string) => p)
                    .join("")
                    .toUpperCase()}
                </div>
                <div className="flex flex-col bg-neutral-50 rounded-2xl px-3.5 py-2 max-w-[85%]">
                  <span className="text-[0.8rem] font-bold text-foreground mb-0.5">
                    {comment.authorName}
                  </span>
                  <p className="text-[0.85rem] text-gray-700 leading-normal m-0 font-medium">
                    {comment.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
