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
    <div className="flex flex-col bg-white md:bg-[#FAF6F0] min-h-full -m-6 md:-m-8">
      <TopBar onSearch={setSearch} />

      {/* FIXED: Sets a stable wrapper layout with uniform padding tracks */}
      <div className="w-full max-w-[1240px] mx-auto px-4 md:px-6 md:pr-6 mt-4 md:mt-6">
        {/* FIXED: Replaced standard flex rows with a balanced grid to guarantee equal spacing tracks */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start w-full">
          {/* Feed column */}
          <div className="flex flex-col flex-1 min-w-0 px-0 pb-20 gap-4">
            <CreatePost />
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            ) : (
              <div className="bg-white rounded-2xl shadow-card p-10 text-center border border-surface">
                <p className="text-neutral">Ingen opslag fundet</p>
              </div>
            )}
          </div>

          {/* Right panel — sticky */}
          <aside className="hidden lg:block w-full">
            <div className="sticky top-[100px] flex flex-col gap-4 w-full">
              <RightPanel />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
