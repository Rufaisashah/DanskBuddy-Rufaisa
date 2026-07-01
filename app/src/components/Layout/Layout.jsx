import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { useUnreadCount } from "../../hooks/useUnreadCount";
import { Search, Users, MessageCircle, Home, User, LogOut } from "lucide-react";

export default function Layout() {
  const { user, logout } = useAuth();
  const { getPendingMatches } = useApp();
  const navigate = useNavigate();

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
            src="/icons/dansklogo.png"
            alt="DanskBuddy logo"
            className="w-10 h-10"
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

        {/* Bottom — user + logout */}
        <div className="px-3 py-4 border-t border-gray-100 group">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700">
            {user?.avatar ? (
              <span className="text-xl">{user.avatar}</span>
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#E63946] text-white flex items-center justify-center text-sm font-bold">
                {user?.name?.[0]}
              </div>
            )}
            <div className="flex flex-col leading-tight">
              <span className="font-medium text-gray-900">
                {user?.name?.split(" ")[0]}
              </span>
              <span className="text-xs text-gray-400 capitalize">
                {user?.role || "Learner"}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500
            hover:text-red-600 hover:bg-red-50 transition-colors w-full text-left
            opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      </aside>

      <div className="flex flex-col flex-1 min-h-screen">
        {/* Mobile top bar */}
        <div className="md:hidden bg-white border-b border-gray-100 h-14 flex items-center justify-between px-4 sticky top-0 z-50">
          <NavLink
            to="/browse"
            className="flex items-center gap-2 no-underline"
          >
            <img
              src="/icons/dansklogo.png"
              alt="DanskBuddy logo"
              className="w-10 h-10"
            />
            <span className="text-base tracking-tight">
              <span className="font-extrabold text-[#E63946]">dansk</span>
              <span className="font-extrabold text-[#F4A261]">buddy</span>
            </span>
          </NavLink>
          <div className="w-8 h-8 rounded-full bg-[#E63946] text-white flex items-center justify-center text-sm font-bold">
            {user?.name?.[0]}
          </div>
        </div>

        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>

        <footer className="text-center text-sm text-gray-400 py-4 border-t bg-white">
          © 2026 DanskBuddy · Find your Danish conversation partner 🇩🇰
        </footer>
      </div>

      {/* ── BOTTOM TAB BAR — mobile only ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 z-50 px-2">
        {navLinks
          .filter(({ to }) =>
            ["/feed", "/matches", "/messages", "/profile/me"].includes(to)
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

      {/* Spacer for mobile tab bar */}
      <div className="md:hidden h-16" />
    </div>
  );
}