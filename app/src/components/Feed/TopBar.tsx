import { useState, useRef, useEffect } from "react";
import { Bell, Search, Heart, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "./useNotifications";

interface Props {
  onSearch: (value: string) => void;
}

export default function TopBar({ onSearch }: Props) {
  const notifications = useNotifications();
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const unread = notifications.length - seen;

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  function toggleOpen() {
    setOpen((prev) => {
      if (!prev) setSeen(notifications.length);
      return !prev;
    });
  }

  function handleNotificationClick(postId: string) {
    setOpen(false);
    navigate("/feed");
    setTimeout(() => {
      const el = document.getElementById(`post-${postId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.style.transition = "box-shadow 0.3s ease";
        el.style.boxShadow = "0 0 0 3px var(--color-primary)";
        setTimeout(() => {
          el.style.boxShadow = "";
        }, 1500);
      }
    }, 100);
  }

  return (
    <header className=" left-0  right-0 h-[72px] lg:h-[90px] flex items-center justify-between px-4 lg:px-10 bg-white border-b border-[#ebe5dd] z-50">
      <h1 className="text-xl lg:text-3xl font-bold text-foreground m-0">
        Fællesskab
      </h1>

      <div className="flex items-center gap-3">
        {/* Search — desktop only */}
        <div className="hidden lg:flex items-center gap-2 w-[280px] h-12 bg-[#FAF6F0] border border-[#ece6dd] rounded-full px-5">
          <Search size={18} className="text-neutral shrink-0" />
          <input
            placeholder="Søg..."
            onChange={(e) => onSearch(e.target.value)}
            className="flex-1 border-none outline-none bg-transparent font-semibold text-sm text-foreground placeholder:text-neutral-dark"
          />
        </div>

        {/* Bell */}
        <div className="relative" ref={ref}>
          <button
            onClick={toggleOpen}
            className="relative w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#FAF6F0]  border border-[#ece6dd] flex items-center justify-center cursor-pointer hover:bg-background transition-colors"
          >
            <Bell size={18} className="text-neutral" />
            {unread > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary border-2 border-white" />
            )}
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute top-12 right-0 w-[300px] lg:w-[320px] bg-white rounded-2xl shadow-elevated z-50 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-surface">
                <h3 className="m-0 text-[0.95rem] font-bold text-foreground">
                  Notifikationer
                </h3>
                {unread > 0 && (
                  <span className="text-xs font-semibold text-primary bg-primary-light px-2 py-0.5 rounded-full">
                    {unread} ny
                  </span>
                )}
              </div>

              <div className="max-h-[360px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-5 py-8 text-center text-neutral text-sm">
                    Ingen notifikationer endnu
                  </div>
                ) : (
                  notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => handleNotificationClick(n.postId)}
                      className="w-full flex items-start gap-3 px-5 py-3.5 border-b border-surface last:border-b-0 hover:bg-background transition-colors text-left cursor-pointer bg-transparent"
                    >
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                          n.type === "like"
                            ? "bg-primary-light"
                            : "bg-info-light"
                        }`}
                      >
                        {n.type === "like" ? (
                          <Heart size={15} className="text-primary" />
                        ) : (
                          <MessageCircle size={15} className="text-info" />
                        )}
                      </div>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <p className="m-0 text-[0.85rem] text-foreground leading-snug">
                          <span className="font-semibold">{n.actorName}</span>
                          {n.type === "like"
                            ? " likede dit opslag"
                            : " kommenterede på dit opslag"}
                        </p>
                        <p className="m-0 text-[0.75rem] text-neutral truncate">
                          "{n.postSnippet}…"
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
