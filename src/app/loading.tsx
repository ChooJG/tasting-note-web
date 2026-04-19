export default function Loading() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 animate-ping rounded-full bg-wine/20" />
          <div className="absolute inset-1 animate-pulse rounded-full bg-wine/40" />
          <svg
            viewBox="0 0 36 36"
            fill="none"
            className="absolute inset-0 h-10 w-10"
          >
            <path
              d="M18 4S8 15 8 23A10 10 0 0 0 28 23C28 15 18 4 18 4Z"
              stroke="#7B2D2D"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M14 26C14 26 16 28 18 28C20 28 22 26 22 26"
              stroke="#7B2D2D"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M14 22V20M22 22V20"
              stroke="#7B2D2D"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <p className="text-[13px] text-ink-muted">불러오는 중...</p>
      </div>
    </div>
  );
}
