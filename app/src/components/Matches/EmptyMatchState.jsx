function InboxIcon({ color }) {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12h5l2 3h4l2-3h5" />
      <path d="M5 5h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
    </svg>
  );
}
function NoEntryIcon({ color }) {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8 8 8 8" />
    </svg>
  );
}
function PeopleIcon({ color }) {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20c0-3.3 2.4-5.5 5.5-5.5s5.5 2.2 5.5 5.5" />
      <path d="M16.2 5.1a3.2 3.2 0 0 1 0 5.8" />
      <path d="M17.8 14.7c2 .7 3.2 2.6 3.2 5.3" />
    </svg>
  );
}
const CONFIG = {
  requests: {
    icon: InboxIcon,
    iconBg: "#FDEAEC",
    iconColor: "#D62F3C",
    label: "Requests",
    title: "No pending requests",
    body: "When someone wants to practise with you — or you reach out — it shows up here.",
    cta: "Find partners",
  },
  declined: {
    icon: NoEntryIcon,
    iconBg: "#F1ECE3",
    iconColor: "#8A8175",
    label: "Declined",
    title: "Nothing declined",
    body: "Requests you or others turn down land here, so you can revisit them later.",
    cta: null,
  },
  connected: {
    icon: PeopleIcon,
    iconBg: "#FBE8C7",
    iconColor: "#C97F35",
    label: "Connected",
    title: "No partners yet",
    body: "Accept a request or send one to start building your circle of language buddies.",
    cta: "Browse people",
  },
};
export default function EmptyMatchState({ type, onCtaClick }) {
  const cfg = CONFIG[type];
  if (!cfg) return null;
  const Icon = cfg.icon;

  return (
    <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-gray-200 bg-white px-6 py-8 text-center shadow-sm">
      <div
        className="mb-2 flex h-[74px] w-[74px] items-center justify-center rounded-[22px]"
        style={{ background: cfg.iconBg }}
      >
        <Icon color={cfg.iconColor} />
      </div>
      <div className="text-xs font-extrabold uppercase tracking-wide text-gray-400">
        {cfg.label}
      </div>
      <div className="text-lg font-extrabold tracking-tight text-gray-900">
        {cfg.title}
      </div>
      <p className="max-w-[450px] text-sm font-medium leading-relaxed text-gray-500">
        {cfg.body}
      </p>
      {cfg.cta && (
        <button
          onClick={onCtaClick}
          className="mt-3 rounded-full bg-[#E63946] px-5 py-2.5 text-sm font-extrabold text-white"
        >
          {cfg.cta}
        </button>
      )}
    </div>
  );
}
