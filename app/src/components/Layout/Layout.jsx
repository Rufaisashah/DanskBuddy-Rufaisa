import { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { useUnreadCount } from "../../hooks/useUnreadCount";
import {
  Search,
  Users,
  MessageCircle,
  Home,
  User,
  LogOut,
  MoreVertical,
} from "lucide-react";
import { avatarColor } from "../../utils/avatarColor";
import { getInitials } from "../../utils/getInitials";

export default function Layout() {
  const { user, logout } = useAuth();
  const { getPendingMatches } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const isChatRoute = location.pathname.startsWith("/messages");
  const isChatDetailRoute = /^\/messages\/[^/]+$/.test(location.pathname);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const pendingCount = user ? getPendingMatches(user.id).length : 0;
  const unreadCount = useUnreadCount();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { to: "/feed", label: "Feed", icon: Home },
    { to: "/browse", label: "Find partnere", icon: Search },
    { to: "/matches", label: "Matches", icon: Users, badge: pendingCount },
    { to: "/messages", label: "Chat", icon: MessageCircle, badge: unreadCount },
    { to: "/profile/me", label: "Profil", icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F4EFE8]">
      {/* ── SIDEBAR — desktop only ── */}
      <aside className="hidden md:flex flex-col w-56 bg-white border-r border-gray-100 min-h-screen sticky top-0 h-screen">
        {/* Logo */}
        <NavLink
          to="/browse"
          className="flex items-center gap-3 px-5 py-5 no-underline"
        >
          <img
            src="/icons/icon-192.png"
            alt="DanskBuddy logo"
            className="w-10 h-10 rounded-[13px] shrink-0"
          />
          <span className="text-xl tracking-tight">
            <span className="font-extrabold text-[#E63946]">dansk</span>
            <span className="font-extrabold text-[#F4A261]">buddy</span>
          </span>
        </NavLink>

        {/* Nav links */}
        <nav className="flex flex-col gap-1 px-3 flex-1 mt-2">
          {navLinks.map(({ to, label, icon: Icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors no-underline ${
                  isActive
                    ? "bg-[#E63946]/10 text-[#E63946]"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`
              }
            >
              <Icon size={18} />
              {label}
              {badge > 0 && (
                <span className="ml-auto bg-[#E63946] text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom — user + menu */}
        <div className="relative px-3 py-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setIsUserMenuOpen((open) => !open)}
            className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 bg-transparent border-none cursor-pointer hover:bg-gray-100 transition-colors"
          >
            {user?.avatar ? (
              <span className="text-xl">{user.avatar}</span>
            ) : (
              <div
                className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm font-bold shrink-0"
                style={{ background: avatarColor(user?.id ?? "") }}
              >
                {getInitials(user?.name ?? "")}
              </div>
            )}
            <div className="flex flex-col leading-tight flex-1 min-w-0 text-left">
              <span className="font-semibold text-gray-900 truncate">
                {user?.name}
              </span>
              <span className="text-xs text-gray-400 truncate">
                {user?.role?.value || "Learner"}
                {user?.danishLevel ? ` · ${user.danishLevel}` : ""}
              </span>
            </div>
            <MoreVertical size={16} className="text-gray-400 shrink-0" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute bottom-[calc(100%+4px)] left-3 right-3 rounded-lg border border-gray-100 bg-white shadow-card overflow-hidden">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors w-full text-left bg-transparent border-none cursor-pointer"
              >
                <LogOut size={16} />
                Log out
              </button>
            </div>
          )}
        </div>
      </aside>

      <div className="flex flex-col flex-1 min-h-screen">
        <main
          className={
            isChatRoute ? "flex-1 min-h-0 flex flex-col" : "flex-1 p-6 md:p-8"
          }
        >
          <Outlet />
        </main>

        {!isChatRoute && (
          <footer className="text-center text-sm text-gray-400 py-4 border-t bg-white">
            © 2026 DanskBuddy · Find your Danish conversation partner 🇩🇰
          </footer>
        )}
      </div>

      {/* ── BOTTOM TAB BAR — mobile only ── */}
      {!isChatDetailRoute && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 z-50 px-2">
          {navLinks
            .filter(({ to }) =>
              [
                "/feed",
                "/browse",
                "/matches",
                "/messages",
                "/profile/me",
              ].includes(to)
            )
            .map(({ to, label, icon: Icon, badge }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `relative flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-xs transition-colors no-underline ${
                    isActive
                      ? "text-[#E63946]"
                      : "text-gray-400 hover:text-gray-700"
                  }`
                }
              >
                <Icon size={22} />
                {label}
                {badge > 0 && (
                  <span className="absolute top-0 right-1 bg-[#E63946] text-white text-xs font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-0.5">
                    {badge}
                  </span>
                )}
              </NavLink>
            ))}
        </nav>
      )}

      {/* Spacer for mobile tab bar */}
      {!isChatDetailRoute && <div className="md:hidden h-16" />}
    </div>
  );
}
