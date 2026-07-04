import { useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import type { Post } from "./Post";

export interface Notification {
  id: string;
  type: "like" | "comment";
  postId: string;
  postSnippet: string;
  actorName: string;
  createdAt: string;
}

export function useNotifications(): Notification[] {
  const { posts, users } = useApp() as { posts: Post[]; users: any[] };
  const { user } = useAuth() as { user: any };

  return useMemo(() => {
    if (!user) return [];

    const notifications: Notification[] = [];

    posts
      .filter((post) => String(post.authorId) === String(user.id))
      .forEach((post) => {
        post.likes.forEach((likerId) => {
          if (String(likerId) === String(user.id)) return;
          const actor = users.find((u) => String(u.id) === String(likerId));
          if (!actor) return;
          notifications.push({
            id: `like-${post.id}-${likerId}`,
            type: "like",
            postId: post.id,
            postSnippet: post.content.slice(0, 40),
            actorName: actor.name,
            createdAt: post.createdAt,
          });
        });

        post.comments?.forEach((comment: any) => {
          if (String(comment.authorId) === String(user.id)) return;
          notifications.push({
            id: `comment-${comment.id}`,
            type: "comment",
            postId: post.id,
            postSnippet: post.content.slice(0, 40),
            actorName: comment.authorName,
            createdAt: comment.createdAt,
          });
        });
      });

    return notifications.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [posts, users, user]);
}
