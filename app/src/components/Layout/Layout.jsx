import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import {
  Search,
  Users,
  MessageCircle,
  Home,
  User,
  LogOut,
  
} from "lucide-react";

export default function Layout() {
  const { user, logout } = useAuth();
  const { getMatchesForUser, messages, readTimestamps } = useApp();
  const navigate = useNavigate();


  const pendingCount = user
    ? getMatchesForUser(user.id).filter(
        (m) => m.status === "pending" && m.receiverId === user.id
      ).length
    : 0;

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

  const navLinks = [
    { to: "/feed", label: "Feed", icon: Home },
    { to: "/browse", label: "Find partnere", icon: Search },
    { to: "/matches", label: "Matches", icon: Users, badge: pendingCount },
    { to: "/messages", label: "Chat", icon: MessageCircle, badge: unreadCount },
    
    { to: "/profile/me", label: "Profil", icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F4EFE8]">

    
      <aside className="hidden md:flex flex-col w-56 bg-white border-r border-gray-100 min-h-screen sticky top-0 h-screen">

       
        
<NavLink to="/" className="flex items-center gap-3 px-5 py-5 no-underline">
  <svg width="44" height="44" viewBox="0 0 44 44">
  <image href="/icons/dansklogo.png" width="44" height="44" />

  </svg>

  <span className="text-xl tracking-tight">
    <span className="font-extrabold text-[#E63946]">dansk</span>
    <span className="font-extrabold text-[#F4A261]">buddy</span>
  </span>
</NavLink>

       
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

     
        <div className="px-3 py-4 border-t border-gray-100 flex flex-col gap-1">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700">
            {user?.avatar ? (
              <span className="text-xl">{user.avatar}</span>
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#E63946] text-white flex items-center justify-center text-sm font-bold">
                {user?.name?.[0]}
              </div>
            )}
            <div className="flex flex-col leading-tight">
              <span className="font-medium text-gray-900">{user?.name?.split(" ")[0]}</span>
              <span className="text-xs text-gray-400 capitalize">{user?.role || "Learner"}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors w-full text-left"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      </aside>

      
      <div className="flex flex-col flex-1 min-h-screen">
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
          .filter(({ to }) => ["/browse", "/matches", "/messages", "/profile/me"].includes(to))
          .map(({ to, label, icon: Icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `relative flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-xs transition-colors no-underline ${
                  isActive ? "text-[#E63946]" : "text-gray-400 hover:text-gray-700"
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

      {/* Spacer so mobile content isn't hidden behind tab bar */}
      <div className="md:hidden h-16" />
    </div>
  );
}