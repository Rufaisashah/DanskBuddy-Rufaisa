import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PasswordInput from "./PasswordInput";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /* Temporary solution for adding the Poppins font*/
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      if (document.head.contains(link)) document.head.removeChild(link);
    };
  }, []);

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        navigate("/browse");
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("Der gik noget galt. Prøv igen.");
    } finally {
      setIsLoading(false);
    }
  }

  const avatars = [
    { initials: "LE", bg: "#E8836B" },
    { initials: "MI", bg: "#9B7EDE" },
    { initials: "TO", bg: "#F4A261" },
  ];

  return (
    <div className="min-h-screen flex font-['Poppins',_-apple-system,_BlinkMacSystemFont,_sans-serif]">
      {/* Left hero panel — desktop only */}
      <div className="hidden md:flex w-[44%] flex-col overflow-hidden p-[46px_40px] [background:linear-gradient(160deg,#E63946_0%,#EC5C52_55%,#F4A261_120%)]">
        {/* Logo */}
        <div className="flex items-center gap-[11px]">
          <div className="relative w-10 h-10 rounded-[13px] bg-white/20 shrink-0">
            <div className="absolute top-0 bottom-0 left-[13px] w-1.5 bg-white" />
            <div className="absolute left-0 right-0 top-[13px] h-1.5 bg-white" />
          </div>
          <span className="text-[23px] font-extrabold tracking-[-0.035em] text-white">
            danskbuddy
          </span>
        </div>

        {/* Tagline + avatars */}
        <div className="mt-auto">
          <h2 className="text-[34px] font-extrabold tracking-[-0.02em] text-white leading-[1.12]">
            Øv dansk med rigtige mennesker.
          </h2>
          <p className="text-[15px] font-medium text-[#FFE3D6] mt-[14px] leading-relaxed max-w-[300px]">
            Find modersmålstalere og andre sprogstuderende på dit niveau — over
            en kop kaffe, en chat eller et meetup.
          </p>

          <div className="flex items-center mt-6">
            {avatars.map((avatar, i) => (
              <div
                key={avatar.initials}
                className="w-[42px] h-[42px] rounded-full border-[3px] border-[#EC5C52] text-white font-extrabold text-sm flex items-center justify-center relative"
                style={{
                  background: avatar.bg,
                  marginLeft: i === 0 ? 0 : "-12px",
                  zIndex: i,
                }}
              >
                {avatar.initials}
              </div>
            ))}
            <span className="text-[13px] font-semibold text-[#FFE3D6] ml-3">
              2.400+ sprogvenner
            </span>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-10 bg-white">
        <div className="w-full max-w-[360px]">
          <h1 className="text-[26px] font-extrabold tracking-[-0.02em] text-[#2B2A28]">
            Velkommen tilbage
          </h1>
          <p className="text-sm font-semibold text-[#7C756B] mt-1">
            Log ind for at fortsætte din øvelse.
          </p>

          <form
            onSubmit={handleLogin}
            className="flex flex-col gap-3 mt-[26px]"
          >
            {error && (
              <p
                role="alert"
                className="m-0 px-[15px] py-3 bg-[#FDEAEC] border-[1.5px] border-[#F4A5AD] rounded-[14px] text-sm font-semibold text-[#B0202C]"
              >
                {error}
              </p>
            )}

            <label className="flex flex-col gap-1.5 text-xs font-bold text-[#7C756B]">
              Email
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="maria@email.dk"
                required
                className="bg-white border-[1.5px] border-[#ECE6DD] rounded-[14px] px-[15px] py-[13px] text-sm font-semibold text-[#2B2A28] outline-none w-full font-[inherit] focus:border-[#E63946]"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-xs font-bold text-[#7C756B]">
              Adgangskode
              <PasswordInput
                id="password"
                name="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
              />
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full border-none cursor-pointer bg-[#E63946] text-white font-[inherit] font-bold text-[15px] py-[14px] rounded-full mt-1 shadow-[0_12px_22px_-10px_rgba(230,57,70,0.6)] disabled:bg-[#EC8C94] disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isLoading ? "Logger ind..." : "Log ind"}
            </button>

            <p className="text-center text-[13px] font-semibold text-[#7C756B] mt-2">
              Ny her?{" "}
              <span
                className="text-[#E63946] font-bold cursor-pointer"
                onClick={() => navigate("/register")}
              >
                Opret konto
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
