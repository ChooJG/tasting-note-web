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
          {/* X mark */}
          <path
            d="M24 30L40 46M40 30L24 46"
            stroke="#7B2D2D"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
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
