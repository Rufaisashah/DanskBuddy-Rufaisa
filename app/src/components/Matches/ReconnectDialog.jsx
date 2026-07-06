function RefreshIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#E63946"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <path d="M21 4v4h-4" />
    </svg>
  );
}

export default function ReconnectDialog({ name, onCancel, onConfirm }) {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[rgba(43,42,40,0.42)]"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[300px] rounded-[20px] bg-white p-[24px] text-center shadow-[0_24px_50px_-20px_rgba(33,30,28,0.55)]"
      >
        <div className="mx-auto mb-[14px] flex h-[54px] w-[54px] items-center justify-center rounded-[16px] bg-[#FDEAEC]">
          <RefreshIcon />
        </div>

        {/* 1. Translated Heading */}
        <div className="text-[17px] font-extrabold tracking-tight text-[#2B2A28]">
          Send {name} en anmodning igen?
        </div>

        {/* 2. Translated Body Paragraph */}
        <p className="mt-[8px] text-[13px] font-medium leading-[1.5] text-[#7C756B]">
          Du har tidligere afvist dette match. Hvis du sender en anmodning igen, kan {name} acceptere og starte en chat.
        </p>

        <div className="mt-[18px] flex gap-[9px]">
          {/* 3. Translated Cancel Button */}
          <button
            onClick={onCancel}
            className="flex-1 rounded-[12px] border-[1.5px] border-[#ECE6DD] bg-white py-[11px] text-[13.5px] font-extrabold text-[#7C756B]"
          >
            Annuller
          </button>
          
          {/* 4. Translated Confirm Button */}
          <button
            onClick={onConfirm}
            className="flex-1 rounded-[12px] bg-[#E63946] py-[11px] text-[13.5px] font-extrabold text-white shadow-[0_10px_20px_-10px_rgba(0,0,0,0.3)]"
          >
            Send anmodning
          </button>
        </div>
      </div>
    </div>
  );
}