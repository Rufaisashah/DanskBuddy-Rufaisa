import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import {
  Search,
  Users,
  MessageCircle,
  Rss,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function Layout() {
  const { user, logout } = useAuth();
  const { getMatchesForUser, messages, readTimestamps } = useApp();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  // ── Badge counts ────────────────────────────────────────────────────────────

  // Pending matches — incoming requests waiting for YOUR response
  const pendingCount = user
    ? getMatchesForUser(user.id).filter(
        (m) => m.status === "pending" && m.receiverId === user.id
      ).length
    : 0;

  // Unread messages — conversations where last message was NOT sent by you
  const unreadCount = user
    ? Object.keys(messages).filter((convId) => {
        const [id1, id2] = convId.split("::");
        const isMine =
          String(id1) === String(user.id) || String(id2) === String(user.id);
        if (!isMine) return false;
        const convMessages = messages[convId];
        const lastMessage = convMessages[convMessages.length - 1];
        if (!lastMessage) return false;
        if (String(lastMessage.senderId) === String(user.id)) return false;
        const lastRead = readTimestamps?.[convId] || 0;
        return new Date(lastMessage.createdAt).getTime() > lastRead;
      }).length
    : 0;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ── Nav links config ────────────────────────────────────────────────────────
  const navLinks = [
    { to: "/browse", label: "Browse", icon: Search },
    { to: "/matches", label: "Matches", icon: Users, badge: pendingCount },
    {
      to: "/messages",
      label: "Messages",
      icon: MessageCircle,
      badge: unreadCount,
    },
    { to: "/feed", label: "Feed", icon: Rss },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── NAVBAR ── */}
      <nav className="bg-[#E63946] text-white h-16 flex items-center justify-between px-6 sticky top-0 z-50 shadow-sm">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 no-underline">
          <svg
            width="28"
            height="28"
            viewBox="0 0 204 204"
            className="shrink-0"
          >
            <rect
              width="204"
              height="204"
              rx="20"
              fill="#E63946"
              stroke="white"
              strokeWidth="8"
            />
            <rect x="78" y="0" width="34" height="204" fill="#fff" />
            <rect x="0" y="78" width="204" height="34" fill="#fff" />
          </svg>
          <span className="font-bold text-lg tracking-tight">
            <span className="text-white">dansk</span>
            <span className="text-[#F4A261]">buddy</span>
          </span>
        </NavLink>

        {/* Desktop nav links with icons */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label, icon: Icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`
              }
            >
              <Icon size={16} />
              {label}
              {badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-[#E63946] text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow">
                  {badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Right side — user + logout */}
        <div className="hidden md:flex items-center gap-3">
          <NavLink
            to="/profile/me"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors no-underline ${
                isActive
                  ? "bg-white/20 text-white"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`
            }
          >
            {user?.avatar ? (
              <span className="text-xl">{user.avatar}</span>
            ) : (
              <User size={16} />
            )}
            <span className="text-sm">{user?.name?.split(" ")[0]}</span>
          </NavLink>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-white text-[#E63946] hover:bg-gray-100 text-sm px-3 py-1.5 rounded-lg font-medium transition-colors"
          >
            <LogOut size={14} />
            Log out
          </button>
        </div>

        {/* Hamburger — mobile only */}
        <button
          className="md:hidden text-white p-1"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900 flex flex-col gap-1 px-4 py-3">
          {navLinks.map(({ to, label, icon: Icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 text-sm"
            >
              <Icon size={16} />
              {label}
              {badge > 0 && (
                <span className="ml-auto bg-[#E63946] text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {badge}
                </span>
              )}
            </NavLink>
          ))}

          <div className="border-t border-gray-700 mt-2 pt-2">
            <NavLink
              to="/profile/me"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:text-white text-sm"
            >
              <User size={16} />
              {user?.avatar} My Profile
            </NavLink>
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:text-white text-sm w-full"
            >
              <LogOut size={16} />
              Log out
            </button>
          </div>
        </div>
      )}

      {/* Page content */}
      <main className="flex-1 p-8 bg-[#F4EFE8]">
        <Outlet />
      </main>

      <footer className="text-center text-sm text-gray-400 py-4 border-t bg-white">
        © 2026 DanskBuddy · Find your Danish conversation partner 🇩🇰
      </footer>
    </div>
  );
}
