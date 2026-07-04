import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../Shared/Avatar";
import LevelBadge from "../Shared/LevelBadge";
import { MessageCircle } from "lucide-react";
import type { Post } from "./Post";

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
  const { toggleLike, addComment, users } = useApp() as any;
  const { user } = useAuth() as any;
  const author = users.find((u: any) => String(u.id) === String(post.authorId));
  const [text, setText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [showLikes, setShowLikes] = useState(false);

  const liked = user && post.likes.includes(user.id);
  const likedUsers = post.likes
    .map((id) => users.find((u: any) => String(u.id) === String(id)))
    .filter(Boolean);

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
      className="bg-white rounded-2xl shadow-card p-6 w-full transition-shadow duration-300"
    >
      {/* Author row */}
      <div className="flex items-center gap-4 mb-3">
        <Avatar initials={authorInitials} size="lg" />
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <h4 className="m-0 text-[0.95rem] font-bold text-foreground">
              {post.authorName}
            </h4>
            <LevelBadge level={author?.danishLevel ?? "native"} />
          </div>
          <span className="text-[0.8rem] text-neutral">
            {timeAgo(post.createdAt)}
          </span>
        </div>
      </div>

      {/* Content */}
      <p className="text-[0.95rem] text-foreground leading-relaxed mb-5 mt-2">
        {post.content}
      </p>

      {/* Divider */}
      <div className="border-t border-surface" />

      {/* Actions */}
      <div className="flex items-center gap-6 py-3">
        {/* Like */}
        <div className="relative">
          <button
            onClick={() => user && toggleLike(post.id, user.id)}
            onMouseEnter={() => setShowLikes(true)}
            onMouseLeave={() => setShowLikes(false)}
            className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer text-[0.9rem] p-0"
            style={{
              color: liked ? "var(--color-primary)" : "var(--color-neutral)",
              fontWeight: liked ? 600 : 400,
            }}
          >
            {liked ? "❤️" : "♡"} {post.likes.length}
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
                      .map((p: string) => p[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <span className="text-[0.85rem] font-medium text-foreground">
                    {u.name.split(" ")[0]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comments toggle */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer text-[0.9rem] p-0"
          style={{
            color: showComments
              ? "var(--color-foreground)"
              : "var(--color-neutral)",
          }}
        >
          <MessageCircle size={18} strokeWidth={2} />
          {post.comments?.length ?? 0}
        </button>

        {/* Translate */}
        <button className="flex items-center gap-1.5 bg-transparent  text-primary font-bold  border-none cursor-pointer text-[0.85rem] text-neutral p-0">
          🌐 Oversæt
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="border-t border-surface pt-4 mt-1">
          {/* Comment input */}
          <div className="flex gap-2.5 mb-4">
            <input
              value={text}
              placeholder="Skriv en kommentar…"
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleComment();
              }}
              className="flex-1 h-[46px] rounded-full bg-white border-none outline-none px-4 text-[0.9rem] text-foreground placeholder:text-neutral-light"
            />
            <button
              onClick={handleComment}
              className="h-[46px] px-5 rounded-full bg-primary text-white text-[0.85rem] font-semibold border-none cursor-pointer hover:bg-primary-dark transition-colors"
            >
              Send
            </button>
          </div>

          {/* Comment list */}
          <div className="flex flex-col gap-3">
            {post.comments?.length === 0 && (
              <p className="text-[0.85rem] text-neutral-light">
                Ingen kommentarer endnu
              </p>
            )}
            {post.comments?.map((comment: any) => (
              <div key={comment.id} className="flex items-start gap-2.5">
                <div
                  className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-white text-[0.7rem] font-semibold shrink-0"
                  style={{ background: avatarColor(comment.authorId) }}
                >
                  {comment.authorName
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
                <div className="bg-background rounded-2xl px-4 py-2 max-w-[80%]">
                  <p className="text-[0.8rem] font-semibold m-0 mb-0.5 text-foreground">
                    {comment.authorName}
                  </p>
                  <p className="text-[0.85rem] m-0 text-neutral">
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
