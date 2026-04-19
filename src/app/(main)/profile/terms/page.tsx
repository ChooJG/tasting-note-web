"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";

function RunawayButton({ onCatch }: { onCatch: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [started, setStarted] = useState(false);
  const [speed, setSpeed] = useState(1.8);
  const [attempts, setAttempts] = useState(0);
  const moveCountRef = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const flee = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const btnW = 150;
    const btnH = 44;
    const maxX = rect.width - btnW;
    const maxY = rect.height - btnH;
    setPos({
      x: Math.random() * Math.max(maxX, 0),
      y: Math.random() * Math.max(maxY, 0),
    });
    moveCountRef.current += 1;
    if (moveCountRef.current % 3 === 0) {
      setSpeed((s) => Math.min(s + 0.4, 6));
    }
  }, []);

  useEffect(() => {
    if (!started) return;
    flee();
    const interval = setInterval(flee, Math.max(1200 / speed, 250));
    return () => clearInterval(interval);
  }, [started, speed, flee]);

  const handleTouch = () => {
    setAttempts((a) => a + 1);
    if (attempts >= 19) {
      onCatch();
      return;
    }
    flee();
    setSpeed((s) => Math.min(s + 0.2, 6));
  };

  const transitionDuration = Math.max(0.2 / speed, 0.05);

  const getMessage = () => {
    if (attempts === 0) return "버튼을 눌러 동의해주세요";
    if (attempts < 5) return `시도 ${attempts}회... 20번을 클릭해보세요!`;
    if (attempts < 10)
      return `시도 ${attempts}회... 하란다고 진짜로 하고있네요`;
    if (attempts < 15) return `시도 ${attempts}회... 시간이 많으신가요?`;
    if (attempts < 20)
      return `시도 ${attempts}회... 현실에는 이런 쓸데없는 일 말고 생산적인 일이 많이 남아있답니다`;
    return `시도 ${attempts}회...`;
  };

  return (
    <div
      ref={containerRef}
      className="relative flex-1 overflow-hidden rounded-[16px] border-[1.5px] border-dashed border-wine/30 bg-wine-pale/30"
    >
      {!started && (
        <div className="flex h-full items-center justify-center">
          <p className="text-[14px] text-ink-muted">잠시만요...</p>
        </div>
      )}

      {started && (
        <>
          <button
            onClick={handleTouch}
            style={{
              position: "absolute",
              left: pos.x,
              top: pos.y,
              transition: `left ${transitionDuration}s ease-out, top ${transitionDuration}s ease-out`,
            }}
            className="rounded-card bg-wine px-6 py-3 text-[15px] font-medium text-beige shadow-lg active:scale-95"
          >
            동의합니다
          </button>

          <div className="absolute bottom-3 left-0 right-0 px-4 text-center">
            <p className="text-[12px] leading-[1.6] text-ink-muted">
              {getMessage()}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function AchievementBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`flex flex-col items-center gap-5 transition-all duration-700 ${
        show ? "scale-100 opacity-100" : "scale-75 opacity-0"
      }`}
    >
      {/* 도전과제 카드 */}
      <div className="w-full max-w-[300px] overflow-hidden rounded-[16px] bg-[#1a1a2e] shadow-[0_0_40px_rgba(123,45,45,0.3)]">
        {/* 상단 배너 */}
        <div className="bg-gradient-to-r from-wine to-wine-light px-4 py-2.5 text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-beige/70">
            도전과제 달성
          </p>
        </div>

        {/* 아이콘 + 제목 */}
        <div className="flex flex-col items-center gap-3 px-6 pb-6 pt-5">
          <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-gradient-to-br from-rating to-amber-600 shadow-[0_0_20px_rgba(212,148,26,0.4)]">
            <span className="text-[36px]">🏆</span>
          </div>
          <div className="text-center">
            <p className="text-[18px] font-bold text-beige">너가 이겼다...</p>
            <p className="mt-1 text-[12px] text-beige/50">
              이용약관 동의 마스터
            </p>
          </div>
          <div className="mt-1 rounded-pill bg-white/10 px-3 py-1">
            <p className="text-[11px] text-beige/60">0.1%의 유저만 달성</p>
          </div>
        </div>
      </div>

      <p className="text-[13px] text-ink-muted">약관에 동의하셨습니다</p>
    </div>
  );
}

export default function TermsPage() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);

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
          이용약관
        </span>
        <div className="w-9" />
      </header>

      <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
        {agreed ? (
          <div className="flex flex-1 flex-col items-center justify-center">
            <AchievementBanner />
          </div>
        ) : (
          <>
            <p className="mb-3 text-center text-[15px] font-medium text-wine">
              버튼을 잡아보세요!
            </p>
            <RunawayButton onCatch={() => setAgreed(true)} />
          </>
        )}
      </div>
    </div>
  );
}
