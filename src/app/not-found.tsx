import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-8">
      {/* Illustration */}
      <div className="relative mb-8">
        <div className="absolute -inset-6 rounded-full bg-wine/5" />
        <div className="absolute -inset-3 rounded-full bg-wine/8" />
        <svg
          viewBox="0 0 36 36"
          fill="none"
          className="relative h-20 w-20"
        >
          <path
            d="M18 4C18 4 8 15 8 23C8 28.5228 12.4772 33 18 33C23.5228 33 28 28.5228 28 23C28 15 18 4"
            stroke="#7B2D2D"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Sad mouth */}
          <path
            d="M14 28C14 28 16 26 18 26C20 26 22 28 22 28"
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
