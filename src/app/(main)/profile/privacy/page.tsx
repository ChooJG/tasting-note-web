"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const MESSAGES = [
  "여러분의 소중한 개인정보는\n저희가 감사히 잘 사용하겠습니다.",
  "아 삼겹살에 소주 마시고 싶다",
  "비밀번호는 암호화해서 저장해요.\n저도 못 봐요 진짜로.",
  "개인정보는 탈퇴하면 다 지워드려요.\n그런데 탈퇴기능이 아직 없어요.",
  "오늘 뭐 마실까...\n아 일해야지",
  "꿈은 없고요, 그냥 놀고싶습니다",
  "강아지 vs 고양이\n저는 고양이",
  "이 고양이를 보고 전화주시면 상품드림\n010-5809-0304",
];

export default function PrivacyPage() {
  const router = useRouter();
  const [msgIndex, setMsgIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [catData, setCatData] = useState(null);

  // Lottie JSON 로드
  useEffect(() => {
    fetch("/cat.json")
      .then((res) => res.json())
      .then(setCatData)
      .catch(() => {});
  }, []);

  // 메시지 순환
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setMsgIndex((i) => (i + 1) % MESSAGES.length);
        setFade(true);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex shrink-0 items-center border-b border-beige-dark px-5 pb-3 pt-4">
        <button
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70"
        >
          <svg
            width={18}
            height={18}
            viewBox="0 0 18 18"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 4L6 9L11 14" />
          </svg>
        </button>
        <span className="flex-1 text-center text-[16px] font-semibold text-ink">
          개인정보 처리방침
        </span>
        <div className="w-9" />
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-6">
        {/* 말풍선 — 높이 고정 */}
        <div className="mb-1 flex h-[90px] w-full max-w-[280px] items-end justify-center">
          <div
            className={`relative w-full rounded-[16px] bg-white px-5 py-4 shadow-[0_2px_12px_rgba(30,18,8,0.08)] transition-opacity duration-300 ${
              fade ? "opacity-100" : "opacity-0"
            }`}
          >
            <p className="whitespace-pre-line text-center text-[14px] leading-[1.7] text-ink-soft">
              {MESSAGES[msgIndex]}
            </p>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
              <div className="h-0 w-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-white" />
            </div>
          </div>
        </div>

        {/* 고양이 Lottie */}
        <div className="h-[280px] w-[280px]">
          {catData ? (
            <Lottie
              animationData={catData}
              loop
              autoplay
              style={{ width: 280, height: 280 }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[48px]">
              🐱
            </div>
          )}
        </div>

        <p className="mt-6 text-[12px] text-ink-muted">
          2026년 4월 19일부터 시행
        </p>
      </div>
    </div>
  );
}
