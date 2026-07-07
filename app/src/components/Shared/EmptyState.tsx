import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  message: string;
  icon?: ReactNode;
  kicker?: string;
};

export default function EmptyState({
  icon,
  kicker,
  title,
  message,
}: EmptyStateProps) {
  return (
    <div className="mx-auto w-full max-w-md rounded-[20px] bg-white px-6 py-12 text-center shadow-[0_14px_28px_-24px_rgba(33,30,28,0.35)]">
      {icon && (
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F3EEE7] text-[#8A8175]">
          {icon}
        </div>
      )}

      {kicker && (
        <p className="mb-2 mt-4 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#A89F94]">
          {kicker}
        </p>
      )}

      <h3 className="m-0 text-[19px] font-extrabold tracking-[-0.01em] text-[#161616]">
        {title}
      </h3>

      <p className="mx-auto mb-0 mt-2 max-w-[260px] text-[14px] font-semibold leading-relaxed text-[#7C756B]">
        {message}
      </p>
    </div>
  );
}
