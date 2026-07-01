import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { generateId } from "../utils/uuid";
import {
  getUsers,
  saveUsers,
  getMatches,
  saveMatches,
  getMessages,
  saveMessages,
  getPosts,
  savePosts,
} from "../utils/storage";
import { AuthProvider } from "./AuthContext";

// ─── Context ──────────────────────────────────────────────────────────────────
const AppContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AppProvider({ children }) {
  const [users, setUsers] = useState(() => getUsers());
  const [matches, setMatches] = useState(() => getMatches());
  const [messages, setMessages] = useState(() => getMessages());
  const [posts, setPosts] = useState(() => getPosts());
  const [messageReadTimestamps, setMessageReadTimestamps] = useState({});

  useEffect(() => {
    saveUsers(users);
  }, [users]);
  useEffect(() => {
    saveMatches(matches);
  }, [matches]);
  useEffect(() => {
    saveMessages(messages);
  }, [messages]);
  useEffect(() => {
    savePosts(posts);
  }, [posts]);

  // ── Sync callback for AuthContext ──────────────────────────────────────────
  // When AuthContext calls updateUser, it passes the updated user here
  // so AppContext.users state also updates — preventing desync between
  // the two contexts holding different versions of the same user object.
  const handleUpdateUser = useCallback((updatedUser) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
  }, []);

  // ── User helpers ────────────────────────────────────────────────────────────

  const registerUser = useCallback((userData) => {
    const newUser = {
      id: generateId(),
      createdAt: new Date().toISOString().split("T")[0],
      avatar: "😊",
      topics: [],
      ...userData,
    };
    setUsers((prev) => [...prev, newUser]);
    return newUser;
  }, []);

  const getUserById = useCallback(
    (id) => {
      return users.find((u) => u.id === id);
    },
    [users]
  );

  const getAllLearners = useCallback(() => {
    return users.filter((u) => u.role === "learner");
  }, [users]);

  const getAllNatives = useCallback(() => {
    return users.filter((u) => u.role === "native");
  }, [users]);

  // ── Match helpers ───────────────────────────────────────────────────────────

  const sendMatchRequest = useCallback(
    (requesterId, receiverId) => {
      const exists = matches.some(
        (m) =>
          (m.requesterId === requesterId && m.receiverId === receiverId) ||
          (m.requesterId === receiverId && m.receiverId === requesterId)
      );
      if (exists) return { success: false, error: "Already sent." };
      const match = {
        id: generateId(),
        requesterId,
        receiverId,
        status: "pending",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setMatches((prev) => [...prev, match]);
      return { success: true, match };
    },
    [matches]
  );

  const respondToMatch = useCallback((matchId, status) => {
    setMatches((prev) =>
      prev.map((m) => (m.id === matchId ? { ...m, status } : m))
    );
  }, []);

  const getMatchesForUser = useCallback(
    (userId) => {
      return matches.filter(
        (m) => m.requesterId === userId || m.receiverId === userId
      );
    },
    [matches]
  );

  const getAcceptedMatchesForUser = useCallback(
    (userId) => {
      return getMatchesForUser(userId).filter((m) => m.status === "accepted");
    },
    [getMatchesForUser]
  );

  // ── Message helpers ─────────────────────────────────────────────────────────

  const buildConversationId = useCallback((userId1, userId2) => {
    return [userId1, userId2].sort().join("::");
  }, []);

  const sendMessage = useCallback(
    (senderId, receiverId, text) => {
      const conversationId = buildConversationId(senderId, receiverId);
      const msg = {
        id: generateId(),
        conversationId,
        senderId,
        text,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] ?? []), msg],
      }));
      return msg;
    },
    [buildConversationId]
  );

  const getConversation = useCallback(
    (userId1, userId2) => {
      return messages[buildConversationId(userId1, userId2)] ?? [];
    },
    [messages, buildConversationId]
  );
  const markMessagesAsRead= useCallback((conversationId) => {
      setMessageReadTimestamps((prev) => ({
      ...prev,
      [conversationId]: Date.now(),
    }));
  }, []);

  // ── Post helpers ────────────────────────────────────────────────────────────

  const createPost = useCallback((authorId, authorName, content) => {
    const post = {
      id: generateId(),
      authorId,
      authorName,
      content,
      createdAt: new Date().toISOString(),
      likes: [],
    };
    setPosts((prev) => [post, ...prev]);
    return post;
  }, []);

  const toggleLike = useCallback((postId, userId) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const liked = p.likes.includes(userId);
        return {
          ...p,
          likes: liked
            ? p.likes.filter((id) => id !== userId)
            : [...p.likes, userId],
        };
      })
    );
  }, []);

  const deletePost = useCallback(
    (postId, requesterId) => {
      const post = posts.find((p) => p.id === postId);
      if (!post) return { success: false, error: "Not found." };
      if (post.authorId !== requesterId)
        return { success: false, error: "Not allowed." };
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      return { success: true };
    },
    [posts]
  );
  const getPendingMatches = useCallback(
    (userId) => {
      return matches.filter(
        (m) => m.status === "pending" && m.receiverId === userId
      );
    },
    [matches]
  );

  return (
    <AppContext.Provider
      value={{
        users,
        matches,
        messages,
        posts,
        registerUser,
        getUserById,
        getAllLearners,
        getAllNatives,
        sendMatchRequest,
        respondToMatch,
        getMatchesForUser,
        getAcceptedMatchesForUser,
        buildConversationId,
        sendMessage,
        getConversation,
        markMessagesAsRead,
        messageReadTimestamps,
        createPost,
        toggleLike,
        deletePost,
        getPendingMatches,
      }}
    >
      <AuthProvider onUpdateUser={handleUpdateUser}>{children}</AuthProvider>
    </AppContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}

export default AppContext;
