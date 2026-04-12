import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-8">
      {/* Illustration */}
      <div className="relative mb-8">
        <div className="absolute -inset-6 rounded-full bg-wine/5" />
        <div className="absolute -inset-3 rounded-full bg-wine/8" />
        <svg
          viewBox="0 0 64 64"
          fill="none"
          className="relative h-20 w-20"
        >
          <path
            d="M32 6C32 6 14 24 14 38C14 47.94 22.06 56 32 56C41.94 56 50 47.94 50 38C50 24 32 6 32 6Z"
            fill="rgba(123,45,45,0.1)"
            stroke="#7B2D2D"
            strokeWidth="1.5"
          />
          <path
            d="M32 24C32 24 22 35 22 42C22 47.52 26.48 52 32 52"
            stroke="#7B2D2D"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.3"
          />
          {/* Question mark */}
          <text
            x="32"
            y="40"
            textAnchor="middle"
            fill="#7B2D2D"
            fontSize="18"
            fontWeight="600"
            fontFamily="Pretendard Variable, sans-serif"
          >
            ?
          </text>
        </svg>
      </div>

      <p className="mb-2 text-[48px] font-semibold tracking-[-0.03em] text-wine/20">
        404
      </p>
      <h1 className="mb-2 text-[22px] font-semibold tracking-[-0.03em] text-ink">
        페이지를 찾을 수 없어요
      </h1>
      <p className="mb-8 text-center text-[15px] font-light leading-relaxed text-ink-muted">
        요청하신 페이지가 존재하지 않거나
        <br />
        주소가 변경되었을 수 있습니다.
      </p>

      <Link
        href="/feed"
        className="rounded-card bg-wine px-8 py-[15px] text-[15px] font-medium text-beige transition-colors active:bg-wine-light"
      >
        피드로 돌아가기
      </Link>
    </div>
  );
}
