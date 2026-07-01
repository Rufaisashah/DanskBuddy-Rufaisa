import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, hashPassword } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import PasswordInput from "./PasswordInput";

const roleOptions = [
  { value: "learner", label: "Jeg lærer dansk" },
  { value: "native", label: "Jeg taler dansk" },
];

function Register() {
  const navigate = useNavigate();

  const { login } = useAuth();
  const { registerUser } = useApp();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "learner",
  });

  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  function updateFormField(name, value) {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleChange(event) {
    const { name, value } = event.target;
    updateFormField(name, value);

    if (name === "password") {
      setPasswordError("");
    }
  }

  async function handleRegister(event) {
    event.preventDefault();
    setError("");

    if (formData.password.length < 8) {
      setPasswordError("Adgangskoden skal være mindst 8 tegn.");
      return;
    }

    const rawPassword = formData.password;
    const hashedPassword = await hashPassword(formData.password);

    const registerResult = registerUser({
      name: formData.name,
      email: formData.email,
      password: hashedPassword,
      role: formData.role,

      // Default profile fields. User can edit these later.
      avatarBgColor: "#E63946",
      city: "",
      danishLevel: formData.role === "native" ? "native" : "",
      nativeLanguage: "",
      learningGoals: "",
      topics: [],
      availability: "",
      bio: "",
      createdAt: new Date().toISOString(),
    });

    if (registerResult && registerResult.success === false) {
      setError(registerResult.error);
      return;
    }

    const loginResult = await login(formData.email, rawPassword);

    if (!loginResult.success) {
      setError(loginResult.error);
      return;
    }

    navigate("/profile/me");
  }

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
        <div className="mt-auto max-w-xs pb-4">
          <h2 className="text-[34px] font-extrabold tracking-[-0.02em] text-white leading-[1.12]">
            Tilmeld dig på under et minut.
          </h2>
          <p className="mt-[14px] text-[15px] font-medium leading-relaxed text-[#FFE3D6]">
            Fortæl os om dit niveau og dine interesser, så matcher vi dig med de
            rette samtalepartnere fra dag ét.
          </p>
          <div className="mt-7 flex flex-col gap-3">
            <span className="flex items-center gap-3 text-[15px] font-bold text-white">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgba(255,255,255,0.22)] text-[#FFFFFF]">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m5 12 4 4 10-10" />
                </svg>
              </span>
              Hurtigt at komme i gang
            </span>
            <span className="flex items-center gap-3 text-[15px] font-bold text-white">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgba(255,255,255,0.22)] text-[#FFFFFF]">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m5 12 4 4 10-10" />
                </svg>
              </span>
              Verificeret fællesskab
            </span>
            <span className="flex items-center gap-3 text-[15px] font-bold text-white">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgba(255,255,255,0.22)] text-[#FFFFFF]">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m5 12 4 4 10-10" />
                </svg>
              </span>
              Ægte møder i nærheden af dig.
            </span>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-10 bg-white">
        <div className="w-full max-w-[360px]">
          <h1 className="text-[26px] font-extrabold tracking-[-0.02em] text-[#2B2A28]">
            Opret din konto
          </h1>

          <form onSubmit={handleRegister} className="w-full max-w-[360px]">
            {error && (
              <p
                role="alert"
                className="mt-5 rounded-2xl border border-[#F4C9CD] bg-[#FDEAEC] px-4 py-3 text-sm font-bold text-[#B0202C]"
              >
                {error}
              </p>
            )}

            <div className="mt-8 space-y-4">
              <fieldset>
                <legend className="text-[16px] font-extrabold tracking-[-0.01em] text-[#A89F94]">
                  Jeg er…
                </legend>
                <div className="mt-2 flex rounded-full bg-[#F6F0E8] p-1">
                  {roleOptions.map((option) => {
                    const isSelected = formData.role === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => updateFormField("role", option.value)}
                        className={`min-w-0 flex-1 cursor-pointer whitespace-nowrap rounded-full px-2 py-3 text-center text-[11px] font-extrabold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FDEAEC] min-[380px]:text-[12px] sm:px-4 sm:text-[13px] ${
                          isSelected
                            ? "bg-[#E63946] text-white shadow-[0_10px_18px_-12px_rgba(230,57,70,0.75)]"
                            : "text-[#6E665C] hover:bg-[#EFE8DD] active:bg-[#E6DCCF]"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <label className="flex flex-col gap-1.5 text-xs font-bold text-[#7C756B]">
                Fulde navn
                <input
                  name="name"
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Maria Holm"
                  required
                  className="bg-white border-[1.5px] border-[#ECE6DD] rounded-[14px] px-[15px] py-[13px] text-sm font-semibold text-[#2B2A28] outline-none w-full font-[inherit] focus:border-[#E63946]"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-xs font-bold text-[#7C756B]">
                Email
                <input
                  name="email"
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
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
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
                {passwordError && (
                  <p className="text-xs text-[#B0202C]">{passwordError}</p>
                )}
              </label>
            </div>

            <button
              type="submit"
              className="mt-6 w-full cursor-pointer rounded-full bg-[#E63946] px-6 py-3.5 text-[15px] font-extrabold text-white shadow-[0_14px_24px_-12px_rgba(230,57,70,0.75)] transition hover:bg-[#D62F3C] focus:outline-none focus:ring-4 focus:ring-[#FAD2D5] active:translate-y-px"
            >
              Fortsæt
            </button>

            <p className="text-center text-[13px] font-semibold text-[#7C756B] mt-4">
              Har du allerede en konto?{" "}
              <span
                className="text-[#E63946] font-bold cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Log ind
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
