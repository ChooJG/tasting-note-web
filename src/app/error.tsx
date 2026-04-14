"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

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
          {/* Dizzy X eyes */}
          <path
            d="M12 19L16 23M16 19L12 23"
            stroke="#7B2D2D"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M20 19L24 23M24 19L20 23"
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
        </svg>
      </div>

      <h1 className="mb-2 text-[22px] font-semibold tracking-[-0.03em] text-ink">
        문제가 발생했어요
      </h1>
      <p className="mb-8 text-center text-[15px] font-light leading-relaxed text-ink-muted">
        잠시 후 다시 시도해주세요.
        <br />
        문제가 계속되면 새로고침 해보세요.
      </p>

      <div className="flex gap-3">
        <button
          onClick={() => (window.location.href = "/feed")}
          className="rounded-card border-[1.5px] border-beige-dark bg-white/70 px-6 py-[15px] text-[15px] font-medium text-ink transition-colors"
        >
          피드로 가기
        </button>
        <button
          onClick={reset}
          className="rounded-card bg-wine px-6 py-[15px] text-[15px] font-medium text-beige transition-colors active:bg-wine-light"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
