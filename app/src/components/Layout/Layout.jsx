import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { useUnreadCount } from "../../hooks/useUnreadCount";
import { useState, useRef, useEffect } from "react";
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
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pendingCount = user ? getPendingMatches(user.id).length : 0;
  const unreadCount = useUnreadCount();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { to: "/feed", label: "Feed", icon: Home },
    { to: "/browse", label: "Søg", icon: Search },
    { to: "/matches", label: "Matches", icon: Users, badge: pendingCount },
    {
      to: "/messages",
      label: "Chat",
      icon: MessageCircle,
      badge: unreadCount,
    },
    { to: "/profile/me", label: "Profil", icon: User },
  ];
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* ── SIDEBAR — desktop only ── */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-[#EFE8E1] min-h-screen sticky top-0 h-screen">
        {/* Logo */}
        <NavLink
          to="/browse"
          className="flex items-center gap-3 px-6 py-6 no-underline"
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
                `relative flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-colors no-underline ${
                  isActive
                    ? "bg-[#FDEBEC] text-[#E63946]"
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
        {/* Bottom — user + menu */}
        <div className="relative mt-auto p-3" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsUserMenuOpen((open) => !open)}
            className="
flex w-full items-center gap-3
rounded-2xl
border border-[#EFE8E1]
bg-white
px-4 py-3
shadow-sm
hover:bg-gray-50
transition-all
text-left
"
          >
            {user?.avatar ? (
              <span className="text-xl">{user.avatar}</span>
            ) : (
              <div
                className="w-10 h-10 rounded-full flex-shrink-0 text-white flex items-center justify-center text-sm font-bold"
                style={{ background: avatarColor(user?.id ?? "") }}
              >
                {getInitials(user?.name ?? "")}
              </div>
            )}

            <div className="flex-1 min-w-0 overflow-hidden">
              <span className="block text-sm font-semibold text-gray-900 truncate">
                {user?.name}
              </span>

              <span className="block text-xs text-gray-500 truncate">
                {user?.role?.label || "Lærer dansk"}
                {user?.danishLevel ? ` · ${user.danishLevel}` : ""}
              </span>
            </div>

            <MoreVertical size={16} className="text-gray-400 flex-shrink-0" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute bottom-[calc(100%+10px)] left-3 right-3 rounded-2xl border border-[#EFE8E1] bg-white shadow-lg overflow-hidden">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={16} />
                Log out
              </button>
            </div>
          )}
        </div>
      </aside>
      <div className="flex flex-col flex-1 overflow-hidden">
        <main
          className={
            isChatRoute
              ? "flex-1 min-h-0 flex flex-col overflow-hidden"
              : "flex-1 p-6 md:p-8 bg-white"
          }
        >
          <Outlet />
        </main>
      </div>

      {/* ── BOTTOM TAB BAR — mobile only ── */}
      {!isChatDetailRoute && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-between items-center h-16 z-50 px-6">
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
