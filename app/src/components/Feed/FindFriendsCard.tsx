import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";

const AVATAR_COLORS = ["#F59E0B", "#38BDF8", "#9B7EDE", "#34C77B", "#F4A261"];
function avatarColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++)
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export default function FindFriendsCard() {
  const navigate = useNavigate();
  const { users } = useApp() as { users: any[] };
  const { user } = useAuth() as { user: any };

  // Show up to 3 users that aren't the current user
  const suggestions = users
    .filter((u) => String(u.id) !== String(user?.id))
    .slice(0, 3);

  return (
    <div className="bg-white rounded-2xl shadow-card p-6">
      <h3 className="text-[0.95rem] font-bold text-foreground mb-1">
        Foreslåede sprogpartnere
      </h3>

      {suggestions.map((friend) => (
        <div
          key={friend.id}
          className="flex items-center justify-between py-3 border-b border-surface last:border-b-0 last:pb-0"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
              style={{ backgroundColor: avatarColor(String(friend.id)) }}
            >
              {initials(friend.name)}
            </div>
            <div>
              <p className="m-0 font-semibold text-[0.9rem] text-foreground">
                {friend.name}
              </p>
              <p className="m-0 text-[0.8rem] text-neutral">{friend.city}</p>
            </div>
          </div>

          <button
            onClick={() => navigate(`/profile/${friend.id}`)}
            className="text-[0.8rem] font-bold text-primary bg-primary-light border-none px-4 py-2 rounded-full cursor-pointer hover:bg-primary-pale transition-colors whitespace-nowrap"
          >
            Se profil
          </button>
        </div>
      ))}
    </div>
  );
}
