import { useMemo, useState } from "react";
import { useApp } from "../../context/AppContext";
import TopBar from "./TopBar";
import CreatePost from "./CreatePost";
import PostCard from "./PostCard";
import RightPanel from "./RightPanel";
import type { Post } from "./Post";

export default function FeedPage() {
  const { posts } = useApp() as { posts: Post[] };
  const [search, setSearch] = useState("");

  const filteredPosts = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return posts;
    return posts.filter(
      (post) =>
        post.content.toLowerCase().includes(value) ||
        post.authorName.toLowerCase().includes(value)
    );
  }, [posts, search]);

  return (
    <div className="fixed inset-0 md:left-64 flex flex-col bg-white md:bg-[#FAF6F0]">
      <TopBar onSearch={setSearch} />

      {/* Mobile — everything scrolls */}
      <div className="flex flex-1 min-h-0 md:hidden overflow-y-auto flex-col px-4 pt-4 pb-20 bg-white">
        <div className="mb-4">
          <CreatePost />
        </div>
        <div className="flex flex-col gap-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="bg-white rounded-2xl shadow-card p-10 text-center">
              <p className="text-neutral">Ingen opslag fundet</p>
            </div>
          )}
        </div>
      </div>

      {/* Desktop — only posts scroll */}
      <div className="hidden md:flex flex-1 min-h-0 pt-[30px]">
        <div className="flex flex-col flex-1 min-w-0 min-h-0">
          <div className="shrink-0 px-8 pb-4 bg-[#FAF6F0]">
            <CreatePost />
          </div>
          <div className="flex-1 overflow-y-auto px-8 pb-8">
            <div className="flex flex-col gap-4">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))
              ) : (
                <div className="bg-white rounded-2xl shadow-card p-10 text-center">
                  <p className="text-neutral">Ingen opslag fundet</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <aside className="hidden lg:flex flex-col w-[320px] shrink-0 overflow-y-auto px-6 pt-4 pb-4 bg-[#FAF6F0]">
          <RightPanel />
        </aside>
      </div>
    </div>
  );
}
