import { Link } from "react-router-dom";

import avatarLe from "../../assets/avatars/avatar-le.png";
import avatarMi from "../../assets/avatars/avatar-mi.png";
import avatarSo from "../../assets/avatars/avatar-so.png";
import mark from "../../assets/icon/mark.svg";
import wordmark from "../../assets/wordmark/wordmark.svg";

const benefits: string[] = [
  "Øv danske samtaler",
  "Find sprogpartnere",
  "Bliv en del af et støttende fællesskab",
];

function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fffdf9] text-foreground">
      <section className="flex min-h-[720px] w-full max-w-[390px] flex-col items-center px-8 py-12 text-center">
        <img
          src={mark}
          alt="Logotype icon"
          className="h-16 w-16 drop-shadow-[0_18px_24px_rgba(230,57,70,0.2)]"
          aria-hidden="true"
        />

        <img
          src={wordmark}
          alt="DanskBuddy logotype"
          className="mt-6 h-auto w-52"
        />

        <p className="mt-3 max-w-xs text-sm font-bold leading-6 text-neutral sm:text-base">
          Hej! Klar til at øve dansk?
        </p>

        <div className="relative mt-8 h-[75px] w-[170px]">
          <img
            src={avatarLe}
            alt="Language partner"
            className="absolute bottom-0 left-0 h-[52px] w-[52px] rounded-pill object-cover"
          />
          <img
            src={avatarSo}
            alt="Language partner"
            className="absolute bottom-[7px] left-[56px] h-[58px] w-[58px] rounded-pill object-cover"
          />
          <img
            src={avatarMi}
            alt="Language partner"
            className="absolute bottom-0 right-0 h-[52px] w-[52px] rounded-pill object-cover"
          />
          <div className="absolute left-[101px] top-0 flex h-7 items-center rounded-[11px_11px_11px_3px] bg-foreground px-3 text-sm font-extrabold leading-none text-white">
            <span className="relative z-10 flex items-center gap-1">
              Hej! <span aria-hidden="true">👋</span>
            </span>
          </div>
        </div>

        <div className="mt-9 flex w-full flex-col gap-3.5">
          {benefits.map((benefit) => (
            <div
              key={benefit}
              className="flex items-center gap-3 text-left text-sm font-semibold text-neutral"
            >
              <span className="flex h-[23px] w-[23px] shrink-0 items-center justify-center rounded-pill bg-secondary text-[12px] font-bold leading-none text-white">
                {"\u2713"}
              </span>
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        <div className="mt-7 flex w-full flex-col gap-3">
          <Link
            to="/register"
            className="rounded-pill bg-primary px-7 py-4 text-center font-bold text-white shadow-primary transition hover:bg-primary-dark"
          >
            Opret profil
          </Link>

          <Link
            to="/login"
            className="rounded-pill border border-surface bg-white px-7 py-4 text-center font-bold text-foreground shadow-card transition hover:bg-surface-alt"
          >
            Log ind
          </Link>
        </div>

        <p className="mt-4 text-sm text-neutral">Gratis at være med</p>
      </section>
    </main>
  );
}

export default HomePage;
