// Default avatar colour from the design — a warm terracotta (#E07A5F)
const AVATAR_COLOR = "#E07A5F";

const SIZE = {
  sm: "w-8 h-8 text-[11px]",
  md: "w-[34px] h-[34px] text-[13px]",
  lg: "w-14 h-14 text-base",
  profile: "w-[92px] h-[92px] text-[34px]",
};

export default function Avatar({
  initials,
  online = false,
  size = "md",
  color = AVATAR_COLOR,
}) {
  return (
    <div className="relative inline-flex">
      <div
        className={`${SIZE[size]} rounded-full text-white font-extrabold flex items-center justify-center`}
        style={{ backgroundColor: color }}
      >
        {initials}
      </div>
      {online && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-white" />
      )}
    </div>
  );
}
