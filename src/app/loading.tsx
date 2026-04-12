export default function Loading() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 animate-ping rounded-full bg-wine/20" />
          <div className="absolute inset-1 animate-pulse rounded-full bg-wine/40" />
          <svg
            viewBox="0 0 32 32"
            fill="none"
            className="absolute inset-0 h-10 w-10"
          >
            <path
              d="M16 3C16 3 7 12 7 19C7 23.97 11.03 28 16 28C20.97 28 25 23.97 25 19C25 12 16 3 16 3Z"
              fill="rgba(123,45,45,0.15)"
              stroke="#7B2D2D"
              strokeWidth="1.2"
            />
          </svg>
        </div>
        <p className="text-[13px] text-ink-muted">불러오는 중...</p>
      </div>
    </div>
  );
}
